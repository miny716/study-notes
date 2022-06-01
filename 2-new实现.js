/**
 * new功能：创建构造函数实例对象。
 */

function Person(name, age) {
    this.name = name || "name"
    this.age = age || 0
    this.sayHi = function () {
        return 'sayHi'
    }
}

const a = new Person('miny-a', 1) // [constructor, ...args]
console.log('=====a=====', a.name, a.age, a.sayHi())

// 实现 new
function myNew() {
    const constructor = arguments[0]
    const args = [...arguments].slice(1)

    const obj = new Object()  // 1、新建对象

    obj.__proto__ = constructor.prototype; // 2、新对象的下划线原型 指向 构造函数的原型对象
    const result = constructor.apply(obj, args) // 3、构造函数的this指向新对象，并给新对象添加属性

    return typeof result === 'object' ? result : obj // 4、返回新对象
}

const b = myNew(Person, 'miny-b', 2)
console.log('=====b=====', b.name, b.age, b.sayHi())