function checkPalindroom(str) {
    return str === str.split('').reverse().join('')
}

function uniqueArray(arr) {
    let obj = {}
    let data = []
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (!obj[item]) {
            obj[item] = true
            data.push(item)
        }
    }
    return data
}

function findMaxDuplicateChar(str) {
    let obj = {}
    // 去重
    for (let i = 0; i < str.length; i++) {
        const item = str.charAt(i)
        if (!obj[item]) {
            obj[item] = 0
        }
        obj[item]++
    }
    // 假设第一个为最大字符，遍历找到最大字符
    let maxChar = Object.keys(obj)[0]
    const keyArr = Object.keys(obj)
    for (let i = 1; i < keyArr.length; i++) {
        if (obj[keyArr[i]] > obj[maxChar]) {
            maxChar = keyArr[i]
        }
    }
    return maxChar
}

function swap(a, b) {
    // 巧利用 a = a + b - a
    b = b - a
    a = a + b // a = a + b - a (替换为b)
    b = a - b // 旧b + 旧a - 旧b
    return [a, b]
}

// 最大差值 = 最大值 - 最小值
function getMaxProfit(arr) {
    let minVal = arr[0]
    let maxProfit = 0

    for (let i = 1; i < arr.length; i++) {
        minVal = Math.min(minVal, arr[i])
        const currentDiff = Math.abs(arr[i] - minVal)
        maxProfit = Math.max(maxProfit, currentDiff)
    }
    return maxProfit
}

function randomString(n) {
    const str = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const strLength = str.length // 36
    let res = ''
    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * strLength) // [0.0，1.0) * strLength
        res += str.charAt(randomIndex)
    }
    return res
}

function queryClassNameArr(node, name) {
    if (document.getElementsByClassName) {
        return node.getElementsByClassName(name)
    }
    // 注意：一个类名、多个类名；多个类名使用空格分开
    var resArr = []
    var nodeAll = node.getElementsByTagName("*")

    for (let i = 0; i < nodeAll.length; i++) {
        const classList = nodeAll[i].className.split(' ')
        for (let j = 0; j < classList.length; j++) {
            if (name === classList[j]) {
                resArr.push(nodeAll[i])
                break
            }
        }
    }
    return resArr
}

const node =
    <div>
        <div class='miny'></div>
        <div class='miny aaa'></div>
        <div class='miny2'></div>
        <div class='miny bbb'></div>
        <div class='miny1'></div>
    </div>

console.log(queryClassNameArr(node, 'miny'))