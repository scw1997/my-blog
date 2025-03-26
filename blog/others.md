# 其他

## WebStorage

特点：

- 相比[Cookie]，WebStorage可存储的`数据量更大`（5MB左右）。
- 相比[Cookie]，WebStorage同样保存在客户端，但`不与服务器进行交互通信，可节省流量`。
- WebStorage只能存储`字符串`类型数据。

`sessionStorage`：用于存储某个特定会话的数据，即同一标签栏下的同源页面。如果跳转到了非同源页面或新打开标签栏，则新页面不会存在原sessionStorage数据。

`localStorage`：对于同源页面（无论是否是同一标签栏）是共享公用的，并且只要你不去主动删除，它会永久保存在浏览器中。

:::warning 注意
- 当通过`window.open 或链接打开新页面时(不能是新窗口)`，新页面会复制前一页的`sessionStorage`，但并不共享。
- 设置WebStorage值时，会默认执行`toString()`操作，需要注意类型检测。
:::

## iframe

**应用场景**

- 广告嵌入
- 视频播放
- 第三方应用嵌入

**缺点**

- 不利于SEO
- 增加页面请求
- 存在一定安全问题（如xss跨站脚本攻击等）
- iframe页面不可访问主页面DOM对象
- 主页面不可访问不同源的iframe内部DOM（可通过postMessage解决）

## Vue vs React

#### 框架性质
Vue是MVVM，React可以认为是MVC中的view

#### 数据绑定
Vue是双向绑定，React是单向绑定。但是二者都是单向数据流

#### 更新机制


React重`运行时`，推崇 Immutable(不可变)，React更新机制就是局部重新渲染，React 拿到的或者说掌管的就是一堆递归 React.createElement 的执行调用，即递归地把所有的子组件重新 render 一下，不管是不是更新的数据，然后通过 diff 算法 来决定更新哪部分的视图。所以，React 的更新粒度是一个**整体**。React无法从模版层面进行静态分析，其本身的思路是纯 JS 写法，这种方式非常灵活，过度的灵活性导致运行时可以用于优化的信息不足，这也使它在编译时很难做太多的事情，

Vue在运行时和预编译之间做了非常好的权衡和取舍，它保留了虚拟 dom，但是会通过响应式去控制虚拟 dom 的颗粒度。Vue使用的是模版语法，虽然语法受限，但是可以在预编译里面做足够多的性能优化，，做到了按需更新。在预编译阶段静态分析模版， 通过依赖收集，当数据更新时 ，Vue 明确知道是哪些数据更新了，每个组件都有自己的渲染 Watcher，掌管当前组件的视图更新，所以可以精确地更新对应的组件，所以更新的粒度是**组件级别**的。

#### Hooks

在React Hooks中：

- Hooks有严格调用顺序，并且不可写在条件语句中
- 存在闭包陷阱
- 需要主动使用useMemo或useCallback来避免很容易造成的重复渲染等性能问题，并且要正确传递依赖。

而Vue3的组合式API中：

- 仅需调用setup一次，无需担心闭包，hooks调用顺序问题
- 响应式系统自动收集计算属性和响应式数据依赖，无需手动声明。
- 不需要手动缓存来避免性能问题，可确保绝大部分情况下仅执行必要的更新

## 前端SPA路由实现原理

### history路由

在 HTML5 之前，浏览器就已经有了 history 对象。但在早期的 history 中只能用于**多页面**的跳转。只支持以下API:
```js
history.go(-1);       // 后退一页
history.go(2);        // 前进两页
history.forward();     // 前进一页
history.back();      // 后退一页

```
在 HTML5 的规范中，history 新增了以下几个 API：
```js
history.pushState();         // 在保留现有历史记录的同时，将指定 url 加入到历史记录中
history.replaceState();      // 将历史记录中的当前页面历史替换为指定 url
history.state                // 返回当前的历史条目数据
```

history.pushState() 和 history.replaceState() 可以改变 url 的同时，不会刷新页面。并且可以通过`window.onpopstate`来监听两种方法的触发从而配合使用。

但是history 的改变并不会触发任何事件，所以我们无法直接监听 history 的改变而做出相应的操作。

所以，我们需要换个思路，我们可以罗列出所有可能触发 history 改变的情况，并且将这些方式一一进行拦截，变相地监听 history 的改变。
对于单页应用的 history 模式而言，url 的改变只能由下面四种方式引起：

- 点击浏览器的前进或后退按钮
- 点击 a 标签
- 在 JS 代码中触发 history.pushState 函数
- 在 JS 代码中触发 history.replaceState 函数

:::code-group 
```js [实现]
class HistoryRouter{
    constructor(){
        //用于存储不同path值对应的回调函数
        this.routers = {};
        this.listenPopState();
        this.listenLink();
    }
    //监听popstate
    listenPopState(){
        window.addEventListener('popstate',(e)=>{
            let state = e.state || {},
                path = state.path || '';
            this.dealPathHandler(path)
        },false)
    }
    // 全局阻止A链接的默认事件，获取A链接的href属性，并调用 history.pushState 方法
    listenLink(){
        window.addEventListener('click',(e)=>{
            let dom = e.target;
            if(dom.tagName.toUpperCase() === 'A' && dom.getAttribute('href')){
                e.preventDefault()
                this.assign(dom.getAttribute('href'));
            }
        },false)
    }
    //用于首次进入页面时调用
    load(){
        let path = location.pathname;
        this.dealPathHandler(path)
    }
    //用于注册每个视图
    register(path,callback = function(){}){
        this.routers[path] = callback;
    }
    //用于注册首页
    registerIndex(callback = function(){}){
        this.routers['/'] = callback;
    }
    //用于处理视图未找到的情况
    registerNotFound(callback = function(){}){
        this.routers['404'] = callback;
    }
    //用于处理异常情况
    registerError(callback = function(){}){
        this.routers['error'] = callback;
    }
    //跳转到path
    assign(path){
        history.pushState({path},null,path);
        this.dealPathHandler(path)
    }
    //替换为path
    replace(path){
        history.replaceState({path},null,path);
        this.dealPathHandler(path)
    }
    //通用处理 path 调用回调函数
    dealPathHandler(path){
        let handler;
        //没有对应path
        if(!this.routers.hasOwnProperty(path)){
            handler = this.routers['404'] || function(){};
        }
        //有对应path
        else{
            handler = this.routers[path];
        }
        try{
            handler.call(this)
        }catch(e){
            console.error(e);
            (this.routers['error'] || function(){}).call(this,e);
        }
    }
}

```
```js [调用]
<body>
    <div id="nav">
        <a href="/page1">page1</a>
        <a href="/page2">page2</a>
        <a href="/page3">page3</a>
        <a href="/page4">page4</a>
        <a href="/page5">page5</a>
        <button id="btn">page2</button>
    </div>
    <div id="container">

    </div>
</body>


let router = new HistoryRouter();
let container = document.getElementById('container');

//注册首页回调函数
router.registerIndex(() => container.innerHTML = '我是首页');

//注册其他视图回到函数
router.register('/page1', () => container.innerHTML = '我是page1');
router.register('/page2', () => container.innerHTML = '我是page2');
router.register('/page3', () => container.innerHTML = '我是page3');
router.register('/page4', () => {
    throw new Error('抛出一个异常')
});

document.getElementById('btn').onclick = () => router.assign('/page2')


//注册未找到对应path值时的回调
router.registerNotFound(() => container.innerHTML = '页面未找到');
//注册出现异常时的回调
router.registerError((e) => container.innerHTML = '页面异常，错误消息：<br>' + e.message);
//加载页面
router.load();

```
:::

### hash路由
url hash 值的变化不会导致浏览器像服务器发送请求，而且 hash 的改变会触发 hashchange 事件，浏览器的前进后退也能对其进行控制，所以在 H5 的 history 模式出现之前，基本都是使用 hash 模式来实现前端路由。

:::code-group 

```js [实现]
class HashRouter{
    constructor(){
        //用于存储不同hash值对应的回调函数
        this.routers = {};
        window.addEventListener('hashchange',this.load.bind(this),false)
    }
    //用于注册每个视图
    register(hash,callback = function(){}){
        this.routers[hash] = callback;
    }
    //用于注册首页
    registerIndex(callback = function(){}){
        this.routers['index'] = callback;
    }
    //用于处理视图未找到的情况
    registerNotFound(callback = function(){}){
        this.routers['404'] = callback;
    }
    //用于处理异常情况
    registerError(callback = function(){}){
        this.routers['error'] = callback;
    }
    //用于调用不同视图的回调函数
    load(){
        let hash = location.hash.slice(1),
            handler;
        //没有hash 默认为首页
        if(!hash){
            handler = this.routers.index;
        }
        //未找到对应hash值
        else if(!this.routers.hasOwnProperty(hash)){
            handler = this.routers['404'] || function(){};
        }
        else{
            handler = this.routers[hash]
        }
        //执行注册的回调函数
        try{
            handler.apply(this);
        }catch(e){
            console.error(e);
            (this.routers['error'] || function(){}).call(this,e);
        }
    }
}


```
```js [调用]
<body>
    <div id="nav">
        <a href="#/page1">page1</a>
        <a href="#/page2">page2</a>
        <a href="#/page3">page3</a>
        <a href="#/page4">page4</a>
        <a href="#/page5">page5</a>
    </div>
    <div id="container"></div>
</body>



let router = new HashRouter();
let container = document.getElementById('container');

//注册首页回调函数
router.registerIndex(()=> container.innerHTML = '我是首页');

//注册其他视图回到函数
router.register('/page1',()=> container.innerHTML = '我是page1');
router.register('/page2',()=> container.innerHTML = '我是page2');
router.register('/page3',()=> container.innerHTML = '我是page3');
router.register('/page4',()=> {throw new Error('抛出一个异常')});

//加载视图
router.load();
//注册未找到对应hash值时的回调
router.registerNotFound(()=>container.innerHTML = '页面未找到');
//注册出现异常时的回调
router.registerError((e)=>container.innerHTML = '页面异常，错误消息：<br>' + e.message);


```
## 前端性能优化

### CSS

- 减少CSS文件请求个数，控制在1-2个。2个CSS文件请求会比包含相同内容的1个CSS文件请求要传递的数据更多。此外线上的CSS文件中不要使用@import，因为这并不能减少Http请求次数
- 压缩和缓存CSS文件
- 减少重绘重排
- 降低 CSS 选择器的复杂性

### JS
- 避免浏览器渲染阻塞Js文件。如给script标签添加async或defer属性
- 使用事件委托减少事件监听数量
- 减少dom操作
- 尽量通过class而不是动态修改style来调整样式

### 资源

- 静态资源使用cdn ，减少服务器延迟
- 使用字体图标 iconfont或者svg 代替jpg/png图标
- 图片懒加载或者叫延迟加载（滚动到图片位置时再加载）
- 使用响应式图片
- 使用 webp 格式的图片减小图片体积

### React
- 使用useMemo，useCallback进行必要缓存
- 使用shuouldComponetUpdate和pureComponent避免非必要更新
- 路由懒加载
- 使用React.fragment避免不必要的dom添加
- 尽量使用函数式组件
- 尽量保证稳定的dom结构，不要频繁增删dom
- 动态列表渲染使用key


### 其他

- 减少http请求次数
- 使用http2（解析快，多路复用，头部压缩）


## 进程与线程
![进程与线程](/others_1.png)

`进程`：程序的一次执行, 它占有一片独有的内存空间。进程是系统分配资源的最小单元

`线程`：进程内的一个独立执行单元；是程序执行的一个完整流程，是**CPU的最小的调度单元**

- 应用程序必须运行在某个进程的某个线程上
- 一个进程中至少有一个运行的线程即主线程, 进程启动后自动创建主线程


### 多进程

一个应用程序可以同时启动多个实例运行

**优点**：每个进程相互独立，不共享内存，因此数据更安全。可以更好地利用多核处理器。

**缺点**：进程创建和销毁的开销较大，进程间通信需要额外的机制且通信效率不如多线程。

### 单线程

指**一个进程里面只有一个线程**。

如果一个应用程序启动两个进程，每个进程都只有一个线程，那么这个程序也是单线程的。

> js是单线程运行的，但使用H5中的 Web Workers可以多线程运行。

### 多线程

在一个进程内, 同时有多个线程运行

**优点**：开销小，线程间可共享内存，方便通信。可以更好地利用多核处理器。

**缺点**：稳定性不高，因为所有线程共享同一进程的地址空间。还要注意死锁和数据同步问题。


## Git

- git误删远程分支恢复
   > 通过`git reflog` 命令查看最近一次操作的哈希值，然后通过`git checkout -b 分支名 哈希值` 基于该哈希值创建指定分支。 



[Cookie]:/advance/cookie-session#cookie
