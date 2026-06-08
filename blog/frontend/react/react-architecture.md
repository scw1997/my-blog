# React架构

## 背景

主流浏览器刷新频率为 60Hz，即每（1000ms / 60Hz）16.6ms 浏览器刷新一次。

我们知道，**JS 可以操作 DOM，GUI渲染线程与JS线程是互斥的**。所以JS 脚本执行和浏览器布局、绘制不能同时执行。

在每 16.6ms 时间内，需要完成如下工作：

> JS脚本执行 -----  样式布局 ----- 样式绘制

当 JS 执行时间过长，超出了 16.6ms，这次刷新就没有时间执行样式布局和样式绘制了,就会导致页面掉帧，造成卡顿。

## 旧版架构

React 16之前，React的渲染过程可分为以下两个阶段：


### 协调器（Reconciler）

又称render阶段。在React中可以通过**this.setState、this.forceUpdate、ReactDOM.render**等 API 触发更新。 每当有更新发生时，Reconciler会做如下工作：

>调用函数组件、或 class 组件的render方法，将返回的 JSX 转化为虚拟 DOM

>将虚拟 DOM 和上次更新时的虚拟 DOM 对比

>通过对比找出本次更新中变化的虚拟 DOM

>通知Renderer将变化的虚拟 DOM 渲染到页面上 


  ```js
  const root = {
    key: 'A',
    children: [
      {
        key: 'B',
        children: [
          {
            key: 'D',
          },
          {
            key: 'E',
          },
        ],
      },
      {
        key: 'C',
        children: [
          {
            key: 'F',
          },
          {
            key: 'G',
          },
        ],
      },
    ],
  };

  const walk = dom => dom.children.forEach(child => walk(dom));
  walk(root);
  ```
:::danger 缺陷分析
在Reconciler中，mount的组件会调用mountComponent，update的组件会调用updateComponent。这两个方法都会`递归（深度优先遍历）`更新子组件。

由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了 16ms，用户交互就会卡顿。
:::


### 渲染器（Renderer）

也称commit阶段。该阶段每次更新发生时，Renderer接到Reconciler通知，将变化的组件渲染在当前宿主环境（即`渲染真实DOM`）。

这个阶段主要包括BeforeMutation阶段（主要处理class组件的getSnapShotBeforeUpdate），Mutation阶段（dom元素的增删改），Layout阶段（处理useLayoutEffect）

:::info 补充
Reconciler和Renderer是交替工作的，假如有多个同级li节点需要更新，当第一个li在页面上已经变化后，第二个li再进入Reconciler。
:::

## Fiber架构

为了解决旧版架构中Reconciler阶段时更新过程无法中断的问题，React的解决思路是`用可中断的异步更新代替同步的更新`：

> 浏览器每一帧的时间中，预留一些时间给 JS 线程，React利用这部分时间更新组件。<br/>
> 当预留的时间不够用时，React将线程控制权交还给浏览器使其有时间渲染 UI，React则等待下一帧时间到来继续被中断的工作。

但是旧版架构如果中断更新，会出现DOM更新不完全的现象，所以无法实现此方案。 基于此，React 16重写了架构，这就是**Fiber架构**。

### Fiber定义

React16将递归的无法中断的更新重构为异步的可中断更新，此时曾旧版架构用于递归的虚拟DOM数据结构已经无法满足需要。而新版架构的虚拟DOM在React中有个正式的称呼——Fiber。

Fiber包含三层含义：

- **架构层面**
  
  之前React15的Reconciler采用递归的方式执行，数据保存在递归调用栈中，所以被称为stack Reconciler。React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler。

- **静态的数据结构**

  每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息，是一种特殊`链表`结构。

  fiber比较重要的三个属性：`return（指向父节点）、child（指向子节点）、sibling（指向兄弟节点）`
  
  ```js
  function App() {
      return (
          <div>
              <p></p>
              <a></a>
          </div>
      )
  }
  
  ```

  ![fiber.png](/fiber_1.png)  

- **动态的工作单元**

  每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

### 大致阶段

Fiber架构相对15新增了一个`Scheuler`阶段，并重构了旧版Reconciler阶段，分为以下三层 ：

`调度器（Scheduler）`

又称render阶段，**此阶段可中断**。

既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。

其实部分浏览器已经实现了这个 API，这就是**requestIdleCallback**。但由于浏览器兼容性和触发稳定性原因，React实现了功能更完备的requestIdleCallbackpolyfill，这就是Scheduler。

除了在**空闲时触发回调的功能**外，Scheduler还提供了**多种调度优先级供任务设置**。

`调和器（Reconciler）`

在 React16 中，Reconciler与Renderer不再是交替工作。

当Scheduler将任务交给Reconciler后，Reconciler会为变化的虚拟 DOM 打上代表增/删/更新的标记。只有当所有组件都完成Reconciler的工作，才会统一交给Renderer。
  
此阶段会找出所有节点的变更，如节点**新增、删除、属性变更**等，这些变更 react 统称为副作用（effect），此阶段会构建一棵Fiber tree，以虚拟dom节点为维度对任务进行拆分，即**一个虚拟dom节点对应一个任务**，最后产出的结果是**effect list**，从中可以知道哪些节点更新、哪些节点增加、哪些节点删除了。

此阶段主要调用到源码的**beginWork**，**completeWork**两个方法。


`渲染器（Renderer）`

也称commit阶段，**此阶段不能中断**。

Renderer根据Reconciler为虚拟 DOM 打的标记，同步执行对应的 DOM 操作。

此阶段主要包含以下三个子阶段：
- **before mutation**：

  此阶段会在执行DOM操作前执行，会遍历effectList（render阶段产出），处理DOM节点渲染/删除后的 autoFocus、blur逻辑，调用getSnapshotBeforeUpdate生命周期钩子和调度useEffect。
- **mutation**

  同样会遍历effectList，根据effectTag（标记类型）调用不同的处理函数处理Fiber，即执行DOM操作。

- **layout**

  在DOM操作后执行，同样会会遍历effectList，根据effectTag（标记类型）调用不同的处理函数处理Fiber并更新ref。





### 详细机制
![fiber_2.png](/fiber_2.png)

Fiber节点可以保存对应的DOM节点,相应的，Fiber节点构成的Fiber树就对应DOM树。

Fiber架构中，React 中最多会存在两颗 Fiber树：

- `current fiber树`：页面中当前显示的已渲染内容所对应的Fiber树，树中的fiber节点就叫current fiber。
- `workInProgress fiber树`：内存中正在重新构建的 Fiber树。树中的fiber节点就叫workInProgress fiber。

这就是**双缓存 Fiber 树**,他们通过**alternate**属性连接。


![fiber_3.png](/fiber_3.png)

:::info 挂载时

1. 首次执行ReactDOM.render会创建**fiberRootNode**和**rootFiber**。其中fiberRootNode是整个应用的根节点（永远只有一个），rootFiber是<App/>所在组件树的根节点（可通过ReactDOM.render创建多个）。

   由于是首屏渲染，页面中还没有挂载任何DOM，所以fiberRootNode.current指向的rootFiber没有任何子Fiber节点（即current Fiber树为空）。
2. 接下来进入render阶段，根据组件返回的JSX在内存中依次创建Fiber节点并连接在一起构建Fiber树，被称为workInProgress Fiber树。
3. 已构建完的workInProgress Fiber树在commit阶段渲染到页面。此时fiberRootNode的current指针指向workInProgress Fiber树使其变为current Fiber 树。
:::

:::info 更新时
1. 当state存在更新时，会进入render阶段并构建一棵新的workInProgress Fiber 树。与初次挂载时的不同点是，此时可以基于Diff算法决定是否复用current Fiber树对应的节点数据。
2. workInProgress Fiber 树在render阶段完成构建后进入commit阶段渲染到页面上。渲染完毕后，workInProgress Fiber 树变为current Fiber 树。
:::


### 为什么vue不需要fiber


Vue 是基于 template 和 watcher 的组件级更新，把每个更新任务分割得足够小，不需要使用到 Fiber 架构，将任务进行更细粒度的拆分。

React 是不管在哪里调用 setState，都是从根节点开始更新的，更新任务还是很大，需要使用到 Fiber 将大任务分割为多个小任务，可以中断和恢复，不阻塞主进程执行高优先级的任务。


