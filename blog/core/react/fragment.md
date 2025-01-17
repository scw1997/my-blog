# React零碎

## 状态管理工具

### Redux

- **单一数据源**：

整个应用的状态被存储在一个单一的对象树（state tree）中，并且这个对象树只存在于`唯一的store中`。

- **状态是只读的**：

`唯一改变状态的方法是触发action`，action是一个用于描述已发生事件的普通对象。

- **使用纯函数来执行修改**：

通过编写reducers（纯函数），接收先前的state和action，并返回新的state。


工作流程：

- 定义Action：描述“发生了什么”的普通对象。

- 编写Reducer：根据action更新state的纯函数。

- 创建Store：将state、action和reducer联系在一起的对象。

- 分发Action：通过store.dispatch()方法分发action，触发reducer更新state。

### Mobx

- **可观察的数据源**：

MobX为现有的数据结构（如对象、数组和类实例）添加了可观察的功能。当这些数据变化时，MobX会自动通知所有依赖这些数据的反应（Reactions）。

- **自动依赖追踪**：

MobX在运行时自动追踪和更新依赖关系，这使得开发者无需手动编写订阅代码。

- **反应**：

当可观察的数据变化时，自动执行的函数或代码块。它们可以是重新渲染组件、执行副作用（如打印日志、数据请求等）或更新其他可观察数据。

工作流程：

- 定义可观察的数据：使用`@observable`装饰器或observable函数使数据可观察。

- 定义计算值：使用`@computed`装饰器或computed函数定义基于可观察数据的计算值。

- 定义反应：使用`autorun、reaction`等函数定义当可观察数据变化时需要执行的代码。


|        | Redux                               | Mobx                | zustand                                         |
|--------|-------------------------------------|---------------------|-------------------------------------------------|
| 设计思想	  | 函数式编程	                              | 对象编程和响应式编程（观察者模式）   | 函数式编程                                           |
| 状态管理   | 	集中管理在单一store中                      | 	可按模块划分多个独立的store   | 可按模块划分多个独立的store                                |
| 数据可变性	 | 强调`不可变`性，通过返回新状态对象来更新状态	              | 可直接使用新值更新状态对象       | 强调`不可变`性，可直接修改或返回新对象更新                          |
| 状态更新方式 | 	使用dispatch分发action，通过reducer更新state | 	自动追踪依赖并更新          | 直接通过store更新                                     |
| 适用场景   | 适合需要严格控制数据流和状态更新的大型应用               | 适合需要快速开发和细粒度状态管理的应用 | 适合需要快速开发和细粒度状态管理的应用                             |
| 缺点     | 配置繁琐，需要provider包裹                   | 包体积较大               | 默认不支持computed计算属性（可通过第三方zustand-computed或中间件实现） |


## 合成事件和原生事件

### 合成事件机制

- **事件委托**：

React并不直接在每个DOM元素上绑定事件处理器，而是采用事件委托的方式来处理事件。这意味着**React会在DOM的顶层（如document或React的根容器）上设置一个事件监听器**，然后当事件发生时，React会检查事件的目标和当前组件树，以决定哪个组件应该接收事件。

这种方式不仅减少了内存消耗，还提高了性能，因为不需要为每个DOM元素都单独绑定和解绑事件监听器。

:::warning 注意
React17版本后，合成事件最终会绑定到React`顶层root元素节点`上。有利于多个React版本场景下并存，比如x版本的react只会绑定到x版本的顶层root组件，如果是统一绑定到document则会管理混乱（如微前端）
:::

- **事件封装**：
  
React通过`对象池`的形式管理合成事件对象的创建和销毁。

当事件发生时，React会创建一个SyntheticEvent（合成事件）对象，该对象是**对浏览器原生事件对象的封装**。这个封装过程旨在提供更一致的事件对象，并消除不同浏览器之间的差异。

SyntheticEvent对象包含了与原生事件对象相似的属性和方法，但可能不完全相同。例如，React会在事件处理函数执行后立即回收SyntheticEvent对象，以避免内存泄漏。

- **事件传播**：

React合成事件`只支持事件的冒泡阶段`，不支持事件捕获阶段。这意味着事件会从触发事件的元素开始，向上冒泡至DOM树的顶层，直到被处理或取消。

### 对比原生事件

||React合成事件	|JavaScript原生事件|
|--|--|--|
|事件绑定	|在JSX中使用特殊属性（如onClick）绑定|	使用addEventListener方法或直接在HTML元素中通过事件属性绑定|
|事件监听器位置	|统一注册在DOM的顶层（如document或React的根容器）|	直接绑定在目标DOM元素上|
|事件对象	|SyntheticEvent对象，是对原生事件对象的封装|	原生浏览器事件对象|
|事件传播	|只支持冒泡阶段	|支持冒泡和捕获阶段|
|内存管理	|React会回收SyntheticEvent对象，减少内存泄漏风险	|需要开发者自行管理事件监听器的绑定和解绑，以避免内存泄漏|
|性能	|通过事件委托和对象池技术提高性能|	直接绑定可能会导致性能问题，尤其是在处理大量DOM元素时|

### 注意事项
- 论是否是对于同一元素监听的同种类型事件，`原生事件总是比合成事件先触发`。而document DOM上监听的原生事件则总是最后触发。

- 假如个元素的点击事件既触发了原生事件处理函数又触发了合成事件处理函数，可以通过`e.target.matches(selector)`来进行事件触发元素的区分。但尽量两种事件不要混用。

- 原生事件中如果执行了stopPropagation（阻止冒泡）方法，则很容易导致其他同类型react合成事件失效。因为这样`所有同级以及后代元素的合成事件和原生事件都将无法冒泡到document上`。

- 合成事件中使用了e.stopPropagation（阻止冒泡）方法，则`不会影响原生事件的冒泡`。


## createElement
```js
const jsx = React.createElement(type, props, ...children);
```

createElement 用于在 React 中动态地创建一个新的元素，并`返回一个 React元素对象（jsx）`。

其中type参数可以为`元素标签字符串`（如'div','p','span')或者`React组件`（class或函数）

```jsx
import React from 'react';

const TestComponent = (props) => {
    const { children, name } = props;
    return (
        <div>
            <p>我是一个React组件，我的名字是{name}</p>
            <p>下面是我的children子元素</p>
            {children}
        </div>
    );
};

export default () => {
    // 创建一个div标签的jsx元素
    const JSX = React.createElement(
        'div',
        { style: { color: 'red' } },
        <span>我是div的子元素</span>
    );
    
    
    // 创建一个以组件为模板的jsx元素，并设置props
    const JSX_COMP = React.createElement(
        TestComponent,
        { name: 'scw' },
        <span>我是TestComponent的第一个子元素</span>,
        '我是TestComponent的第二个子元素'
    );

    // 正确
    return JSX_COMP;

    // 错误
    // return <JSX_COMP />; // [!code error]
};


```

**适用场景**：创建动态的、全新的React元素，特别是在需要动态生成元素列表或条件渲染时。

## cloneElement
```js
const jsx = React.cloneElement(jsx, props, ...children);
```

cloneElement 用于复制一个已有的元素并覆盖或添加一些新的props属性。并`返回一个 React元素对象（jsx）`。

其中jsx参数可以为一段jsx元素代码，也可以为单独某个React组件的jsx调用代码

```jsx
import React from 'react';

const TestComponent = (props) => {
    const { children, name } = props;
    return (
        <div>
            <p>我是一个React组件，我的名字是{name}</p>
            <p>下面是我的children子元素</p>
            {children}
        </div>
    );
};

export default () => {
    // 创建一个div标签的克隆jsx元素，并修改color样式
    const Clone_JSX = React.cloneElement(
        <div style={{ color: 'red' }}>我是一个div</div>,
        { style: { color: 'blue' } },
        <span>我是div的子元素</span>
    );
    
    
    // 创建一个以组件为模板的克隆jsx元素，并替换部分props
    const Clone_JSX_COMP = React.cloneElement(
        <TestComponent name={'scw'}>
            <span>我是TestComponent的第一个子元素</span>
            <span>我是TestComponent的第二个子元素</span>
        </TestComponent>,
        { name: 'scw_clone' },
        <span>我是TestComponent的第一个子元素的clone</span>,
        '我是TestComponent的第二个子元素的clone'
    );

    // 正确
    return Clone_JSX_COMP;

    // 错误
    // return <Clone_JSX_COMP />; // [!code error]
};


```
**适用场景**：克隆已存在的元素，并根据需要添加、修改或删除属性，以避免重复编写相似的代码，特别是在需要处理元素变体时。



:::tip 总结
cloneElement和createElement都返回jsx对象，最主要区别在于**第一个参数的类型**
:::
## 其他

- 不考虑memo缓存的情况下，父组件执行了render，子组件`除了children渲染部分`，其他部分也一定会重新render。
- 一道测试题
    ```jsx
    export default function App() {
        const [state, setstate] = useState(0);
        console.log(1);
    
        useEffect(() => {
            console.log(2);
        }, [state]);
    
        // 宏任务
        setTimeout(() => {
            console.log(4);
        }, 0);
    
        // 微任务（优先级高）
        Promise.resolve().then(() => console.log(3));
    
        // 比useEffect回调先触发
        useLayoutEffect(() => {
            console.log(5);
            setstate((state) => state + 1);
        }, []);
        return null;
    } 
    //输出顺序：1 5 2 1 2 3 3 4 4
    ```