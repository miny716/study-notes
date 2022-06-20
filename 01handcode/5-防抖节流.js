/**
 * 1、防抖debounce函数：在 n 秒内被重复触发，则重新计时。n 秒后再执行回调函数，
 * 在事件频繁触发的情况下，只有触发的间隔超过指定间隔的时候，响应函数才会执行。
 * 
 * 应用场景：
 * （1）输入框中输入内容动态地去服务端请求结果，只需用户最后一次输入完，再发送请求；
 * （2）！按钮避免用户点击太快，以致于发送了多次请求，需要防抖
 * （3）！文本编辑器实时保存，当无任何更改操作一秒后进行保存
 *
 * 2、节流throttle：控制事件发生的频率；每间隔n秒执行一次回调函数，
 * 当事件触发的时候，会执行响应函数；
 * 当事件频繁被触发的时候，节流函数会按照一定的频率来执行响应函数；
 * 
 * 应用场景：
 * （1）！滚动加载，每隔一秒计算一次位置信息。
 * （2）鼠标移动事件
 * （3）输入框中输入内容动态地去服务端请求结果，每间隔1s发送一次请求；
 */

function debounce(fn, delay) {
    let timer = null

    return function (...args) {
        if (timer) clearTimeout(timer)  // 防抖重在清零 clearTimeout(timer)

        timer = setTimeout(() => {   // 注意！！！定时器里面使用箭头函数
            fn.apply(this, args)
        }, delay);
    }
}

function throttle(fn, delay) {
    let timer

    return function (...args) {
        if (timer) return

        timer = setTimeout(() => {
            fn.apply(this, args)
            timer = null // 节流重在开关锁 timer=null
        }, delay);
    }
}