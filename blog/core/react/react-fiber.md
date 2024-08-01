# Fiber架构

## 出现背景

js引擎和页面渲染引擎是在同一个渲染线程之内，两者是互斥关系，不能同时执行。如果在某个阶段js执行时长比较长，会阻塞页面渲染，导致卡顿现象。

React 16之前，React的渲染过程可分为以下两个阶段：


### 调和阶段（Stack Reconciler）

 又称render阶段。 React会采用`深度优先遍历`遍历新数据生成新的 Virtual DOM，然后通过 Diff 算法，`找到需要变更的元素(Patch)计算出UI变化`，放到更新队列里面去:

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

这种遍历是递归调用，**执行栈会越来越深，而且不能中断**，中断后就不能恢复了。

这个阶段React 会一直占用浏览器资源，递归如果非常深，就会十分卡顿。如果递归花了1s，则这1s浏览器是无法响应的。

### 渲染阶段（Renderer）

也称commit阶段。该阶段React遍历更新队列，实际更新渲染对应元素（即`渲染真实DOM`）。

这个阶段主要包括BeforeMutation阶段（主要处理class组件的getSnapShotBeforeUpdate），Mutation阶段（dom元素的增删改），Layout阶段（处理useLayoutEffect）





## 什么是Fiber

Fiber既是一种**架构思想**，也是一种**数据结构**。


### Fiber架构

为了解决**调和阶段因为递归调用无法中断和树执行栈太深导致主线程长时间占用的问题**，React 16提出了Fiber架构

React16之后的渲染过程相对15新增了一个`Scheuler`阶段，并重构了旧版Reconciler阶段（旧版统称`Stack Reconciler`，新版统称为`Fiber Reconciler`）

这个时候渲染过程变为了三层：

:::tip
- `调度阶段（Scheduler）`：

  React 16新增的阶段。用于调度任务的优先级，优先级高的推入Fiber Reconciler。

- `调和阶段（Fiber Reconciler）`：
  
  也称render阶段。
  
  VDOM树 转 Fiber树，此阶段会找出所有节点的变更，如节点新增、删除、属性变更等，这些变更 react 统称为副作用（effect），此阶段会构建一棵Fiber tree，以虚拟dom节点为维度对任务进行拆分，即**一个虚拟dom节点对应一个任务**，最后产出的结果是**effect list**，从中可以知道哪些节点更新、哪些节点增加、哪些节点删除了。

  **此阶段可中断**


- `渲染阶段（Renderer）`：

  也称commit阶段。

  将上阶段计算出来的需要处理的副作用一次性执行，否则会出现UI更新不连续的现象。此阶段需要根据effect list，将所有更新都 commit 到DOM树上。

  **此阶段不能中断**
:::



### Fiber数据结构

fiber架构中引入了fiber节点这一数据结构。

fiber节点是一种保存了组件状态、信息的特殊`链表`，每个 Virtual DOM 都可以表示为一个 fiber。

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


## 运行机制

React 中最多会存在两颗 Fiber树：

- `currentFiber`：页面中当前显示的内容所对应的Fiber树
- `workInProgressFiber`：内存中正在重新构建的 Fiber树。


![fiber_2.png](/fiber_2.png)

在Fiber架构下，React的更新渲染过程大致如下：


1. **`ReactDOM.render()` 引导 React 启动或调用 `setState()` 的时候开始创建或更新 Fiber 树。**

2. **从根节点开始遍历 Fiber Node Tree， 并且构建 WokeInProgress Tree（render阶段）。**

  
  React 会生成两棵树，一棵是代表当前状态的 current tree，一棵是待更新的 workInProgress tree。
  遍历 current tree，重用或更新 Fiber Node 到 workInProgress tree，workInProgress tree 完成后会替换 current tree。
  每更新一个节点，同时生成该节点对应的 Effect List。
  为每个节点创建更新任务。
  :::warning 注意
  本阶段可以暂停、终止、和重启，会导致 react 相关生命周期重复执行。例如componentWillMount、componentWillReceiveProps、componentWillUpdate。
  
  如果在上述生命周期内执行一些重要逻辑如发送异步请求，就很容易导致bug。所以React 16 将上面的 3 个生命周期函数废弃掉了。
  :::

3. **将创建的更新任务加入任务队列，等待调度。**

  调度由 Scheduler 阶段完成，其核心职责是执行回调。调度过程大致如下：

  :::info
  React 向浏览器请求调度，浏览器在一帧（通常为16ms，相对于60hz屏幕）中如果还有空闲时间，会去判断是否存在待执行任务，不存在就直接将控制权交给浏览器，如果存在就会执行对应的任务，执行完成后会判断是否还有时间，有时间且有待执行任务则会继续执行下一个任务，否则就会将控制权交给浏览器。
  
  Fiber 可以被理解为划分一个个更小的执行单元，它是把一个大任务拆分为了很多个小块任务，一个小块任务的执行必须是一次完成的，不能出现暂停，但是一个小块任务执行完后可以移交控制权给浏览器去响应用户，从而不用像之前一样要等那个大任务一直执行完成再去响应用户。
  
  每处理完一个 Fiber Node 的更新，可以中断、挂起，或恢复。
  :::

  调度过程主要使用到了Scheduler 模块实现的一个API：`requestIdleCallback`：

  :::info requestIdleCallback
`requestIdleCallback` 是 react Fiber 实现的基础 api 。我们希望能够快速响应用户，让用户觉得够快，不能阻塞用户的交互，requestIdleCallback能使开发者在主事件循环上执行后台和低优先级的工作，而不影响延迟关键事件，如动画和输入响应。

正常帧任务完成后没超过16ms，说明有多余的空闲时间，此时就会执行requestIdleCallback里注册的任务。

具体的执行流程如下，开发者采用requestIdleCallback方法注册对应的任务，告诉浏览器我的这个任务优先级不高，如果每一帧内存在空闲时间，就可以执行注册的这个任务。另外，开发者是可以传入timeout参数去定义超时时间的，如果到了超时时间了，浏览器必须立即执行，使用方法如下：window.requestIdleCallback(callback, { timeout: 1000 })。浏览器执行完这个方法后，如果没有剩余时间了，或者已经没有下一个可执行的任务了，React应该归还控制权，并同样使用requestIdleCallback去申请下一个时间片。

  :::


4. **根据 Effect List 更新 DOM （commit 阶段）**。

  React 会遍历 Effect List 将所有变更一次性更新到 DOM 上。

  这一阶段的工作会导致用户可见的变化。因此该过程不可中断，必须一直执行直到更新完成。



### 为什么vue不需要fiber




Vue 是基于 template 和 watcher 的组件级更新，把每个更新任务分割得足够小，不需要使用到 Fiber 架构，将任务进行更细粒度的拆分

React 是不管在哪里调用 setState，都是从根节点开始更新的，更新任务还是很大，需要使用到 Fiber 将大任务分割为多个小任务，可以中断和恢复，不阻塞主进程执行高优先级的任务


