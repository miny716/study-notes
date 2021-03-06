/**
 * 1、数据类型的判断
 * 2、迭代器（怎么为一个对象添加不可迭代的属性、迭代器的API）
 * 3、for in 与 for of的本质区别是什么（1、2、）
 * 4、JS面向对象与其他面向对象的区别
 * 5、深浅拷贝（深拷贝怎么遍历对象）
 * 6、如何遍历对象的属性
 * 
 * react
 * 1、useEffect与useLayoutEffect的区别，什么时候使用useLayoutEffect？
 * 2、hooks是怎么实现的
 * 3、react fiber调度原理是什么？
 * 4、useEvent
 * 5、react事件合成机制和普通的事件有什么区别？
 * 
 * 
 * 项目：
 * 1、热更新做了什么事情？+ 遇到的问题？
 * 2、页面加载耗时做了哪些事情？
 * 
 * 
 * 其他：
 * 1、你做这些事情，是自己想做的，还是别人推动着你做的？
 * 2、平时怎么学习的？
 * 3、怎么了解前端前沿的一些技术
 * 4、读过什么技术方面的书？
 * 5、有没有学过webpack之外的其他的打包工具？写过typescript吗？
 * 
 * 
 * 人事面试
 * 1、你有什么要问我的吗？
 * 2、用三个词评价自己？积极、热情、责任心
 */

var myObj = {
    name: "闷倒驴",
    showThis: function () {
        console.log(this); // myObj 
        var bar = () => {
            this.name = "王美丽"; console.log(this) // myObj 
        }
        bar();
    }
};
myObj.showThis();
console.log(myObj.name); // "王美丽" 
console.log(window.name); // ''
