/**
 * 知识准备：https://juejin.cn/post/7094087425261043749#heading-3
 * 1、Promise
 * 2、ES6类-静态方法：类（class）通过 static 关键字定义静态方法。不能在类的实例上调用静态方法，而应该通过类本身调用。
 *  类相当于实例的原型，所有在类中定义的方法，都会被实例继承。
 *  如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
 * 
 *  静态属性与静态方法：是Class本身的属性与方法，为Class直接调用，不能在实例对象上使用。
 *  constructor()方法：是类的默认方法，通过new命令生成对象实例时，自动调用该方法。
 * 3、改变this指向等
 */


/**
 * Promise实现
 * 1、new Promise实现，包括resolve、reject回调。
 * 2、Promise.prototype.then实现
 * 3、Promise.prototype.catch实现
 * 4、Promise.prototype.finally实现
 * 5、Promise.resolve()实现
 * 6、Promise.reject()实现
 * 7、Promise.all()实现
 * 8、Promise.allSettled()实现
 * 9、Promise.race()实现
 * 10、Promise.any()实现
 */

// 手动实现
class MyPromise {
    // 类自有的静态属性
    static pendingStatus = 'pending'
    static fulfilledStatus = 'fulfilled'
    static rejectedStatus = 'rejected'

    // 类的构造器，通过new方法创建实例的时候，会自动调用该方法。形参为new 类时候的传入参数。new Promise((resolve, reject) => {})
    constructor(executor) {
        this.promiseState = MyPromise.pendingStatus
        this.promiseResult = null

        // 存放 then 函数中需要执行的 onFulfilled、onRejected 回调函数。
        // 解决当resolve在setTimeout内执行，then函数中state还是pending状态，
        // 就需要在then调用的时候，将成功和失败【先】存到各自的数组中，等到setTimeout中reject或者resolve，【再】调用它们。
        this.resolveQueue = []
        this.rejectQueue = []

        // resolve 和 reject 执行时 this 的值为 window，需要绑定 this
        executor(this.resolve.bind(this), this.reject.bind(this))

    }
    // 1.1、resolve回调函数
    resolve(res) {
        if (this.promiseState === MyPromise.pendingStatus) {
            // 使用异步微任务，保证then中回调函数已经加载。异步执行 resolveQueue 队列中保存的 onFulfilled 函数
            setTimeout(() => {
                this.promiseResult = res
                this.promiseState = MyPromise.fulfilledStatus
                if (!!this.resolveQueue.length) {
                    this.resolveQueue.forEach(cb => cb(res))
                }
            })
        }
    }
    // 1.2、reject回调函数
    reject(err) {
        if (this.promiseState === MyPromise.pendingStatus) {
            // 使用异步微任务，保证then中回调函数已经加载。异步执行 rejectQueue 队列中保存的 onRejected 函数
            setTimeout(() => {
                this.promiseResult = err
                this.promiseState = MyPromise.rejectedStatus
                if (!!this.rejectQueue.length) {
                    this.rejectQueue.forEach(cb => cb(err))
                }
            });
        }
    }
    // 2、then函数: 用来注册回调函数，将要执行的 onFulfilled、onRejected 回调函数加入到队列中
    then(onFulfilled, onRejected) {
        // 注意then函数的 1链式调用 2链式中有一个then的参数不是函数的情况

        // 判断传入的参数是否为函数，如果是函数不做任何处理；如果不是函数，创建一个函数，该函数功能:直接返回resolve 改变的值或者抛出错误
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : res => res
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }

        return new MyPromise((resolve, reject) => {
            // 情况1.如果在then调用的时候, 状态已经确定下来
            if (this.pendingStatus === MyPromise.fulfilledStatus) {
                try {
                    const result = onFulfilled(this.promiseResult)
                    resolve(result)
                } catch (err) {
                    reject(err)
                }
            }
            if (this.pendingStatus === MyPromise.rejectedStatus) {
                try {
                    const result = onRejected(this.promiseResult)
                    resolve(result)
                } catch (err) {
                    reject(err)
                }
            }
            // 情况2：执行then回调时还未确定状态，考虑到多个执行，存储到数组中
            if (this.promiseState === MyPromise.pendingStatus) {
                // 实现 onFulfilled \ onRejected的返回值，均会传递给下一次的 then 中的 onFulfilled \ onRejected函数
                this.resolveQueue.push((res) => {
                    try {
                        const result = onFulfilled(res)
                        resolve(result)
                    } catch (err) {
                        reject(err)
                    }
                })
                this.rejectQueue.push(err => {
                    try {
                        const result = onRejected(err)
                        resolve(result)
                    } catch (err) {
                        reject(err)
                    }

                })
            }
        })

    }

    // 3、catch 方法返回一个Promise ，并且处理拒绝的情况。catch 方法相当于 then(undefined,onRejected)
    catch(onRejected) {
        return this.then(undefined, onRejected)
    }
    // 4、finally方法返回一个Promise。在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数cb
    finally(cb) {
        // return this.then(() => { cb() }, () => { cb() })
        return new MyPromise((resolve, reject) => {
            if (this.promiseState === MyPromise.pendingStatus) {
                this.resolveQueue.push((res) => {
                    try {
                        cb() // 只是一个回调，返回值无用
                        resolve(res)
                    } catch (err) {
                        reject(err)
                    }

                })
                this.rejectQueue.push(err => {
                    try {
                        cb()
                        resolve(err)
                    } catch (err) {
                        reject(err)
                    }
                })
            }
        })
    }

    // Promise 的静态方法
    // 5、Promise.resolve()：返回一个以给定值解析后的Promise对象
    static resolve(res) {
        return new MyPromise((resolve, reject) => resolve(res))
    }

    // 6、Promise.reject()：返回一个带有拒绝原因的Promise对象
    static reject(err) {
        return new MyPromise((resolve, reject) => reject(err))
    }

    // 7、Promise.all()：接收一个 promise 的 可迭代类型（Array，Map，Set），并且只返回一个 Promise 对象。
    //   返回值为所有 resolve 的结果，如果出现任何一个 reject 的回调执行，则会立即抛出错误。
    static all(promiseList) {
        return new MyPromise((resolve, reject) => {
            let promiseArr = []
            promiseList.forEach(p => {
                p.then(res => {
                    promiseArr.push(res)
                    // resolve 一定写在then里面，写在外面有异步的情况，resolve([])
                    promiseArr.length === promiseList.length && resolve(promiseArr)
                }, err => {
                    reject(err)
                })
            })
        })

    }

    // 8、Promise.allSettled:只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束。
    static allSettled(promiseList) {
        return new Promise((resolve, reject) => {
            let resultList = new Array(promiseList.length), i = 0
            promiseList.forEach(p => {
                p.then(res => {
                    resultList[i] = { status: MyPromise.fulfilledStatus, value: res }
                    i++
                    if (i === promiseList.length) resolve(resultList)
                }, (err) => {
                    resultList[i] = { status: MyPromise.rejectedStatus, value: err }
                    i++
                    if (i === promiseList.length) reject(resultList)
                })
            })
            return resultList
        })
    }

    // 9、Promise.race()：返回一个 promise，一旦迭代器中的某个promise率先改变状态，promise 实例的状态就会跟着改变。
    // 率先改变状态的promise返回值传递整体promise实例的回调函数 。
    static race(promiseList) {
        return new MyPromise((resolve, reject) => {
            promiseList.forEach(p => p.then(res => resolve(res), err => reject(err)));
        })
    }

    // 10、Promise.any():只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；
    // 如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态。
    static any(promiseList) {
        return new MyPromise((resolve, reject) => {
            let resultList = []
            promiseList.forEach(p => {
                p.then(res => {
                    resolve(res)
                }, err => {
                    resultList.push(err)
                    //AggregateError:当多个错误​​需要包装在一个错误中时，该对象表示一个错误
                    if (resultList.length === promiseList.length) reject(new AggregateError(resultList))
                })
            })
        })
    }
}

console.log('=======MyPromise======start======')
let myPromise = new MyPromise((resolve, reject) => {
    // resolve('my promise resolve')
    reject('my promise reject')
}).then((res) => {
    console.log('======then1-res=====', res)
    return res // 注意！！！return
})
    .then()
    .then(res => {
        console.log('=======then2-res=====', res)
        return 'then2'
    }).catch(error => {
        console.log('=======catch==error====', error)
        return 'catch'
    }).finally((value) => {
        console.log('======finally======', value)
        return 'finally'
    }).then(res => {
        console.log('======res=====', res)  // ！注意res='catch'
    })
console.log('========MyPromise======end===')


const p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    }, 300);
})

const p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(2)
    }, 100);
})

const p3 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject(3)
    }, 500);
})

// MyPromise.all([p1, p2]).then(res => {
//     console.log('====pAll1-res====', res)
// })

// MyPromise.all([p1, p2, p3]).then(res => {
//     console.log('====pAll2-res====', res)
// }).catch(err => {
//     console.log('=====pAll2-catch====', err)
// })

// MyPromise.race([p1, p2, p3]).then(res => {
//     console.log('====pRace-res====', res)
// }).catch(err => {
//     console.log('=====pRace-catch====', err)
// })

MyPromise.allSettled([p1, p2, p3]).then(res => {
    console.log('====allSettled-res====', res)
}).catch(err => {
    console.log('=====allSettled-catch====', err)
})

// MyPromise.any([p1, p2, p3]).then(res => {
//     console.log('====any-res====', res)
// }).catch(err => {
//     console.log('=====any-catch====', err)
// })





