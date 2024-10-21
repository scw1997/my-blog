
# Iterator & Generator

## Iterator 

迭代器Iterator是ES6提出的一种接口机制。

它的目的主要在于为所有部署了Iterator接口的数据结构提供统一的访问机制，即按一定次序执行遍历操作。并且ES6也提出了针对Iterator遍历操作的专属遍历命令的标准，即`for of循环`


### 内置Iterator接口
:::tip 定义
一个数据结构只要具有`Symbol.iterator`属性，就可以认为是`可迭代的`(iterable)
:::

js中默认拥有Iterator接口的数据结构

- 数组
- 字符串
- Map（ES6新增）
- Set（ES6新增）
- TypedArray
- 函数的arguments对象
- NodeList对象


Symbol.iterator属性本身是一个`函数`，调用这个函数，会返回一个迭代器Iterator对象，该对象包含一个next方法。


:::tip  for of遍历的内部机制

使用for...of循环遍历某种数据结构时，会自动去寻找Iterator接口，也就是对Symbol.iterator函数的返回的迭代器Iterator进行遍历。

每次遍历会调用迭代器Iterator的next方法，该方法每次的返回值会按顺序依次指向当前数据结构的对应成员。

next方法的返回值返回数据结构的当前成员的信息，是一个包含`value`和`done`两个属性的对象，其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。
:::


示例:

```js
const  arr = ['a','b','c'];

// 使用for of遍历
for(const item of arr){
	console.log(item)//'a' 'b' 'c'
}

```

上述代码的执行过程相当于:

```js
const arr = ['a','b','c'];

// 每次使用for of，就相当于重新获取一个新的iterator对象，
const iterator = arr[Symbol.iterator]()

// for of过程中的每次遍历,相当于调用iterator.next()获取每个元素信息进行消费 

const res1 = iterator.next() 
console.log('res1',res1)// {value: 'a', done: false }
const res2 = iterator.next()
console.log('res2',res2)// {value: 'b', done: false }
const res3 = iterator.next()
console.log('res3',res3)// {value: 'c', done: false }

// 全部元素被消费完毕后,仍可以继续调用next方法,但会固定返回{value: undefined, done: true }
const res4 = iterator.next()
console.log('res4',res4)// {value: undefined, done: true }
const res5 = iterator.next()
console.log('res5',res5)// {value: undefined', done: true }

```

### 自定义实现Iterator接口


示例1：自定义实现一种含有Iterator接口的数据结构：

```js 

class RangeIterator{
	constructor(start, stop){
		this.start = start;
		this.stop= stop;
	} 
	[Symbol.iterator](){
		let start = this.start 
		let stop = this.stop
		return {
			next(){
				var value = start
				if(value<stop){
					start++
					return {done:false,value:value}
				}
				return {done:true.value:undefined}
			}
		}
	}

}
const range =  new RangeIterator(0,3);

for (var value of range) {
  console.log(value); // 0, 1, 2
}
for (var value of range) {
  console.log(value); // 0, 1, 2
}



```

示例2：为object类型数据结构添加iterator接口
```js
const obj = {
    a:1,
    b:2,
}

obj[Symbol.iterator]=()=>{
    const keys = Object.keys(obj)
    let index=-1
    return {
        next:()=>{
            index++
            return {
                value: {
                    key:keys[index],
                    value:obj[keys[index]]
                },
                done:index>keys.length-1
            }

        }
    }
}

for(const item of obj){
    console.log('item',item)  //依次打印{key:'a',value:1} , {key:'b',value:2}
}
```

从上面可以看出,要实现一个Iterator接口还是稍微有些复杂麻烦的.

而使用下面介绍的Generator函数实现Iterator接口会更加简洁   

## Generator

一般来讲，函数一旦执行就会运行到结束，期间不会有其他代码能打断它。

Generator函数（也称生成器）提供一种脱离这种模式的`看似同步的异步流程控制方式`。

### 基本使用

示例：
```js
const gen = function* (){
    console.log('start')
    yield 1
    console.log('process')
    yield
    console.log('end')
    return 'finish'
}

const iterator = gen() // 此时gen内部的代码还没有开始执行

//调用next后开始执行gen函数，打印start,然后执行到yield 1 处暂停执行。
//将1（即紧跟在yield关键字后面的值)作为当前这一次next方法调用的返回值的value属性。
const res1 = iterator.next()  
console.log(res1) //{value:1,done:false}

//调用next继续执行gen函数，打印process，然后执行到yield处暂停执行。
//此时yield后面的值为undefined，作为当前这一次next方法调用的返回值的value属性

const res2 = iterator.next() 
console.log(res2) //{value:undefined,done:false}

///调用next继续执行gen函数，打印end。
//发现有return，则将return值作为这次next方法调用的返回值的value属性，done属性为true。
const res3 = iterator.next() 
console.log(res3) //{value:'finish',done:true}
```

:::tip 解析
- Generator函数调用的返回值为`iterator对象`。
- 每当iterator调用一次next方法，就会执行到`yield处暂停，return处或者函数代码结束位置停止`：

  （1）执行到yield处，此时会将紧跟在yield关键字后面的值（没有值则为undefined）作为当前next调用返回值的value属性值,done值为false。

  （2）执行到return处，则当前next调用返回的done值为true,value为return值。

  （3）执行到当前Generator函数结束，则当前next调用返回的done值为true,value为undefined。
:::

:::warning 注意
- 当next调用返回值出现done为true的情况后,之后无论调用多少次next返回值都是`{value:undefined,done:true}`.
- 如果不采用next去消费生成器的值，而是通过`for of`来遄历(本质也是在调用next)。则只会遍历出所有yield后面跟的值,`不包含return返回值`.
:::


Generator函数返回的`iterator对象`除了具有next方法,还有另外两个方法:

- `throw`:用于在generator函数执行过程中主动抛出错误,后续next调用不会再执行

- `return`:用于直接提前结束generator函数的流程,后续next调用统一返回<span>{value:undefined,done:true}</span>

::: code-group

```js [throw]
function* gen() {
    console.log('A');
    yield 10;
    console.log('B');
    yield 20;
    console.log('C');
    return 30;
}
let iterator = gen();
console.log(iterator.next()); //输出A , {value:10,done:false}
console.log(iterator.throw('error')); //直接抛出异常报错，没有返回结果，

// 下面代码不会再执行
console.log(iterator.next()); 

```
```js [return]
function* gen() {
    console.log('A');
    yield 10;
    console.log('B');
    yield 20;
    console.log('C');
    yield 30;
    console.log('D');
    return 100;
}
const iterator = gen();
console.log(iterator.next()); //{value:10,done:false}
console.log(iterator.return('主动return')); //{value:'主动return',done:true} 

// 后续next调用统一返回{value:undefined,done:true}
console.log(iterator.next()); 
console.log(iterator.next()); 
console.log(iterator.next());
```
:::

### 带参数的next方法调用

示例：
```js 
const gen = function* (x){
    console.log('start')
    const y = x* (yield)
    console.log('x',x)
    console.log('y',y)
    const z= yield y*x
    console.log('z',z)
    return y*z
}

// 将2作为x参数传递，此时gen内部的代码还没有开始执行
const iterator = gen(2) 

//调用next后开始执行gen函数，打印start,然后执行到x * yield处暂停(注意此时y还没有被赋值)。此时yield后面的值为undefined
const res1 = iterator.next()  
console.log(res1) //{value:undefined,done:false}

//调用next继续执行gen函数，将3代替上一次next调用暂停时相应的那一整个yield表达式。
//然后赋值y为2*3=6，打印x为2，y为6。继而执行到yield y*x处暂停(注意此时z还没有被赋值)，此时yield值为y*x即6*2=12
const res2 = iterator.next(3) 
console.log(res2) //{value:12,done:false}

///调用next继续执行gen函数，将4代替上一次next调用暂停时相应的那一整个yield表达式。
//然后赋值z为4，打印z为4。执行到return处结束，将return值即y*z=6*4=24作为当前next返回值的value值
const res3 = iterator.next(4) 
console.log(res3) //{value:24,done:true}
```

:::tip 解析

yield表达式整体本身(如yield 2整体)也代表一个值，它的值永远由`下一个next方法调用时的传参`来决定。
    
所以**给第一个next方法调用传参并无意义**，只有执行到第2个和后面的next方法时才可以去”完成”前一个yield表达式。以此类推，第3个next方法去“完成”第2个yield表达式....所以**next调用的次数一般都比yield表达式完成的次数多一次**。

:::


### yield*表达式

yield*表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数。

:::code-group 

```js [示例1]
function* foo() {
  yield 'a';
  yield 'b';
}
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于


function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

```
```js [示例2]
function* concat(iterator1, iterator2) {
  yield* iterator1;
  yield* iterator2;
}

// 等同于

function* concat(iterator1, iterator2) {
  for (var value of iterator1) {
    yield value;
  }
  for (var value of iterator2) {
    yield value;
  }
}
```
:::

- `yield*`表达式后面跟的是一个`iterator对象`，表明我想依次yield该iterator对象的所有遍历值value


- 任何数据结构只要有 Iterator 接口，就可以被`yield*`遍历。


### 应用场景

**(1) 自定义Iterator迭代器**

使用generator函数来实现迭代器比标准实现的写法更简洁，更容易理解

:::code-group 

```js [标准写法]
// 为object类型数据结构添加iterator接口
const obj = {
    a:1,
    b:2,
}

obj[Symbol.iterator]=()=>{
    const keys = Object.keys(obj)
    let index=-1
    return {
        next:()=>{
            index++
            return {
                value: {
                    key:keys[index],
                    value:obj[keys[index]]
                },
                done:index>keys.length-1
            }

        }
    }
}

for(const item of obj){
    console.log('item',item)  //依次打印{key:'a',value:1} , {key:'b',value:2}
}
```
```js [generator函数写法]
// 为object类型数据结构添加iterator接口
const obj = {
    a:1,
    b:2,
}

const gen = function* (){
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      yield {
          key,
          value:obj[key]
      };
    }
  }
}

obj[Symbol.iterator]=()=>gen(obj)

for(const item of obj){
    console.log('item',item)  //依次打印{key:'a',value:1} , {key:'b',value:2}
}
```

**（2）实现并发控制**

Generator函数可以暂停执行，这使得它在并发控制中具有一定的应用价值。通过合理地安排Generator函数的执行顺序和暂停时机，我们可以实现对并发任务的有效管理和调度。

例如，在Web开发中，我们可能需要同时处理多个异步请求或定时任务。通过使用Generator函数和Promise等技术，我们可以将这些任务组织成一个个可暂停和恢复的函数执行序列，从而实现对并发任务的高效控制和管理。

**（3）状态管理**

在某些场景中，使用Generator函数可以避免将次数等关键信息存储在全局变量中，从而提高了安全性并减少了性能影响。

如抽奖环节，需要控制用户的抽奖次数。通过多次调用Generator函数返回的多个Iterator对象，绑定到不同抽奖按钮的点击事件上，可以每次点击时执行指定Iterator对象的next()方法，从而控制对应不同奖项抽奖次数的减少和抽奖逻辑的执行，数据独立互相不影响。

**（4）异步操作的同步化表达**

异步操作的同步化，避免了回调地狱问题。同时Generator也作为`async/await`语法的polyfill(底层实现)

:::info 关于async/await是Generator的语法糖
所谓Generator语法糖，表明的就是aysnc/await实现的就是generator实现的功能。但是async/await比generator要好用。因为generator执行yield设下的断点采用的方式就是不断的调用iterator方法，这是个`手动调用`的过程。针对generator的这个缺点，后面提出了co这个库函数来`自动执行next`，相比于之前的方案，这种方式确实有了进步，但是仍然麻烦。而async配合await得到的就是断点执行后的结果。因此async/await比generator使用更普遍。
:::


## 结语

Iterator方便我们更容易理解遍历的原理和可迭代的概念。

Generator能帮助我们更深层次理解异步工作流的各种机制和了解js异步编程的历史演变过程。
