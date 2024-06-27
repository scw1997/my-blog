# JS异步编程

`同步`：顺序执行，会阻塞后续代码的执行。

`异步`：当程序运行到异步的代码时，会将该异步的代码作为任务放进任务队列，而不是推入主线程的调用栈。等主线程执行完之后，再去任务队列里执行对应的任务即可。 因此，异步操作的优点就是：`不会阻塞后续代码的执行`。

js异步编程的四种方法：

## 回调函数

回调函数实现示例：

```js
const  doSomethingAsync=(callback)=> {  
    // 假设这是一个异步操作，例如网络请求或定时器  
    setTimeout(()=> {  
        // 模拟异步操作完成后的结果  
        const result = '操作已完成';
        // 调用回调函数，并将结果作为参数传递  
        callback(result);   // [!code highlight]
    }, 1000); // 假设异步操作需要1秒来完成  
}  
  
// 使用示例  
doSomethingAsync((result)=> {  
    console.log(result); // 输出：'操作已完成'  
    // 在这里可以执行任何需要在异步操作完成后进行的操作  
});
```

回调函数的最主要缺点是`回调地狱`：

```js
function fetchDataFromServer(url, callback) {  
    // 假设这是一个异步请求函数  
    setTimeout(function() {  
        // 模拟从服务器获取数据  
        const data = `Data from ${url}`;  
        callback(null, data); // 假设第一个参数是错误对象，第二个参数是数据  
    }, 1000);  
}  
  
// 回调地狱示例  
fetchDataFromServer('api/first', function(err, data1) {  
    if (err) {  
        console.error('Error fetching first data:', err);  
        return;  
    }  
      
    fetchDataFromServer('api/second', function(err, data2) {  
        if (err) {  
            console.error('Error fetching second data:', err);  
            return;  
        }  
          
        fetchDataFromServer('api/third', function(err, data3) {  
            if (err) {  
                console.error('Error fetching third data:', err);  
                return;  
            }  
            // ...调用更多接口，需要使用更多的嵌套回调

        });  
    });  
});
```
**当使用嵌套回调函数来处理异步操作时，代码变得难以阅读和维护**。

随着ES6的引入，Promise，Generator，async/await等新的特性被用来解决这个问题。


## Promise

使用Promise来重写上述回调地狱示例代码：

```js

function fetchDataFromServer(url) {  
    return new Promise((resolve, reject) => {  
        // 假设这是一个异步请求函数  
        setTimeout(function() {  
            // 模拟从服务器获取数据  
            const data = `Data from ${url}`;  
            resolve(data); // 使用Promise的resolve方法返回数据  
        }, 1000);  
    });  
}  
  
// 使用Promise链来避免回调地狱  
fetchDataFromServer('api/first')  
    .then(data1 => fetchDataFromServer('api/second'))  
    .then(data2 => fetchDataFromServer('api/third'))  
    .then((data3) => {  
        // 使用所有获取到的数据  
        console.log(data1, data2, data3);  
    })  
    .catch(err => {  
        // 捕获任何错误  
        console.error('Error fetching data:', err);  
    });
```
在这个使用Promises的示例中，代码更加清晰，并且错误处理也更加集中。每个.then()方法都返回一个新的Promise，这样我们就可以链式地调用它们，而不需要嵌套回调函数。


## Generator

Generator是ES6提出的一种异步编程的方案。

学习Generator前,需要了解iterator是什么：

### Iterator

迭代器Iterator是ES6提出的一种接口机制。

它的目的主要在于为所有部署了Iterator接口的数据结构提供统一的访问机制，即按一定次序执行遍历操作。并且ES6也提出了针对Iterator遍历操作的专属遍历命令的标准，即`for of循环`


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


Symbol.iterator属性本身是一个`函数`，调用这个函数，就会返回一个迭代器Iterator。


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

:::code-group 

```js [示例1]
// 自定义实现一种含有Iterator接口的数据结构

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


```js [示例2]
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
:::

从上面可以看出,要实现一个Iterator接口还是稍微有些复杂麻烦的.

而Generator函数则可以简单形式实现Iterator   

### Generator函数

一般来讲，函数一旦执行就会运行到结束，期间不会有其他代码能打断它。

Generator函数提供一种脱离这种模式的`看似同步的异步流程控制方式`

```js
const gen = function* (){
    console.log('start')
    yield 1
    console.log('process')
    yield
    console.log('end')
}

const iterator = gen() // 此时gen内部的代码还没有开始执行

const res1 = iterator.next()  //开始执行gen函数，打印start,然后执行到yield 1 处暂停执行,并将1（即紧跟在yield关键字后面的值作为当前这一次next方法调用的返回值的value属性 ）
console.log(res1) //{value:1,done:false}

const res2 = iterator.next() //继续执行，打印process，然后执行到yield处暂停执行,此时yield的值为undefined，作为当前这一次next方法调用的返回值的value属性
console.log(res2) //{value:undefined,done:false}

const res3 = iterator.next() ///继续执行，打印end。发现gen函数代码执行完毕，则将undefined作为这次next方法调用的返回值的value属性，done属性为true。
console.log(res3) //{value:undefined,done:true}
```

Generator函数是一个`返回值为iterator对象的函数`。
