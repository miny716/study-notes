/**
 * 数组扁平化：将一个多维数组变成一个一维数组
 * 思想：遍历数组，若元素为数组，则递归；否则与之前的concat
 */

function flatten(arr) {
    return arr.reduce((acc, ele) => {
        return acc.concat(Array.isArray(ele) ? flatten(ele) : ele)
    }, [])
}

const a = [10, [[1, 2, 3]], [200, 300]]
console.log(flatten(a))

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