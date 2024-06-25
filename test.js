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

//主线程同步代码完成,第1次打印
console.log('main finish');



