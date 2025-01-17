# JS类型检测


## 数据类型

截止自前为止，js中共有七大内置数据类型:

- string
- number
- boolean
- null
- undefined
- object
- symbol

:::info 细节
- undefined类型只有一个值`undefined`，未赋值的变量值默认都是undefined.
- object又称为`复杂类型`，其他类型统称为`基本类型`.
:::
### 值和引用
string, number等基本类型的变量值总是通过`值复制(深拷贝)`的方式来赋值/传递:

```js
let a = 2;
let b = a;
b++;
a; //2
b; //3
```
object类型(包括数组)和函数则是通过`引用复制(浅拷贝)`的方式来赋值/传递:

```js
let a = [1,2,3];
let b = a;
b.push(4);
console.log(a); //[1,2,3,4]
console.log(b); //[1,2,3,4]
```
引用指向的是值本身而并非变量，一个引用无法更改另一个引用的指向，

```js
let a = [1,2,3];
let b = a
//尝试通过重新赋值b来更改a的引用指向 
b = [3,4,5];
console.log(a); //更改失败，依然是[1,2,3] 
console.log(b); //[3,4,5]
```

### 封装对象

基本类型(string,number等)的值本身不具有属性和方法(如length和toString())，通过对应的构造函数,如`new String()`,`new Number()`进行了对象封装处理才使其拥有了属性和方法。

有意思的是，我们不需要通过手动进行对象封装而只需要字面量直接赋值(如let  a ="字符串") 就可访问其对应的属性和方法。这是因为在访问属性和万法时，JS引擎进行了对象封装的自动处理，访问完毕后又从封装对象还原成基本类型.

## 类型检测

### typeof
```js
typeof "字符串" //string"

typeof 12 //number

typeof 12/"a" //"number" 

typeof false //"boolean" 

typeof null //"objecet"

typeof undefined //"undefined" 

typeof (name:"scw") //"object"

typeof [1,2,3] //object 

typeof new Date() //object

typeof new string("字符半") //object 

typeof Symbol("name") //"symbol"

typeof function(){}  //"function"

```
注意点：

- 对于数学运算异常返回的`NaN`，对其执行typeof依然返回`number`
- null是基本类型中的唯一一个"假值”，typeof对它的返回值为`object`
- 对函数执行typeof其返回值为`function`，function是object的一个子类型

**缺点**:

- 无法进一步检测具体的object类型(比如数组)

### instanceof
针对引用赋值方式的数据类型，用typeof检测统一都会返回"object"(除了函数)。可通过instanceof来获取具体的object举型

instanceof运算符用于检测指定构造函数的prototype属性所指向的对象是否出现在某个实例对象的原型链上
```js
//非基本类型
([1,2]) instanceof Object; //true
([1,2]) instanceof Array; //true
( {name:"scw"}) instanceof Object; //true
(function (){}) instanceof Object; //true
(function (){}) instanceof Function; //true

//基本类型的字面量不可用于检测，结果统一为ralse
(1234) instanceof Object; //false
(1234) instanceof Number; //false
"字符串" instanceof Object; //false
"字符串" instanceof String; //false

//基本类型的封装对象
new Number (1234) instanceof Object; //true
new Number (1234) instanceof Number; //true
new string("字符丰") instanceof Object; //true 
new String("字符串") instanceof Strng; //true


//自定义构造函数例子
function Person(){
}

const p1 = new ferson()
p1 instanceof Person //true

```
**缺点**:

- 不可通过instanceof Object去检测具体的object类型（比如`数组，函数，封装对象值`）。因为所有的构造函数都继承自Object.prototype。所以总是返回`true`
- 通过`字面量形式`创建的基本类型值（如const a = "string"）不可用于instanceof检测，其本身并不是对象类型的实例。可通过手动封装对象(如const a = new String("string"))来解决这一问题
- 无法检测`symbol,null和undefined`，因为这些类型的值没有与之对应的构造函数

### Object.prototype.toString.call(推荐)
```js
Object.prototype.toString.call ("string") //"[object String]"
Object.prototype.toString.call (new String("string")) // "[object String]"
Object.prototype.toString.call (()=>{}) //"[object Function]"
Object.prototype.toString.call ([1,2,3]) //"[object Array]"
Object.prototype.toString.call ({a:1}) //"[object Object]"
Object.prototype.toString.call (123) //"[object Number]"
Object.prototype.toString.call (true) //"[object Boolean]"
Object.prototype.toString.call (null) //"[object Null]"
Object.prototype.toString.call (undefined) //"[object Undefined]"

 ```
可以发现，Object.prototype.toString.call非常适合检测具体的数据类型，也没有像instanceof那样的关于基本类型检测无效的问题。那么这个方法到底是怎么来的呢?

:::tip 原理 
所有对象(包括基本类型)的toString()方法原本就是从`Object.prototype`继承而来的，Object.prototype.toString()是可以`对this对象返回对应的具体数据类型的`。

但是Number，String， Function，Array等这些构造函数各自的原型在继承时`改写`了该方法.导致这些类型直接调用toString的行为逻辑不一样。
```js
({name: 123}).toString() //"[object Object]"

// 以下都是被改写了,改写后的功能不再是类型检查,而是转成字符串.
"字符串".toString()//"字符串"
(123).toString() //123
[1,2,3] .toString() // ‘1,2,3’
(()=>{}).toString()//"()=>{}"


//删除构造函数String原型上改写的toString方法
delete String.procotype.toString
// 删除后,就会内部自动沿若原型链调用Object.prototype.toString()，此时this指向依然为"字符串",所以实现了类型检测功能。
"字符串".toString()// "[object String]"
```

而如果我们直接主动调用Object.prototype.toString()时它的this指向的是`Object.prototype`,所以永远返回的是"[object Object]":

```js
Object.prototype.toString("string") //[object Object]
Object.prototype.toString(2) //[object Object]
```

我们通过`call修改其this指向`为我们需要检测类型的值即可实现真正的类型检测功能。

```js
Object.prototype.toString.call("string") //[object String]
Object.prototype.toString.call(2) //[object Number]

```
:::



### constructor
**每个对象实例默认都可以访问到一个constructor属性，这个属性值“似乎"指向创建这个对象的构造函数:**

 ```js
"string".constructor === String //true
({}) .constructor === Object //true
[1,2,3,4] .constructor === Array //true
(()=>{}) .constructor === Function //true
```

严格意义上讲，constructor并不表示"对象实例由...构造".

详见:[原型链 > 迷惑的constructor属性](/core/js/prototype.html#迷惑的constructor属性)

```js
function Person(){
}

const p1 = new ferson()
// 修改构造函数的原型对象
person.prototype = new Array()
//新建一个实例
const p2 = new Person()
//contructor指向改变了
p2.constructor === Person //false
p2.constructor === Array //true,
```
**缺点**:

- 可靠性低，constructor指向可被随意修改
- 无法检测symbol，null和undefined,因为没有与之对应的构造函数

### 其他检测

- `Number.isInteger()`

   ES6新增，判断一个值是否为整数，只有number类型的整数才会返回true

- `Number.isNaN()`

  E56新增，判斯一个值是否为NaN，只有值为NaN才会返回true(代替window.isNan)

-  `Number.isFinite()`
   ES6新增，判断一个数值是否为有限的，只有值为数字才会返回true(代替window.isFinite)

- `Array.isArray()`
  判断一个值是否为数组


## 类型转换

### 显式转换

显式转换通常只发生在主动调用存在类型转换的API方法中，如`Number()`,`Number.parseInt()`,`JSON.parse()`等

### 隐式转换

- **==**

== 允许在相等比较时可以转换类型，见下面:[值比较 > == 和 ===](#和)

- **数学符号运算**

对于变量之间做`+`运算，它的隐式转换规则与+前后变量的数据类型有关，规则比较复杂，详细规则可以自行查询。

对于变量之间微`-，*以及/`运算，那么对于非number类型的变量会预先进行对应类型的Number()转换，然后和其他number类型变量进行数字运算
 ```js
 "a" / 5;  //NaN
([]) / 5; //0
([1,2,3]) / 5;  //NaN
 true / "5" ; //0.2
"5" / ([]); //Infinity
({}) / (()=>{});  //NaN
```
- **API隐式转换**

一些JS API在操作时也会发生不易发现的隐式转换，如`window.isNaN`和`window.isFinite`在操作前会将目标值转换成number类型

## 值比较

### == 和 ===

:::warning 注意
`==` 允许在相等比较时转换类型，而 `===` 不允许
:::
我们最常用的`==`比较场景应该就是字符串和数字的比较。这里在比较时会把字符串转为数字.

关于==比较在隐式转换时的一些具体规则细节这里不再具体介绍，可自行查询。

`===` 比较时只有两种特殊情况需要注意:

- `NaN !== NaN`
- `+0 === -0`

### Object.is(a,b)

E56新增，它与===基本一致，区别在于:

- 两个NaN比较返回`true`

- +0和-0比较返回`false`

一般情况下，用===效率更高，Object.is只适用于特殊值的比较
