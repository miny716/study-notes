// 浅拷贝：就是先设置一个新的对象2,通过遍历的方式将对象1的值一一赋值给对象2。
function shallowCopy(obj) {
    let newObj = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
        newObj[key] = obj[key]
    }
    return newObj
}

// 深拷贝：通过递归调用浅拷贝的方式。增加一个指针并申请一个新的内存
function deepCopy(obj) {
    if (obj && typeof obj === 'object') {
        let newObj = Array.isArray(obj) ? [] : {}

        for (let key in obj) {
            const val = obj[key]
            if (typeof val === 'object') {
                newObj[key] = deepCopy(val)
            } else {
                newObj[key] = val
            }
        }
        return newObj
    }
}

// 对象的深拷贝
let obj1 = {
    a: '1',
    b: '2',
    c: {
        name: 'Demi'
    }
}
let obj2 = deepCopy(obj1) //将obj1的数据拷贝到obj2
obj2.c.name = 'dingFY'
console.log(obj1) // {a: "1", b: "2", c: {name: 'Demi'}}
console.log(obj2) // {a: "1", b: "2", c: {name: 'dingFY'}}
