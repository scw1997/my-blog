# JS事件循环机制


## 浏览器 JS 异步执行的原理

`JS 是单线程`的，也就是同一个时刻只能做一件事情，那么思考：为什么浏览器可以同时执行异步任务呢？

因为`浏览器是多线程`的，当 JS 需要执行异步任务时，浏览器会另外启动一个线程去执行该任务。也就是说，“JS 是单线程的”指的是执行 JS 代码的线程只有一个，是浏览器提供的 JS 引擎线程（主线程）。

浏览器中还有定时器线程和 HTTP 请求线程等，这些线程主要不是来跑 JS 代码的。

比如主线程中需要发一个 AJAX 请求，就把这个任务交给另一个浏览器线程（HTTP 请求线程）去真正发送请求，待请求回来了，再将 callback 里需要执行的 JS 回调交给 JS 引擎线程去执行。

**浏览器才是真正执行发送请求这个任务的角色，而 JS 只是负责执行最后的回调处理**。所以这里的异步不是 JS 自身实现的，其实是浏览器为其提供的能力。

![event_loop_1.png](/event_loop_1.png)

以 Chrome 为例，浏览器不仅有多个线程，还有多个进程，如渲染进程、GPU 进程和插件进程等。而每个 tab 标签页都是一个独立的渲染进程，所以一个 tab 异常崩溃后，其他 tab 基本不会被影响。

![event_loop_2.png](/event_loop_2.png)

## 执行栈与任务队列

![event_loop_3.png](/event_loop_3.png)
![event_loop_4.png](/event_loop_4.png)

- JS 分为同步任务、异步任务。
- JS的任务都在执行栈顺序执行。
- 执行至同步任务，进入主线程；执行至异步任务，将被加入任务队列（Event Queue）中。
- 执行栈中所有任务执行完毕，系统读取任务队列，将异步任务的回调事件添加到执行栈中，如此反复循环。


## 宏任务和微任务

根据任务的种类不同，可以分为微任务（micro task）队列和宏任务（macro task）队列。

微任务和宏任务皆为异步任务。

事件循环的过程：

- 执行栈在同步代码执行完成
- 检查微任务队列是否有任务需要执行，如果没有，再去宏任务队列检查是否有任务执行
- 如此往复。微任务一般在当前循环就会优先执行，而宏任务会等到下一次循环，因此，`微任务一般比宏任务先执行`。


**常见宏任务**：

- setTimeout()
- setInterval()
- setImmediate()（属于node）

**常见微任务**：

- promise.then()、promise.catch()
- new MutaionObserver()
- process.nextTick()（属于node）


示例1：

```js
console.log('同步代码1');
setTimeout(() => {
    console.log('setTimeout')
}, 0)
new Promise((resolve) => {
  console.log('同步代码2')
  resolve()
}).then(() => {
    console.log('promise.then')
})
console.log('同步代码3');
// 最终输出"同步代码1"、"同步代码2"、"同步代码3"、"promise.then"、"setTimeout"

```
解析：

- 开始执行js主线程同步代码，打印'同步代码1'。
- 碰到setTimeout，其回调为宏任务，则扔进宏任务队列。
- 碰到Promise，打印'同步代码2'，其then回调为微任务，则扔进微任务队列。
- 打印'同步代码3'。当前执行栈同步代码执行完毕。
- 进入事件循环，优先执行微任务，打印'promise.then'，微任务队列执行完毕。
- 然后执行宏任务，打印'setTimeout'，宏任务队列执行完毕。
- 执行结束。

示例2：

```js
new Promise((resolve, reject) => {
  console.log("p1")
  resolve()
}).then(() => {
  console.log("p1-then")
  setTimeout(() => {
    console.log("s1")
    new Promise((resolve, reject) => {
      console.log("p2")
      resolve()
    }).then(() => {
      console.log("p2-then")
      setTimeout(() => {
        console.log("s2")
      }, 0)
    }).then(() => {
      console.log("p2-then-then")
    })
  }, 0)

}).then(() => {
  console.log("p1-then-then")
})

//依次输出：p1,p1-then,p1-then-then,s1,p2,p2-then,p2-then-then,s2

```

:::tip 核心点
遇到多个then的promise,则在第一个then回调执行完后，将第二个then扔进微任务队列。以此类推。
::: 


示例3：

```js
async function async1() {
  console.log("async1-1");
  await async2();
  console.log("async1-2");
  setTimeout(() => {
    console.log('s1')
  }, 0)
}
async function async2() {
    console.log("async2");
  setTimeout(() => {
      console.log("s2");
  }, 0)
}

setTimeout(() => {
  console.log('s3')
}, 0)
async1();

//依次输出：async1-1,async2,async1-2,s3,s2,s1
```
:::tip 核心点
遇到async/await的代码时：

```js
async function async1(){
    console.log('1')
    await async2()
    console.log('2')
}
async function async2(){
    console.log('async2')
    // ...
}
async1()

```
分析执行顺序时,上述代码相当于:
```js
new Promise(()=>{
    console.log('1')
    // 下面是awati的代码内容
    console.log('async2')
    // ...
    // 上面面是await的代码内容
}).then(()=>{
    console.log('2')
})


```

:::


示例4:

```js
function runAsync(x) {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      console.log(x)
      resolve(x)
    }, 0)
  })

}
Promise.all([runAsync(1), runAsync(2), runAsync(3)]).then((res) => {
  console.log('res',)
})

//依次输出:1,2,3,res
```
:::tip 核心点
Promise.all会在所有promise resolve后再执行整体的then回调。
:::


> 引用文章：https://juejin.cn/post/7164224261752619016
