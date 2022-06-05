/**
 * 函数柯里化：把【接受多个参数的函数】变换成【接受单一参数的函数】，并且【返回结果】是一个【接受剩余参数的新函数】的技术。
 * 原理：就是用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行函数。
 * 用途：减少重复传递【不变的参数】。将柯里化后的callback参数传递给map, filter等函数。
 * 
 * @description: 将函数柯里化的工具函数
 * @param {Function} fn 待柯里化的函数
 * @param {array} args 已经接收的参数列表
 * @return {Function}
 */
const currying = function (fn, ...args) {
    const len = fn.length  // fn需要的参数个数

    // 返回一个函数接收剩余参数
    return function (...params) {
        // 收集参数：拼接已经接收和新接收的参数列表
        let _args = [...args, ...params]
        // 如果已经接收的参数个数还不够，继续返回一个currying继续接收剩余参数
        if (_args.length < len) {
            return currying.call(this, fn, ..._args) //!return !call !apply(this,[fn, ...args])
        }
        // 参数全部接收完，调用原函数fn，并将收集到的参数传给fn做实参
        return fn.apply(this, _args) // !return
    }
}

function sum(x, y, z) {
    return x + y + z
}
console.log(sum(1, 2, 3)) // 6

// 柯里化之后
let sumCurry = currying(sum)
console.log(sumCurry(1)(2)(3)) // 6 
