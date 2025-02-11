# React Class组件

## 生命周期（v16.3之后）

生命周期的大致介绍

### 挂载阶段

在挂载阶段，React 组件被创建并插入到 DOM 树中。这个阶段主要包括以下几个生命周期方法：

- **constructor(props)**：

这是类组件的构造函数，它会在组件实例化时立即被调用。在这里，你可以初始化组件的 state 或进行其他初始化操作。注意，在构造函数中直接调用 setState 是不会触发额外的渲染的。

- **static getDerivedStateFromProps(props, state)**：

这是一个静态方法，会在组件实例化后和接收到新的 props 之前被调用。它应返回一个对象来更新 state，或者返回 null 表示新的 props 不需要更新任何 state。这个方法主要用于替代 componentWillMount 和 componentWillReceiveProps。

- **render()**：

这是类组件中唯一必须实现的方法。它应该是一个纯函数，返回组件的 JSX 结构。React 会使用这个方法返回的 JSX 来构建 DOM。

- **componentDidMount()**：

这个方法会在组件挂载后立即调用，此时组件已经渲染到 DOM 中。这是执行 DOM 操作、网络请求、添加订阅等副作用的理想位置。

### 更新阶段

在更新阶段，组件的 props 或 state 发生变化，导致组件重新渲染。这个阶段主要包括以下几个生命周期方法：

- **static getDerivedStateFromProps(props, state)**：

在组件更新时，这个方法也会被调用，用于根据新的 props 更新 state。

- **shouldComponentUpdate(nextProps, nextState)**：

这个方法用于判断组件是否应该重新渲染。如果返回 false，则组件不会重新渲染，后续的生命周期方法也不会被调用。这个方法主要用于性能优化。

- **render()**：

与挂载阶段相同，这个方法会返回组件的 JSX 结构。

- **getSnapshotBeforeUpdate(prevProps, prevState)**：

这个方法在最近的渲染输出提交给 DOM 之前调用，它使你的组件能在提交更改之前返回任意值以用于 componentDidUpdate。这个值将与 componentDidUpdate() 的第三个参数 snapshot 一起被调用。

- **componentDidUpdate(prevProps, prevState, snapshot)**：

这个方法会在组件更新后立即调用。如果 getSnapshotBeforeUpdate 返回了非 null 的值，则这个值会作为第三个参数传递给 componentDidUpdate。

### 卸载阶段

在卸载阶段，组件从 DOM 树中被移除。这个阶段只包含一个生命周期方法：

- **componentWillUnmount()**：

这个方法会在组件卸载及销毁之前调用。你可以在这里执行一些清理工作，如取消网络请求、移除订阅等。

## setState的同步/异步

setState是否同步/异步由React版本和当前所调用的事件方法类型决定。

### React 18之前

:::code-group
```jsx [合成事件/生命周期]
import React from 'react';

export default class extends React.PureComponent {
    state = {
        num: 0
    };

    componentDidMount() {
        console.log('componentDidMount');

        this.setState({
            num: 1
        });

        console.log(this.state.num); // 0

        this.setState({
            num: 2
        });

        console.log(this.state.num); // 0
    }

    handleClick = () => {
        // 点击一次后
        console.log('click');
        
        // 此时componentDidMount已执行完毕，num为2
        console.log(this.state.num); // 2
        
        this.setState({
            num: 3
        });

        console.log(this.state.num); // 2

        this.setState({
            num: 4
        });

        console.log(this.state.num); // 2
    };

    render() {
        return <div onClick={this.handleClick}>我是一个组件</div>;
    }
}

```

```jsx [原生事件]
import React from 'react';

export default class extends React.PureComponent {
    state = {
        num: 0
    };

    componentDidMount() {
        // 点击一次后
        document.addEventListener('click', () => {
            this.setState({
                num: 1
            });

            console.log(this.state.num); // 1

            this.setState({
                num: 2
            });

            console.log(this.state.num); // 2

            setTimeout(() => {
                console.log(this.state.num); // 2
                
                this.setState({
                    num: 3
                });

                console.log(this.state.num); // 3

                this.setState({
                    num: 4
                });

                console.log(this.state.num); // 4
            }, 0);
        });
    }

    render() {
        return <div>我是一个组件</div>;
    }
}

```

```jsx [合成/原生事件组合]
import React from 'react';

export default class extends React.PureComponent {
    state = {
        num: 0
    };

    handleClick = () => {
        // 点击一次后
        // 合成事件
        this.setState({
            num: 1
        });

        console.log(this.state.num); // 0

        this.setState({
            num: 2
        });

        console.log(this.state.num); // 0

        // 原生事件
        setTimeout(() => {
            console.log(this.state.num); // 2

            this.setState({
                num: 3
            });

            console.log(this.state.num); // 3

            this.setState({
                num: 4
            });

            console.log(this.state.num); // 4
        }, 0);
    };

    render() {
        return <div onClick={this.handleClick}>我是一个组件</div>;
    }
}


```
:::

- 在js原生事件处理函数（如addEventListener，setTimeout和setInterval等回调）中，setState的执行是同步的，这意味着你可以立即拿到最新的state值。并且多次调用setState，也会按顺序多次进行累加。


- 在react合成事件处理函数/生命周期中：setState的执行是异步的。多次调用setState会进行一次性批量合并更新。



:::tip 大致原理
React通过设置全局变量`isBatchingEventUpdates`来标志当前的变化是否发生在React的可调度范围内。

如果在可调度范围(即值为true)内，那么将开启批量更新，即表现为异步刷新。

如果不在可调度范围内(即值为false)，那么将进入`flushSyncCallbackQueue`函数进行同步刷新。

由于只有在React合成事件中才会设置isBatchingEventUpdates标志，因此像setTimeout、自定义监听事件、.then等触发的数据更新都无法触发批处理，即表现为同步刷新。


:::

### React 18

:::code-group
```jsx [合成事件/生命周期]
import React from 'react';

export default class extends React.PureComponent {
    state = {
        num: 0
    };

    componentDidMount() {
        console.log('componentDidMount');

        this.setState({
            num: 1
        });

        console.log(this.state.num); // 0

        this.setState({
            num: 2
        });

        console.log(this.state.num); // 0
    }

    handleClick = () => {
        // 点击一次后
        console.log('click');
        
        // 此时componentDidMount已执行完毕，num为2
        console.log(this.state.num); // 2
        
        this.setState({
            num: 3
        });

        console.log(this.state.num); // 2

        this.setState({
            num: 4
        });

        console.log(this.state.num); // 2
    };

    render() {
        return <div onClick={this.handleClick}>我是一个组件</div>;
    }
}

```

```jsx [原生事件]
import React from 'react';

export default class extends React.PureComponent {
    state = {
        num: 0
    };

    componentDidMount() {
        // 点击一次后
        document.addEventListener('click', () => {
            this.setState({
                num: 1
            });

            console.log(this.state.num); // 0

            this.setState({
                num: 2
            });

            console.log(this.state.num); // 0

            setTimeout(() => {
                console.log(this.state.num); // 2
                
                this.setState({
                    num: 3
                });

                console.log(this.state.num); // 2

                this.setState({
                    num: 4
                });

                console.log(this.state.num); // 2
            }, 0);
        });
    }

    render() {
        return <div>我是一个组件</div>;
    }
}

```

```jsx [合成/原生事件组合]
import React from 'react';

export default class extends React.PureComponent {
    state = {
        num: 0
    };

    handleClick = () => {
        // 点击一次后
        // 合成事件
        this.setState({
            num: 1
        });

        console.log(this.state.num); // 0

        this.setState({
            num: 2
        });

        console.log(this.state.num); // 0

        // 原生事件
        setTimeout(() => {
            // 新的事件，开始新的批次。可以拿到上个批次的最终更新值
            console.log(this.state.num); // 2

            this.setState({
                num: 3
            });

            console.log(this.state.num); // 2

            this.setState({
                num: 4
            });

            console.log(this.state.num); // 2
        }, 0);
    };

    render() {
        return <div onClick={this.handleClick}>我是一个组件</div>;
    }
}


```
:::

React 18中新增了`自动批处理`功能，指当 React 在一个单独的重渲染事件中批量处理多个状态更新以此实现优化性能。

这意味着，`无论是原生还是合成事件，都会在同一批次内执行异步更新，但进入不同的批次后再获取就是上个批次的最终更新值`。

### 不想自动批处理

自动批处理是安全的，但某些代码可能依赖于在状态更改后立即从 DOM 中读取某些内容。这种情况，可以选择`ReactDOM.flushSync()` 退出批处理，立即执行调度更新：

```jsx
import React from 'react';
import ReactDom from 'react-dom';

export default class extends React.PureComponent {
    state = {
        num: 0
    };

    handleClick = () => {
        // 点击一次后
        // 合成事件
        this.setState({
            num: 1
        });

        console.log(this.state.num); // 0

        // 此处执行强制同步刷新
        ReactDom.flushSync(() => {
            this.setState({ num: 2 });
            console.log(this.state.num); // 0
        });

        console.log(this.state.num); // 2

        // 原生事件
        setTimeout(() => {
            // 新的事件，开始新的批次。可以拿到上个批次的最终更新值
            console.log(this.state.num); // 2

            this.setState({
                num: 3
            });

            console.log(this.state.num); // 2

            this.setState({
                num: 4
            });

            console.log(this.state.num); // 2
        }, 0);
    };

    render() {
        return <div onClick={this.handleClick}>我是一个组件</div>;
    }
}

```

###  Hook中的setState

hook写法通过使用useState来进行更新state，由于是函数组件，跟class的机制完全不同。

详见：[深入React Hooks > useState](/core/react/react-hooks#usestate)
## 其他答疑

**1. componentDidMount和componentWillMount那个适合用于执行初始网路数据请求?**

答案是： componentDidMount。理由如下：

- componentWillMount在React的后续版本中已被标记为不安全（UNSAFE_componentWillMount），并可能在未来版本中完全移除。

- componentWillMount在组件挂载（mount）之前被调用，这意味着在这个方法中进行的任何异步操作（如网络请求）都可能在组件实际渲染到DOM之前完成，也可能在之后完成。这会导致数据到达的时机与组件渲染的时机不一致，增加了代码的复杂性和出错的可能性。

- 在服务器端渲染的场景中，componentWillMount可能会被多次调用，这会导致不必要的网络请求和数据重复加载。

- componentDidMount 方法在组件被挂载到DOM之后立即调用。这意味着在componentDidMount内部执行的代码可以安全地访问DOM元素，而后者访问DOM却并不安全

**2. 为什么class组件中事件绑定函数需要手动绑定this?**

```jsx
import React from 'react';

export default class extends React.PureComponent {

    func() {
        //do something
    }
    handleClick() {
        console.log('click');
        this.func(); //报错，此时this为undefined
    }
    render() {
        return <div onClick={this.handleClick}>我是一个组件</div>;
    }
}
```

**首先需要明确，js代码中this指向是由函数真正被调用时决定的，而非声明时。详见[JS This绑定机制](/core/js/this-bind)**

由上述例子：

在render方法中，`this指向当前的组件实例，因为render是由React在组件实例的上下文中调用的`。React确保在调用render方法时，this已经正确地指向了组件实例。

而当一个函数被用作回调时（例如作为事件监听回调函数），回除非显式地绑定了this，否则this的值将取决于函数是如何被调用的。

而在这个例子中，handleClick属于React的合成事件，React通过`对象池`的形式管理合成事件对象的创建和销毁。这意味着当handleClick真正被调用时，上下文已不被指向组件实例，实际上此时this的值会回退到默认绑定，而又因为类声明和原型方法是以严格模式运行。
严格模式下this的默认绑定不再是window，而是undefined。


## 其他

- setState必然会触发render函数进行更新渲染，无论这个更新的state有没有在render中用到。
