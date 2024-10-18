# JS零碎

## 数组异步遍历

数组本身的遍历方法（forEach，map,some,every,filter）并不支持async/await。这是因为这些函数都是`同步`的，它们不会等待异步操作（如Promise）完成。

但是通过`Promise.all`配合map可以实现：

```js
const arr = [1, 2, 3];

const asyncRes = await Promise.all(arr.map(async (i) => {
    await sleep(10);
    return i + 1;
}));

console.log(asyncRes);
// 2,3,4
```

此外，`for of`循环原生支持async/await 异步遍历。

## Map vs Object

比较：

- Object的key只能是`数字、字符串、Symbol`；Map的key可以是`任意类型`；
- Map是迭代对象；Object不可以迭代；
- Map会记录写入顺序；Object会对key进行序列化后按照字典排序；
- Map有内置各种操作函数；Object没有；


:::tip 总结
- 数据量大，频繁写入用Map
- 对写入顺序有要求使用Map
- 多层数据嵌套用Object，链式读取方便
:::

## Web页面生命周期事件

- `DOMContentLoaded`： 事件在 HTML 和 DOM 树加载完成后触发（资源尚未加载完成，比如图片，音频），适用于执行与 DOM 相关的初始化操作。

- `load`： 事件在整个页面及其外部资源加载完成后触发，适用于执行与页面渲染和交互相关的操作。

- `beforeunload`： 事件在页面即将被卸载之前触发，适用于询问用户是否确定离开页面或执行一些清理操作。

- `unload`： 事件在页面被卸载后触发，适用于执行最后的清理操作。


## WeakSet/WeakMap

WeakSet是一个集合，其元素只能是对象或者Symbol类型。

WeakMap是一个键值对的集合，其中键只能是对象类型，且键名所指向的对象是弱引用。

二者共同的作用：`如果集合中的对象没有其他引用，那么这些对象可以被垃圾回收机制自动回收，从而避免内存泄漏`。

典型应用：**防止DOM移除而意外导致的内存泄露**
:::code-group
```js [WeakSet用法]
// 创建一个WeakSet来存储激活的DOM元素  
const activeElements = new WeakSet();  
  
// 假设这是当用户与DOM元素交互时触发的函数  
function elementActivated(element) {  
    activeElements.add(element);  
    console.log(`${element.id} 已成为激活元素`);  
}  
  
// 假设这是当元素被移除时触发的函数  
function elementRemoved(element) {  
    // 由于WeakSet的弱引用特性，我们不需要显式地从集合中移除元素  
    // 当元素不再有其他引用时，它将被垃圾回收机制自动处理  
    console.log(`${element.id} 已被移除`);  
}  
  
// 示例：使用函数  
const myElement = document.getElementById('myElement');  
elementActivated(myElement); // 假设#myElement是页面上的一个元素  
  
// 假设在某个时刻，这个元素被从DOM中移除了  
// 这里不需要调用elementRemoved，因为一旦没有其他引用指向myElement，  
// 它就会被垃圾回收，同时WeakSet中的引用也会自动失效  
  
// 注意：在实际应用中，你可能需要监听DOM的变动来触发elementRemoved，  
// 但这里的重点是展示WeakSet如何自动处理垃圾回收。
```
```js [WeakMap用法]
// 创建一个WeakMap来存储DOM元素与其元数据的映射  
const elementMetadata = new WeakMap();  
  
// 假设这是设置元素元数据的函数  
function setElementMetadata(element, metadata) {  
    elementMetadata.set(element, metadata);  
}  
  
// 假设这是获取元素元数据的函数  
function getElementMetadata(element) {  
    return elementMetadata.get(element);  
}  
  
// 示例：使用函数  
const myElement = document.getElementById('myElement');  
setElementMetadata(myElement, { type: 'button', role: 'submit' });  
  
console.log(getElementMetadata(myElement)); // 输出: { type: 'button', role: 'submit' }  
  
// 假设在某个时刻，这个元素被从DOM中移除了  
// 由于WeakMap的弱引用特性，当myElement没有其他引用时，  
// 它将被垃圾回收，同时WeakMap中的映射也会自动失效
```
:::

## script标签

- 只有定义了`type=module`的script标签才会被当做ES6模块，即才可以出现import或export关键字。
- 指定了src属性的script标签如果在标签内部，即`<script></script>`之间再包含其他js代码，则该js代码会被`忽略`。
- 通过js动态创建的script脚本会默认添加`async`属性。
- defer和async属性介绍详见：[浏览器渲染机制 > HTML解析](/advance/browser-render.html#html解析)

## 垃圾回收机制

- **引用计数法**

记录某个对象被引用的次数，比如该对象被赋值给一个变量则+1，然后该变量又被赋值给另一个变量则+1。

当引用该对象的变量被其余对象重新赋值，则该对象引用次数-1.当该对象的引用次数变成0时，就会被回收。 

定义在函数内部的变量，函数执行完毕后，这些变量都要分别对引用的对象次数-1。

> 优点: 即时回收，引用次数变成0就会立即回收 不用从头到尾深度遍历作用域。

> 缺点: 计数器占用位置可能会很大 循环引用问题，现代JavaScript引擎中较为少见。

- **标记清理法**

标记阶段：
从全局作用域往里逐层不断的进行深度遗历，当遍历到堆对象，则说明该对象被引用着，则打上一个标记，继续遍历到最后一层。

清除阶段：
同样逐层遍历，将没有打上标记的对象进行回收 这种方式是个定时任务，程序时每隔一段时间运行一次

> 优点: 实现简单，不存在循环引用的问题（两个互相引用的对象，没有与作用域进行连接。所以遍历时不会被标记。

> 缺点：碎片化(内存零零散散的存放,造成资源浪费);回收不及时


## 自定义html属性

使用`data-xxx`给html标签添加自定义属性，并且通过`dataset`来访问或修改自定义属性:
```js
<div id="myDiv" data-appId="12345"></div>

// js获取和修改
const div= document.getElementById('myDiv')
let appId = div.dataset.appId
div.dataset.appId = '23456'

```

## Promise

- 调用resolve或reject并不会终结 Promise 的参数函数的执行,所以一般需要加上return。
- 如果没有指定catch回调函数（即没有设置catch捕获错误），那么内部发生的错误不会传递到外层代码，即不会被外部的try/catch捕获到。浏览器依然会报错，但不会终止运行。
- Promise相关api
  :::tip
  - Promise.all(promiseArray)：只要有一个reject则整体reject；所有都resolve才整体resolve;
  - Promise.allSettled(promiseArray)：所有promise实例状态确定了后(resolve或reject)触发，且最终整体状态固定是resolve。
  - Promise.race(promiseArray)：第一个resolve或reject后，就会整体resolve或reject;
  - Promise.any(promiseArray)：表示出现第一个resolve则整体resolve；或者所有reject后则整体reject。
  - Promise.finally()：表示当前promise实例执行完毕，但你无法知道是resolve还是reject，且不接收任何参数。主要应用一些异步执行完毕后的通用或者公共操作。
  - Promise.resolve(params)：params为promise对象则返回值为传入promise对象实例本身；params为其他值则返回值为一个resolve的promise实例，传入值作为resolve的值。
  - Promise.reject(params)：返回值为一个reject的promise实例，params固定作为reject值。
  :::
- promise`特点`：状态改变后不再改变（单决议），无法取消，可能吞掉错误（如果不设置catch回调），链式非相同实体（即then和promise不是同一个promise对象），性能低于callback。
- 在then中resolve或者return一个promise对象实例，则会在该promise对象状态改变时才会调用下一个then或catch的回调函数。
- 即使在resolve后续还有同步代码，也会在先执行后续同步代码再执行then。

## async & await
- 正常情况下，await命令后面跟一个 Promise对象，await执行的返回值为resolve值。如果不是 Promise 对象，则await执行的返回值为其`后面对象本身`。
- 任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。
- 如果await命令后面是一个thenable对象（即定义了then方法的对象），那么await会将其等同于 Promise 对象。
  ```js
   class Sleep {   
       constructor(timeout) {
           this.timeout = timeout;   
      
       }   
       then(resolve, reject) {
           const startTime = Date.now();
           setTimeout(
             () => resolve(Date.now() - startTime),
             this.timeout
           );   
        } 
    }
    const func = async()=>{
        const sleepTime = await new Sleep(1000);  
        console.log(sleepTime)
    } 
    func()  
  ```
- 没有await操作的async函数基本和普通函数一致。

## Proxy & Reflect

- **Proxy**

```js
const target = {id:'111'}
const handler={
   get (){
      return "访问proxy任意属性都会返回这个"
   }
}

const proxy = new Proxy(target,handler)
console.log(proxy.id) //"访问proxy任意属性都会返回这个"

console.log(proxy==target) //true
console.log(proxy===target) //false

```
:::warning 注意
- 当handler为一个空字面量对象{}时，对target源对象执行的任何操作(例如修改属性值)都会同步反映到proxy对象上，反过来也是一样。
- 不可对某proxy实例通过`instance of Proxy`来检测。因为Proxy.prototype为`undefined`。

:::


- **Reflect**

Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。

这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，`不管Proxy怎么修改默认行为，你总可以在Reflect上调用原始对象的默认行为`。

```js

const obj = {a:'1'}
const loggedObj = new Proxy(obj, {
  get(target, name) {
    return '我是拦截后的get返回值'
  
  },
  deleteProperty(target, name) {
    return '我是拦截后的deleteProperty返回值'
  },
  has(target, name) {
    console.log('has' + name);
    // 返回默认行为的返回值
    return Reflect.has(target, name);
  }
});
console.log(obj.a) //1
console.log(loggedObj.a) //'我是拦截后的get返回值'
console.log(Reflect.get(obj, 'a')) // 1
```

## Array

- Array.from

将`类数组对象`（拥有一个length属性和索引元素的任何对象）或`可迭代对象`（包括Map和Set等）转换成一个真正的数组。

```js
Array.from({
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
} )  // ["a", "b", "c"]  


Array.from('hello') //["h", "e", "l", "l", "o"] 

Array.from(new Set([1, 2, 3, 2, 1])) //[1, 2, 3] （去重）  

Array.from(new Map([[1, 'one'], [2, 'two'], [3, 'three']])) // [[1, 'one'], [2, 'two'], [3, 'three']]

```

- Array.of

:::warning 出现背景
`new Array()`如果只有一个数字参数时，该参数会被视为数组的长度设置值，而不是数组的一个元素（如new Array(3)）则会创建一个有3个”空单元”的数组。

`Array.of()`就是来修复这个问题的，并且替代new Array()。
:::

```js
Array.of(1, 2, 3) //[1, 2, 3]  

Array.of('a') //['a']
```

- find和findIndex可以查找`NaN`，indexOf不行

```js
[NaN].indexOf(NaN) // -1
        
[NaN].findIndex(item => Object.is(NaN, item)) // 0
```

## let/const

- 只要块级作用域内存在let/const命令,在let/const声明之前，该变量不可使用。此外，在let声明前对其变量执行typeof会报错，而不会是undefined
- let不允许在相同作用域内，重复声明同一个变量（无论是用let/const/var重复声明）
- 块级作用域替代了立即函数表达式的作用
- 同时定义window.a=2和let a=3（无论定义顺序如何），则访问的是let的值（可能是因为let的块级作用域较小吧）

## class

- class本质是个函数function类型（typof返回值为'function'），但它`不会声明提升`。
- super关键字

  （1）super在子类constructor中作为函数进行super()调用时指向父类的构造函数，且作为函数的super()只能在constructor中使用。

  （2）super作为对象通过super.xxx使用时在class普通方法中，指向`父类的原型对象`；在静态方法中，指向`父类`。这意味着当super指向父类的原型对象，所有定义在父类实例上的方法或属性，是无法通过super在子类中调用的。


- 子类的constructor中`必须super()`之后才可以使用this。可以理解为父类构造器创建并初始化你的实例this（将父类的实例属性和方法添加到子类的this上）。


- class的所有普通方法都定义在类的prototype属性上面，这意味实例都可以访问这些方法。如果要定义原型对象上的属性而非方法，则只能通过`Class名.prototype.xxx=xxx`来定义。

- 静态方法适合`封装工具类方法或者需要访问静态属性或者执行关于类的操作`。静态方法中this指向当前`类`，而非实例。且子类会继承父类静态方法。
- 除了私有属性，extends会继承父类的所有属性和方法，包括静态方法。

示例：

```js
class Father {
    constructor(name){
        this.gender = 'male'
        this.name = name
    }
    static getNow(){
        return Date.now()
    }
    // 相当于Father.prototyp.getName=function(){...}
    getName() {
        return this.name
    }
}
class Son extends Father {
    constructor(name,age) {
      super(name);
      this.age=age
    }
   static getYear(){
        return new Date().getFullYear()
   }
   getMyData(){
        // this指向当前实例，super指向父类的原型对象
        console.log(`my age：${this.age}；my name:${super.getName()}`)
   }
    static getChildNow(){
        // this指向当前类
        console.log(this.getYear())
        // super指向父类
        return super.getNow()
    }
}

const father = new Father('James')
const son = new Son('James Jr',1)
console.log(son.name) //James Jr
console.log(son.age) //1
console.log(Son.getChildNow()) //2024，1720582722143
console.log(son.getMyData()) //my age：1；my name:James Jr
```

## ES Module

- 如果导出的是引用类型的值，在导出后在模块内部进行了内部修改（如push,pop或添加对象属性等方式），则导入该模块的文件中获取的值也一定是修改后的值。
- 针对`export default a`语句（默认导出），导出后在导出后在模块内部重新对xxx进行了赋值，则则导入该模块的文件中获取的值依然是重新赋值前的值，即`值不变`。
- 针对非export default xxx的导出语句（如export a 或export { a as default}），导出后在导出后在模块内部重新对a进行了赋值，则则导入该模块的文件中获取的值是重新赋值后的值，即`值更新`。
- 导入模块的文件对导入的模块是`只读`的，不可修改导入的模块。
- import引入的模块声明是会`自动提升`的，可以在import语句之前使用引入的模块。
- ES6模块是异步加载和执行的，模块顶级的this为undefined。且模块中的var声明不会添加到window对象。
- import是静态执行，所以不能使用表达式和变量，即不能在条件语句中使用；
- 与Commonjs（node）区别

  | 特性     | ES Module                                                            | CommonJS                             |
  |--------|----------------------------------------------------------------------|--------------------------------------|
  | 语法     | import/export                                                        | require/module.exports               |
   | 加载机制   | 静态分析和编译时优化，可以在编译期间确定模块的依赖关系，并支持异步加载模块。                               | 采用运行时加载机制，即模块在需要时才会被加载和执行，且只能同步加载模块。 |
  | 作用域    | 模块作用域是静态的，变量和函数在模块内部定义，不会污染全局作用域。<br/>import和export语句在编译时会被提升到模块的顶部。 | 模块作用域是动态的，模块中定义的变量和函数会被添加到全局作用域中。<br/>require调用不会提升。                       |
   | 动态按需导入 | 支持                                                                   | 不支持                                  |

## Symbol

Symbol表示独一无二的值。它是用来创建唯一标识符的。

即使你多次调用 Symbol() 生成新的符号，它们也是互不相同的。

应用场景：

- **对象唯一属性名**

使用Symbol定义属性名可防止后续属性名冲突,也可模拟不可被外部访问的私有属性
```js
let userId = Symbol('id');  
let userName = Symbol('name');  
  
let user = {  
  [userId]: '12345',  
  [userName]: 'John Doe',  
  // 普通的字符串属性  
  age: 30  
};  
  
console.log(user[userId]); // 输出: 12345  
console.log(user[userName]); // 输出: John Doe  
console.log(user.age); // 输出: 30  

// 除非有对应key的symbol引用，否则无法访问指定key的属性值
// 尝试通过字符串访问Symbol属性会失败  
console.log(user['id']); // undefined  
console.log(user['name']); // undefined
```



- **作为常量使用**

常量通常无需记住其具体值，只需要知道它和其他常量是不一样的值即可。通常可用来消除魔术字符串现象。

```js
function getArea(shape, options) {   
 let area = 0;
   switch (shape) {
     case 'Triangle': // 魔术字符串
       area = .5 * options.width * options.height;
       break;
     case 'Circle': // 魔术字符串


   }
 
   return area; 
}
 
getArea('Triangle', { width: 100, height: 100 }); 
getArea('Circle', { width: 200, height: 200 }); 

```
仔细分析，可以发现函数参数`shape`等于哪个值并不重要，只要确保不会跟其他shapeType属性的值冲突即可。因此，这里就很适合改用Symbol值。

使用Symbol优化： 
```js
const shapeType = { 
    triangle: Symbol(),
    circle:Symbol()
}
function getArea(shape, options) {   
  let area = 0;   
  switch (shape) {
   case shapeType.triangle:
     area = 5 * options.width * options.height;
     break;
    case shapeType.circle:
          /* ... more code ... */
  }   
 return area; 
 }

getArea(shapeType.triangle, { width: 100, height: 100 });
getArea(shapeType.circle, { width: 200, height: 200 });
```

## Web Worker

Web Worker 的作用，就是为 JavaScript 创造**多线程**环境，允许主线程创建 Worker 线程，用Worker线程去执行**计算密集型或高延迟**的任务，可以避免主线程被阻塞。

#### 分类

- 专用线程：只能被创建该Woker的脚本访问（**主要使用**）

- 共享线程：可以被多个脚本所访问。为跨浏览器 tab 共享数据提供了一种解决方案。

#### 使用限制

- Worker 线程运行的脚本文件，必须与主线程的脚本文件同源
- Worker 线程无法读取本地文件（file://）
- Worker 线程无法读取主线程所在网页的document、window、parent等对象
- Worker 线程不能执行alert()方法和confirm()方法

#### 适用场景
前端导出生成excel， 图片批量压缩等cpu密集型任务

实例：

:::code-group
```js  [main.js]
<div>计算从 1 到给定数值的总和</div>
<input type="text" placeholder="请输入数字" id="num" />
<button onclick="calc()">开始计算</button>
<span>计算结果为：<span id="result">-</span></span>

<div>在计算期间你可以填XX表单</div>
<input type="text" placeholder="请输入姓名" />
<input type="text" placeholder="请输入年龄" />


function calc() {
  const worker = new Worker('./worker.js')

  function calc() {
    const num = parseInt(document.getElementById('num').value)
    worker.postMessage(num)
  }

  worker.onmessage = function (e) {
    document.getElementById('result').innerHTML = e.data
  }
}

```
```js [worker.js]

function calc(num) {
  let result = 0
  let startTime = performance.now()
  // 计算求和（模拟复杂计算）
  for (let i = 0; i <= num; i++) {
    result += i
  }
  // 由于是同步计算，在没计算完成之前下面的代码都无法执行
  const time = performance.now() - startTime
  console.log('总计算花费时间:', time)
  self.postMessage(result)
}

self.onmessage = function (e) {
  calc(e.data)
}

```


## 闭包

闭包就是可以记住并继续访问一个已执行完毕的函数的**词法作用域**（或者说访问一个已经执行完毕的函数的内部变量）。所以在`定时器，事件监听，异步请求`这些用到了回调函数的地方都用到了闭包。

```js

//闭包实例代码
function fn1() {
  let a = 1;
  function fn2() {
    a++;
    console.log(a);
  }
  return fn2;
}
const fn2 = fn1();
//闭包函数执行完后外部作用域变量仍然存在，并保持状态
fn2() //2
fn2() //3

```
**优点：** 缓存变量状态，延长变量生命周期。可应用于封装私有变量来实现模块化等场景

**缺点：** 增加内存占用，影响性能。

#### 应用场景

## 内存泄漏

- **意外的全局变量**：

  由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。

  ```js
  function myFunction() {  
      leak = "这是一个全局变量，可能导致内存泄露";  
  }  
  myFunction();
  ```
  **解决方法**：尽量使用 let 和 const 在局部作用域中声明变量。

- **被遗忘的计时器或回调函数**：

  设置了 setInterval定时器，而忘记取消它，如果循环函数有对外部变量的引用的话，那么这个变量会被一直留在内存中，而无法被回收。

  ```js
  var someResource = getData();  
  setInterval(function() {  
      var node = document.getElementById('someId');  
      if (node) {  
          // 处理 node  
      }  
  }, 1000);  
  // 如果这个间隔调用函数被忘记清除，即使节点不再需要，它也会继续执行
  ```
  **解决方法**：使用 clearInterval 和 clearTimeout 清理不再需要的定时器，以及使用 removeEventListener 移除不再需要的事件监听器。

- **脱离 DOM 的引用**：

  获取一个 DOM 元素的引用，而后面这个元素被删除，由于一直保留了对这个元素的引用，所以它也无法被回收。

  ```js
  var elements = [];  
  function removeElement() {  
      var element = document.getElementById('someElement');  
      document.body.removeChild(element);  
      elements.push(element); // 虽然dom树移除了该元素，但这里的引用阻止了元素被垃圾回收  
  }
  ```

  **解决方法**：在 DOM 元素被移除后，清理对它们的引用。。

- **不合理的闭包**：

  不合理的使用闭包（闭包本身不属于内存泄漏，因为我们需要使用闭包的变量），从而导致某些变量一直被留在内存当中。

  ```js
  function outerFunction() {  
      var largeObject = {}; // 假设这是一个很大的对象  
      return function innerFunction() {  
          // 使用 largeObject  
      };  
  }  
    
  var myFunction = outerFunction(); // myFunction 持有对 largeObject 的引用
    myFunction()  
   myFunction()  
  // 如果 myFunction 一直被引用，largeObject 也不会被垃圾回收
  ```

  **解决方法**：确保闭包中的变量在不再需要时可以被垃圾回收，例如`myFunction = null`。


## 其他

- `Object.create()`：创建一个原型对象指向**传入参数**的空对象

  `{}`：创建一个原型指向**Object.prototype**的空对象

- 可通过在对象中使用`super`关键字访问该对象的原型对象
- mouseenter/mouseleave：只会在绑定元素本身触发事件，不考虑其子元素。
  mouseover/mouseout：会在经过元素本身，子元素时都触发该事件。
- js函数中的传参都是按值传递的，但如果传递的是引用类型值并在函数中修改了其内部(比如push或添加属性)，则函数外步也会反映该变化。因为此时这种操作访问的是外部作用域的堆内存中的对象引用.

  ```js
  function func(obj){
      obj.a=1
  }
  const obj = {a:2}
  func(obj)
  console.log(obj.a) //1
  ```
- 数组或对象里的元素或属性为普通函数声明时，函数调用的this指向`当前数组或对象`。为箭头函数则指向全局`window`。
- `Web Worker`适用于处理密集型数学计算;压缩，音频分析和图像处理等数据处理;高流量网络通信。
- array.slice()，array.concat()和扩展运算符[..arr]是等价的。
- setTimeout并不是在时间到后执行回调函数。而是时间到后把回调函数`添加到事件循环队列中`，所以它的时间精度并不精确。
-  `e.currentTarge`t是指注册了事件监听器的dom对象，`e.target`是指实际触发了这个事件的dom对象。e.currentTarget元素一般是包含e.target元素的。
- JSON.stringify遇到`undefined，function和symbol类型`的属性值时会自动忽略该属性，如果这些类型出现在数组中则会变成`null`。
  ```js
  const obj = {
    a:'1',
    b:undefined,
    c:()=>{},
    d:Symbol()
  }
  const arr = ['1',undefined,Symbol(),()=>{},2]
  
  console.log(JSON.stringify(obj)) //{"a":"1"}
  
  console.log(JSON.stringify(arr)) //["1",null,null,null,2]
  ```  
- 函数中定了try finally语句，且try中有return。则return会在finally执行后再返回。如果try和finally同时有return，则后者会覆盖前者的值。 
- case如果匹配的就是switch的值，则该匹配算法与===一致
- 在函数内部调用`new.target`判断是否函数是通过new调用的。在class中new.target返回当前类。
  ```js
  function Person(){
        console.log(new.target)
  }
  Person()  //undefined
  const per = new Person() //ƒ Person(){console.log(new.target)}
  ``` 
- 函数声明提升

  函数的声明提升只对`函数声明`（如function foo(){}）有效，对函数表达式无效(如const a=function(){})。

  此外`函数声明提升比变量提升优先级高`，这会导致同名的变量一定会被忽略掉(无论函数声明与变量声明的各自前后顺序如何)。如果存在多个同名的函数声明，后面的会覆盖前面的。

  ```js
  var c = 1
  function c(c) {
    console.log(c)
    var c = 3
  }
  c(2) //Uncaught TypeError: c is not a function
  
  // 上述代码相当于：
  // var c
  // function c(c) {
  //   console.log(c)
  //   var c = 3
  // }
  // c = 1
  // c(2) //执行时发现c不是一个函数！报错！
  ```
- `obj.hasOwnProperty(key)`：检查某个属性(不包括原型链)是否存在于该对象中。

  `Object.getOwnPropertyNames(obj)`：查找该对象(不包括原型链)的所有属性名(无论是否可枚举)，以数组形式返回。

  `Object.keys(obj)`：查找该对象(不包括原型链)的所有可枚举属性名，以数组形式返回。

- 箭头函数不可作为构造函数，不可使用super(比如在class中)，new.target（判断当前函数是否通过new来调用）等关键字，此外也没有prototype属性,以及不可作为generator函数。
- `Object.assign`和对象扩展运算符`[...obj，obj1]`除了使用语法的区别，拷贝对象的实际效果没有什么区别(除了Object.assign会触发setter，而扩展运算符不会)。扩展运算符语法更简洁,都是`浅拷贝原对象中可枚举的直接包含属性`。
- 通过`globalThis`可以区分当前环境是Node还是浏览器
- `postMessage`用于浏览器跨域通信，例如不同标签栏(window)之间，或者同一标签栏当前window与iframe之间的通信。
- 