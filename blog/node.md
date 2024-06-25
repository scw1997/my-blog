# Node.js

## 事件循环

Node.js 的事件循环是基于 `libuv` 库实现的，它是一个跨平台的 C 库，用于处理非阻塞 I/O。

在 Node.js 中，事件循环允许我们`执行异步操作而不会阻塞主线程`。

![node事件循环.png](/node_loop.png)

**循环阶段**：

1. **timers**：执行`setInterval`和`setTimeout`的回调函数。
2. **pending callbacks**：执行某些系统操作（非node）的回调函数。
3. **idle,prepare**：仅系统内部调用。
4. **poll**：检索新的I/O事件，执行与I/O相关的回调（`包括文件IO和网络IO`）。所有的事件循环以及回调处理都在这个阶段执行。其他情况nodejs将会在适当时进行阻塞。
5. **check**：执行`setImmediate`的回调函数，但不是立即执行，而是poll阶段中没有新的事件处理时再执行（即setImmediate的回调函数会在所有回调函数执行完再执）。
6. **close callbacks**：执行一些关闭的回调函数，如 socket.on('close', ...)。

:::warning 注意
setTimeout 如果不设置时间或者设置时间为 0，则会`默认为 1ms`。此时，主流程执行完成后，超过 1ms 时，会将 setTimeout 回调函数逻辑插入到待执行回调函数poll 队列中；
:::
**循环的发起点**：

- Node.js 启动后；
- setTimeout 回调函数；
- setInterval 回调函数；
- 也可能是一次 I/O 后的回调函数。

**循环任务及优先级**：

事件循环主要包含微任务和宏任务：

- 微任务：`Promise，Process.nextTick（优先级高于Promise）`

- 宏任务：`setTimeout、setInterval、setImmediate 和 I/O（包括文件IO和网络IO）`


node中的微任务在事件循环中优先级最高（即优先执行），宏任务在微任务执行之后执行。

在同一个事件循环周期内，如果既存在微任务队列又存在宏任务队列，那么优先将微任务队列清空（全部执行完毕），再执行宏任务队列。在主线程处理回调函数的同时，同理也需要判断是否插入微任务和宏任务。

:::warning 注意
当同时碰到setTimeout和I/O的宏任务，只有当setTimout设置时间为0时，其回调才会必定优先比I/O回调优先执行，除此之外，二者的回调执行顺序不可保证。
:::

示例1：

```js
import fs from 'fs';

// 扔进宏任务队列
setTimeout(() => { // 新的事件循环的起点
    // 第4次打印(与setImmediate回调说不好哪个优先,这里假设setImmediate优先级高)
    console.log('setTimeout callback');
    fs.readFile('./test1.txt', {encoding: 'utf-8'}, (err, data) => {
        if (err) throw err;

        // 第6次打印(不一定，看读取速率或文件大小)
        console.log('read file test1.txt success');
    });
}, 0);

// 扔进宏任务队列
fs.readFile('./test.txt', {encoding: 'utf-8'}, (err, data) => {
    if (err) throw err;
    // 第5次打印(不一定，看读取速率或文件大小)
    console.log('read file test.text success');

});

/// 扔进宏任务队列
setImmediate(()=>{
    // 第3次打印(与setTimeout(0)的回调说不好哪个优先,这里假设其优先级高)
    console.log('setImmediate callback');
})


/// 扔进微任务队列
Promise.resolve().then(()=>{
    // 唯一的微任务,微任务优先级高,第2次打印
    console.log('Promise then');
});

//主线程同步代码完成后开始第一次事件循环，第1次打印
console.log('main finish');


```
