// 合并多项式
function mergeMuli(str) {

    const strArr = str.split('+')
    const letterReg = /[a-z,A-Z]/g, numberReg = /\d+/g
    const aMap = new Map()

    for (let i = 0; i < strArr.length; i++) {
        const letter = strArr[i].match(letterReg)[0]
        let number = strArr[i].match(numberReg)
        number = number ? +number[0] : 1

        aMap.set(letter, aMap.has(letter) ? aMap.get(letter) + number : number)
    }

    let res = ''
    for (let [key, val] of aMap) {
        res += res ? `+${val}${key}` : `${val}${key}`
    }

    return res
}

// console.log(mergeMuli('a+b+c+2b+3c'))

function fillArr(arr, indexs) {
    let a = indexs[0], b = indexs[1]
    const targetval = arr[a][b]

    let i = a - 1
    while (i >= 0) {
        // 深度遍历
    }

    i = a + 1
    while (i < arr.length) {
        // 深度遍历
    }

    let j = b - 1
    while (j >= 0) {
        // 深度遍历
    }
    j = b + 1
    while (j < arr[0].length) {
        // 深度遍历
    }
    return arr
}

const arr = [[1, 1, 1, 0, 0], [1, 0, 0, 0, 1], [0, 0, 1, 0, 1], [1, 1, 1, 0, 1], [1, 0, 1, 1, 0]]
console.log(fillArr(arr, [3, 2]))