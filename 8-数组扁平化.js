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