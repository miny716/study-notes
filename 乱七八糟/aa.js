function hotApply(options) {
    if (hotStatus !== "ready")
        throw new Error("apply() is only allowed in ready status");
    options = options || {};

    var cb;
    var i;
    var j;
    var module;
    var moduleId;

    function getAffectedStuff(updateModuleId) {
        return {
            type: "accepted",
            moduleId: updateModuleId,
            outdatedModules: outdatedModules,
            outdatedDependencies: outdatedDependencies
        };
    }

    // a中无元素，则加入
    function addAllToSet(a, b) {
        for (var i = 0; i < b.length; i++) {
            var item = b[i];
            if (a.indexOf(item) === -1) a.push(item);
        }
    }

    // at begin all updates modules are outdated
    // the "outdated" status can propagate to parents if they don't accept the children
    var outdatedDependencies = {};
    var outdatedModules = [];
    var appliedUpdate = {};
    for (var id in hotUpdate) {
        if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
            moduleId = toModuleId(id);
            /** @type {TODO} */
            var result;
            if (hotUpdate[id]) {
                result = getAffectedStuff(moduleId);
            } else {
                result = {
                    type: "disposed",
                    moduleId: id
                };
            }
            /** @type {Error|false} */
            var abortError = false;
            var doApply = false;
            var doDispose = false;
            var chainInfo = "";
            if (result.chain) {
                chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
            }
            switch (result.type) {
                case "self-declined":
                    if (options.onDeclined) options.onDeclined(result);
                    if (!options.ignoreDeclined)
                        abortError = new Error(
                            "Aborted because of self decline: " +
                            result.moduleId +
                            chainInfo
                        );
                    break;
                case "declined":
                    if (options.onDeclined) options.onDeclined(result);
                    if (!options.ignoreDeclined)
                        abortError = new Error(
                            "Aborted because of declined dependency: " +
                            result.moduleId +
                            " in " +
                            result.parentId +
                            chainInfo
                        );
                    break;
                case "unaccepted":
                    if (options.onUnaccepted) options.onUnaccepted(result);
                    if (!options.ignoreUnaccepted)
                        abortError = new Error(
                            "Aborted because " + moduleId + " is not accepted" + chainInfo
                        );
                    break;
                case "accepted":
                    if (options.onAccepted) options.onAccepted(result);
                    doApply = true;
                    break;
                case "disposed":
                    if (options.onDisposed) options.onDisposed(result);
                    doDispose = true;
                    break;
                default:
                    throw new Error("Unexception type " + result.type);
            }
            if (abortError) {
                hotSetStatus("abort");
                return Promise.reject(abortError);
            }
            if (doApply) {
                appliedUpdate[moduleId] = hotUpdate[moduleId];
                addAllToSet(outdatedModules, result.outdatedModules);
                for (moduleId in result.outdatedDependencies) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            result.outdatedDependencies,
                            moduleId
                        )
                    ) {
                        if (!outdatedDependencies[moduleId])
                            outdatedDependencies[moduleId] = [];
                        addAllToSet(
                            outdatedDependencies[moduleId],
                            result.outdatedDependencies[moduleId]
                        );
                    }
                }
            }
            if (doDispose) {
                addAllToSet(outdatedModules, [result.moduleId]);
                appliedUpdate[moduleId] = warnUnexpectedRequire;
            }
        }
    }

    // Store self accepted outdated modules to require them later by the module system
    var outdatedSelfAcceptedModules = [];
    for (i = 0; i < outdatedModules.length; i++) {
        moduleId = outdatedModules[i];
        if (
            installedModules[moduleId] &&
            installedModules[moduleId].hot._selfAccepted &&
            // removed self-accepted modules should not be required
            appliedUpdate[moduleId] !== warnUnexpectedRequire
        ) {
            outdatedSelfAcceptedModules.push({
                module: moduleId,
                errorHandler: installedModules[moduleId].hot._selfAccepted
            });
        }
    }

    // Now in "dispose" phase
    hotSetStatus("dispose");
    Object.keys(hotAvailableFilesMap).forEach(function (chunkId) {
        if (hotAvailableFilesMap[chunkId] === false) {
            hotDisposeChunk(chunkId);
        }
    });

    var idx;
    var queue = outdatedModules.slice();
    while (queue.length > 0) {
        moduleId = queue.pop();
        module = installedModules[moduleId];
        if (!module) continue;

        var data = {};

        // Call dispose handlers
        var disposeHandlers = module.hot._disposeHandlers;
        for (j = 0; j < disposeHandlers.length; j++) {
            cb = disposeHandlers[j];
            cb(data);
        }
        hotCurrentModuleData[moduleId] = data;

        // disable module (this disables requires from this module)
        module.hot.active = false;

        // remove module from cache
        delete installedModules[moduleId];

        // when disposing there is no need to call dispose handler
        delete outdatedDependencies[moduleId];

        // remove "parents" references from all children
        for (j = 0; j < module.children.length; j++) {
            var child = installedModules[module.children[j]];
            if (!child) continue;
            idx = child.parents.indexOf(moduleId);
            if (idx >= 0) {
                child.parents.splice(idx, 1);
            }
        }
    }

    // remove outdated dependency from module children
    var dependency;
    var moduleOutdatedDependencies;
    for (moduleId in outdatedDependencies) {
        if (
            Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
        ) {
            module = installedModules[moduleId];
            if (module) {
                moduleOutdatedDependencies = outdatedDependencies[moduleId];
                for (j = 0; j < moduleOutdatedDependencies.length; j++) {
                    dependency = moduleOutdatedDependencies[j];
                    idx = module.children.indexOf(dependency);
                    if (idx >= 0) module.children.splice(idx, 1);
                }
            }
        }
    }

    // Now in "apply" phase
    hotSetStatus("apply");

    hotCurrentHash = hotUpdateNewHash;

    // insert new code
    for (moduleId in appliedUpdate) {
        if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
            modules[moduleId] = appliedUpdate[moduleId];
        }
    }

    // call accept handlers
    var error = null;
    for (moduleId in outdatedDependencies) {
        if (
            Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
        ) {
            module = installedModules[moduleId];
            if (module) {
                moduleOutdatedDependencies = outdatedDependencies[moduleId];
                var callbacks = [];
                for (i = 0; i < moduleOutdatedDependencies.length; i++) {
                    dependency = moduleOutdatedDependencies[i];
                    cb = module.hot._acceptedDependencies[dependency];
                    if (cb) {
                        if (callbacks.indexOf(cb) !== -1) continue;
                        callbacks.push(cb);
                    }
                }
                for (i = 0; i < callbacks.length; i++) {
                    cb = callbacks[i];
                    try {
                        cb(moduleOutdatedDependencies);
                    } catch (err) {
                        if (options.onErrored) {
                            options.onErrored({
                                type: "accept-errored",
                                moduleId: moduleId,
                                dependencyId: moduleOutdatedDependencies[i],
                                error: err
                            });
                        }
                        if (!options.ignoreErrored) {
                            if (!error) error = err;
                        }
                    }
                }
            }
        }
    }

    // Load self accepted modules
    for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
        var item = outdatedSelfAcceptedModules[i];
        moduleId = item.module;
        hotCurrentParents = [moduleId];
        try {
            __webpack_require__(moduleId);
        } catch (err) {
            if (typeof item.errorHandler === "function") {
                try {
                    item.errorHandler(err);
                } catch (err2) {
                    if (options.onErrored) {
                        options.onErrored({
                            type: "self-accept-error-handler-errored",
                            moduleId: moduleId,
                            error: err2,
                            originalError: err
                        });
                    }
                    if (!options.ignoreErrored) {
                        if (!error) error = err2;
                    }
                    if (!error) error = err;
                }
            } else {
                if (options.onErrored) {
                    options.onErrored({
                        type: "self-accept-errored",
                        moduleId: moduleId,
                        error: err
                    });
                }
                if (!options.ignoreErrored) {
                    if (!error) error = err;
                }
            }
        }
    }

    // handle errors in accept handlers and self accepted module load
    if (error) {
        hotSetStatus("fail");
        return Promise.reject(error);
    }

    hotSetStatus("idle");
    return new Promise(function (resolve) {
        resolve(outdatedModules);
    });
}