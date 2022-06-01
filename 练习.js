
function myNew() {
    const constructor = arguments[0]
    const argus = [...arguments].slice(1)

    let obj = new Object()
    obj.__proto__ = constructor.prototype
    const res = constructor.call(obj, ...argus)

    return res || obj
}

function Person(name, age) {
    this.name = name
    this.age = age
}

let a = myNew(Person, 'miny', 200)

console.log(a)