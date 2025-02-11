# This绑定机制

## this是什么
当一个函数被调用时，会创建一个执行上下文，它会记录函数的调用位置，调用方法，传入参数等信息。 this就是这些信息中的一个属性，会在函数执行时用到。

this既不指向函数的词法作用城，也不指向函数自身。`this是在函数被调用时才被绑定，并非函数编写或声明时绑定。它指向什么完全取决于函数在哪里被调用`。

:::info 词法作用域与执行上下文
**词法作用域**：静态的, 只要函数定义好了就一直存在, 且不会再变化。这包括全局作用域，函数作用域和块级作用域。

**执行上下文**：动态的, 调用函数时创建, 函数调用结束时上下文环境就会被自动释放。

:::
## 绑定规则

### 默认绑定

当函数调用时，如果是使用不带任何修饰和前缀的，独立的函数引用进行调用时，此时的this为默认绑定，指向`全局对象(浏览器中是window)`。
```js
function foo() {
    console.log(this.a) 
}
var a = 2;
//不带修饰和前缀的独立调用
foo()  //打印2
 ```
:::warning 注意
在strict严格模式下，全局对象无法使用默认绑定，此时this为`undefined`。
:::

### 隐式绑定

当函数调用时，存在上下文对象或者说被某个对象拥有和包含，隐式绑定规则会把this绑定到这个`上下文对象`中。

 ```js
function foo(){
 	console.log(this.a)
}
const obj ={
	 a:2,
	 foo:foo
}
obj.foo() //2
```
:::warning 注意

对象属性引用链中只有`最后一层`影响调用的this：
```js
 function foo(){
 	console.log(this.a)
}
 const obj2 ={
	 a:2,
	 foo:foo
}
 const obj1 = {
	 a:1,
	 obj2:obj2
 }

 obj1.obj2.foo() //2
```
:::

**隐式绑定的this重置现象**：

```js
 function foo(){
  console.log (this.a)
 }


 const obj = {
	  a:2,
	 foo:foo
}

 var bar = obj.foo //赋值foo的引用
 var a ="window的a"
 bar() //"window的a"
```
虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身，此时我们可以把obj.foo想象成一个新封装的独立函数，所以bar在调用时应用了默认绑定规则，此时this为全局对象，而不再是原来的上下文对象。

除此之外，当我们给一个函数A传递一个函数类型的参数B(有可能B是某个对象的属性引用)时，无论A是我们自己声明的函数还是js内置的函数(如setTimeout)，当传入的函数B被调用时，都会存在这件的this被重置为默认绑定的规象。

 ```js
 function foo(){
	 console.log(this.a)
}
 const obi ={
 	a:2,
 	foo:foo

 }

 var a ="window的a"
 setTimeout (obj.foo, 1000) //window的a
 ```

### 2.3 显式绑定

显式绑定顺名思义，我们可以主动设置并明确知道某个函数调用时的this指向。

##### apply/call

我们可以通过apply/call来修改函数调用时的this指向。

 ```js
function foo(){
    console.log(this.a)
}
const obj ={
    a:2
}
foo.call(obj) //2
```
>针对这个this指向参数，如果你传入了一个基本类型(如number或string)的值，它会自动转为封装对象(如new String(),new Number())

#### bind


但是如果是上面那种函数的引用在其他地方传递时，this丢失被重置为默认绑定的情况怎么办?这个时候没法在它调用时去修改this。这时候需要用到bind。



**bind会强制修改某个函数的this并返回一个修改this后的新函数，即使该函数在调用时又使用了call/apply/bind修改this，此时会修改无效**:

```js
function foo(){
 	console.log(this.a)
}

 const obj = {
 	 a:2
 }


var a = "window的a"
let newFoo = foo.bind(obj) 
newFoo () //2
newFoo.cal1 (window) //2
```
#### API调用时的bind

一些内置的JS API(如forEach,map)等可以提供一个可选参数来指定this,其作用与bind一致。
```js
function foo(){
 	console.log(this.a)
}

 const obj = {
 	 a:2
 }


 var a = "window的a"
 
[1,2,3].forEach(foo,obj) //2 2 2
```

### new绑定

使用new来调用函数或者说发生构造函数调用时，会发生以下行为:

> 1：创建一个全新的对象
>
> 2：这个对象会被执行原型链接
> 
> 3：函数调用的this会绑定到这个新对象
> 
> 4：如果函数没有返回引用类型值（数组，对象和函数），那么new表达式中的函数调用会默认返回这个新对象，否则使用return返回的对象。

 ```js
 function foo(a){
 	 this.a=a
}
const bar = new foo(2)
console.log(bar.a) //2

```
### 箭头函数
箭头函数的this指向永远与箭头函数定义时的上下文所指向的this一致，其他任何绑定方式都不会修改箭头函数的this指向。

### 其他场景
**非箭头函数情况下:**

- js的DOM事件监听相关API中，其国调函数的默认this指向为当前监听的DOM元素。
- 一些JS高阶函效(如未指定this参数的map，forEach等)和内置函数(如setTimeout)，其默认this指向为全局对象window。


## this绑定优先级
当一个函数同时存在多种this绑定规则时，其优先级如下：

**new绑定 > 显式绑定 > 隐式绑定 > 默认绑定**

## 被忽略的this

有时候，我们会通过call/apply/bind来传递函数的参数，如果此时我们并不需要关心this绑定（但是this需要一个占位符）。

你也许会将null/undefined作为this绑定参数传入进去，但是此时函数在调用时会忽略这样的this绑定值，从而应用的是默认绑定规则（window）。即使你不关心this指向，但是如果函数内部用到了(比如一些第三方库的函数)。那么这种情况下调用有可能会导致例如修改全局对象的一些副作用。

对此，在忽略this绑定的情况下，推荐的做法是将`Object.create(null)`返回的对象作为this绑定值传递进去。

Object.create(null)会创建一个空对象，与{}的区别在于它不会创建Object.prototype这个委托。所以它更“空”。此时，在关于函数的调用中，对于this的使用都会被限制在这个空对象中，不会对全局对象产生任何影响。

```js
function foo(a,b,c){
    console.log(this.obj)
}
var obj = {}
const empty  = Object.create(null) 
const bar =  foo.bind(empty ,1,2, 3)
bar() //undefined(没有访问到全局的obj)
```
