/**
 * 手写call、apply、bind方法。
 * 实现功能：1改变this指向；2借用方法
 */

let a = {
    value: 'aaa'
}

function fun(name, age) {
    this.name = name || 'name'
    this.age = age || 0
    console.log('fun函数执行了', name, age)
}

// call
Function.prototype.myCall = function (context) { // 注意：!!!不能使用箭头函数
    const txt = context || window;

    txt.fn = this // this是要调用的方法
    const args = [...arguments].slice(1)
    const result = txt.fn(...args)

    delete txt.fn // 删除手动添加的属性方法
    return result
}
fun.myCall(a, 'callname', 1)
console.log('======myCall=====', a)

// apply
Function.prototype.myApply = function (context) {
    const txt = context || window

    txt.fn = this
    const args = arguments[1] || []
    const result = txt.fn(...args)

    delete txt.fn
    return result
}

fun.myApply(a, ['applyname', 2])
console.log('======myApply=====', a)

// bind 注意：bind方法需要手动调用一次方法，所以返回的是一个方法
Function.prototype.myBind = function (context) {
    // ====判断this是不是函数，即是不是函数调用该方法。如果不是，抛出错误
    if (typeof this !== 'function') {
        console.error('type error')
    }
    // =====上面两个也可以加=======
    const txt = context || window

    txt.fn = this
    const args = [...arguments].slice(1)

    const resultFun = function () {
        return txt.fn(...args)
    }

    return resultFun
}
fun.myBind(a, 'bindname', 3)()
console.log('====myBind=====', a)