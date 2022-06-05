function Person(name, age) {
    this.name = name
    this.age = age
}

Person.prototype.sayHi = () => {
    console.log('sayHi')
}

function Student(name, age, sex) {
    // 1、借用构造函数
    Person.call(this, name, age)
    this.sex = sex
}
// // 2、原型继承
// Student.prototype = new Person('miny', 18)

// Student.prototype.study = () => {
//     console.log('study')
// }

// let p1 = new Student("name1", 12, '女')
// let p2 = new Student("name2", 13, '男')

// console.log(p1.name, p2.name)

// 3、寄生组合继承
function object(o) {
    function Fun() { }
    Fun.prototype = o
    return new Fun()
}
function inherit(child, parent) {
    const prototype = object(parent.prototype)
    prototype.constructor = child
    child.prototype = prototype
}

inherit(Student, Person)

let p1 = new Student("name1", 12, '女')
let p2 = new Student("name2", 13, '男')

console.log(p1.name, p2.name)
p1.sayHi()
p2.sayHi()


// 寄生组合继承

