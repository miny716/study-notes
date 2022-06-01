/**
 * 1、防抖debounce函数：n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时
 * 在事件频繁触发的情况下，只有触发的间隔超过指定间隔的时候，响应函数才会执行。
 * 
 * 应用场景：
 * （1）输入框中频繁地输入内容，频繁搜索或者提交信息；
 * （2）点击提交表单后，用户在结果还没出来的时候重复触发。
 *
 * 2、节流throttle：n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效
 * 当事件触发的时候，会执行响应函数；
 * 当事件频繁被触发的时候，节流函数会按照一定的频率来执行响应函数；
 * 
 * 应用场景：（和防抖差不多，两种不同的实现方案）
 * （1）用户频繁的点击按钮
 * （2）鼠标移动事件
 * （3）监听页面的滚动事件
 */

function debounce(fn, delay) {
    let timer = null

    return function (...args) {
        if (timer) clearTimeout(timer)

        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay);
    }
}

function throttle(fn, delay) {
    let first = true

    return function (...args) {
        if (!first) return

        first = false
        setTimeout(() => {
            fn.apply(this, args)
            first = true
        }, delay);
    }
}
