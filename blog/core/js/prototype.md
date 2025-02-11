# 原型链

## 基本概念

```js
 funetion Person(){
 }
 const p1 = new Person()
 
 Person.prototype  //Object
 Person.prototype ===  p1.__proto__ //true
 Person.prototype.__proto__ === Object.prototype //true
 
 Array.prototype //[]
 Array.prototype === []. _proto //true
 Array.prototype.__proto__ === Object.prototype //true
 
 Object.prototype //Object {}
 String.prototype //String (length; 0, [[Primitivevalue]l:"") 
 Function.prototype //function (){}
```

**每个对象实例都有一个_proto_属性，每个构造函数都有一个prototype属性**

:::warning 注意
`_proto_`属性并不是标准，目前没有兼容所有浏览器。
:::

设constructor为某构造函数，obj为由该构造函数生成的对象实例，则有以下定义：

```js
constructor.prototype === obj._proto_
constructor.prototype._proto_ === Object.prototype 
Object.prototype._proto_ === null
```

:::tip 结论
- 每个构造函数的prototype指向的对象都是不同的，独一无二的。
- 构造函数的`prototype`属性和对象实例的`_proto`_指向统一的原型对象(但是注意实例与构造函数的原型有直接的关系，与构造函数本身没有)。
- 所有对象的原型链顶端都指向`Object.prototype`这个对象，而后者的原型对象指向了`null`。
- 任意构造函数的prototype(或者说任意对象实例的_proto_)都是Object的一个对象实例。
:::

## 对象属性获取
设obj为某一个对象实例，执行`console.log(obj.foo)`，发生了什么:

获取(或者说引用)对象实例的某个属性时，会先检查该对象实例本身是否直接包含该属性，如果有就使用它(即get操作);没有则会通历其原型链，如果最终仍然找不到，则返回undefined。

## 对象属性设置

设obj为某一个对象实例，执行`obj.foo = 'bar'`，发生了什么?

- 如果obj对象中直接包含了名为foo的属性，则会修改已有的直接属性值。

- 如果obj对象没有直接包含名为foo的属性，就会历其原型链，如果仍然找不到名为foo的属性，则foo会被添加到obj的直接包含属性中。

- 接上一条，如果遍历其原型链时存在对应的foo属性，并且该属性可写(`writable:true`)，则foo会被添加到obj的直接包含属性中。即此时原型链上对应的属性被屏蔽。
- 接上一条，如果遍历其原型链时存在对应的foo属性，并且该属性只读(`writable:false`)，则不会修改该属性或者创建该对象实例的直接属性，总之什么都不会发生(在非严格模式下会抛出错误)。
- 接上一条，如果遍历其原型链时存在对应的foo属性，并且该属性是一个`setter`，那就一定会调用这个setter。此时不会添加为obj的直接包含属性。

## 迷惑的constructor属性

```js
 function Person(){
    /**/
}

 const p1 = new Person()
 
 Person.prototype.constructor === Person //true
 p1.constructor === Person //true
```
上面代码中，我们发现构造函数的prototype默认有一个constructor属性，而创建的对象实例默认也有一个constructor属性。它们都统一的指向了构造函数本身，这“似乎”表明这个属性指向“创建这个对象的函数”或者“对象实例由...创建”

**实际上，对象实例本身并没有constructor 属性，而且这个属性井不表示由...构造。**

首先我们需要消除一个容易存在的误区：

:::tip 注意
所有的函数声明（无论它的声明首字母是否大写)都是普通函数， 函数本身不是构造函数， 当且仅当你使用new时，函数调用会变成”构造函数调用”
:::
根据上面的例子，我们来揭开constructor属性的真面目:

- Person.prototype的constructor属性只是Person函数在声明时的默认属性，它默认指向Person本身。
- 当通过new Person生成的对象实例所能访问的constructor属性其实是依据原型链访问到了Person.prototype.constructor。 
- 如果我们修改了Person.prototype的指向，其对应的constructor不会保留原有的值，即不再是Person。

见下方示例:


```js
 function Person() {
        /**/     
}

 const p1 = new Person()
 p1.constructor === Person //true
//修改构造函数的原型对象
 Person.prototype = new Array()
//新建一个实例
 const p2 = new Person()
 
//constructor指向改变了
p2.constructor === Person //false
p2.constructor === Array//true

```

**代码解析:**

- 先通过new Person()创建一个对象实例，访问`p1.constructor`，其本身设有该属性，所以按照原型链访问到`Person.prototype`（即`p1.__proto__`），由于Person在声明时使得`Person.prototype`默认有了该属性，所以访问到了。其值指向了Person。
- 接着我们修改`Person.prototype`为一个Array构造函数的象实例，然后再通讨new Person生成一个对象实例p2。此时访问`p2.constructor`。同理，p2本身无该属性，然后顺着原型链访问到了`Person.prototype`，此时它已被修改，使得原有的constructor值已丢失。所以会继续按照原型链访问`Person.prototype.__proto__`，即`new Array().__proto__`，也就是`Array.prototype`。而与Person同理，`Array.prototype.constructor`默认指向的是构造函数Array，所以访问p2.constructor就指向了Array。


**如果constructor属性表示由...构造，那么Person的对象实例的constructor属性应该永远指向Person，显然实际并不是这样的。**


## 原型继承

通过更改原型对象的默认指向，然后就能拿到该对象的属性和方法，从而实现`原型继承`。

设Bar和Foo是两个不同的构造函数,我们想让Bar"原型继承"Foo,可通过以下两种方式：

- Bar.prototype === Object.create(Foo.prototype)
- Object.setPrototypeOf(Bar.prototype,Foo.prototype)
