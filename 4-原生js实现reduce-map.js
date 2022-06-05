/**
 * 手写reduce
 */
Array.prototype.reduce = function (cb, initVal) {
    const arr = this
    let total = initVal || arr[0]  // return结果，如果初始值存在，取初始值；不存在的话，取数组第一项

    // 有初始值从0开始遍历，没有的话从1开始遍历
    for (let i = initVal ? 0 : 1; i < arr.length; i++) {
        total = cb(total, arr[i], i, arr) // 赋值给total
    }
    return total
}