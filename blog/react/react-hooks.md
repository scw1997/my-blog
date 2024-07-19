# 深入React Hooks

本文并不从零讲解React Hooks的用法，而是主要介绍需要注意的坑，最佳实践以及基本原理。

## 为什么使用Hooks

相比class写法：

- 函数式编程风格，代码更简洁。
- 使用自定义Hooks，相比Render Props和HOC，使得状态逻辑复用更容易。
- 无需关注this绑定问题。
- 通过useEffect使得副作用（网络请求，定时器，事件监听等）逻辑与组件的渲染逻辑分离，管理更灵活。


## 使用注意

- 只能在函数内部的最外层调用 Hook，不能在循环、条件判断或者子函数中调用。

    :::tip 原理
    Hooks的调用是通过维护一个内部的`链表`来追踪的。这个链表中的每个节点都对应一个Hook的调用。如果Hooks的调用顺序发生变化，那么这个链表的结构也会发生变化，从而导致React无法正确地管理这些Hooks的状态。
    :::
- 只能在 `React 的函数组件`或者`自定义Hook`中调用 Hook。

- **函数每一次重新执行并渲染都是独立的闭包和作用域**。

## useState

```js
const [state1, setState1] = useState(initState1);
const [state2, setState2] = useState(initState2);
```

:::warning 注意
- React是根据每个useState`定义时的顺序`来确定你在更新State值时更新的是哪个state。这一点同hook的调用顺序原理一致。
- 与class的setState不同,useState更新state时是通过`Object.is`来比较新/旧state，并且`直接用新state替换旧state`。如果新旧state相等，则不会更新渲染。而class是进行新旧state合并。
- initState只会在第一次渲染时取值，后续渲染会忽略
- useState`不能直接用于存储函数或函数组件`，它会调用该函数并且将函数的返回值作为最终state值进行存储或更新。如果必须这么做，可以将该函数作为一个数组的元素或对象的某个属性进行state存储。
- 函数的运行是独立的，每个函数都有一份独立的作用域。函数的变量是保存在运行时的作用域里面。
- 由于函数每次渲染上下文互相独立的原因，在异步操作中更新state会触发闭包陷阱，导致出现数据更新不同步的现象：
  :::code-group 
  ```jsx [示例1]
  const Counter = () => {
    const [counter, setCounter] = useState(0);
    const onAlertButtonClick = () => {
      setTimeout(() => {
        alert("Value: " + counter);  //点击后，无论中途再重复点击多少次，3s后打印固定为第一次执行上下文的值0
      }, 3000);
    };
    return (
      <div>
        <p>You clicked {counter} times.</p>
        <button onClick={() => setCounter(counter + 1)}>Click me</button>
        <button onClick={onAlertButtonClick}>
          Show me the value in 3 seconds
        </button>
      </div>
    );
  };
  ```
   ```jsx [示例2]
  function Index() {
      const [num, setNumber] = React.useState(0)
      const handerClick = () => {
          for (let i = 0; i < 5; i++) {
              setTimeout(() => {
                  setNumber(num + 1)
                  console.log(num) //点击按钮后，循环5次打印的都是第一次执行上下文的值：0 0 0 0 0
              }, 1000)
          }
      }
      return <button onClick={handerClick}>{num}</button>
  }
    ```
  :::


## useEffect

什么是副作用？

> 副作用（Side Effects）指的是那些在函数组件执行过程中，没有发生在数据向视图转换过程中的逻辑。这些操作通常会影响组件的外部状态或环境，例如数据获取（如Ajax请求）、手动修改DOM、设置订阅（如WebSocket连接）、监听浏览器事件（如窗口大小变化）、设置或清除定时器等。

React 通过useEffect来管理副作用：
```jsx
const [num, setNumber] = useState(0);

// 相当于class的componentDidMount
useEffect(() => {
    //处理副作用逻辑
    return ()=>{
        //相当于class的componentWillUnmount
    }
}, []);

useEffect(() => {
  console.log('第一次组件渲染后或num更新渲染后');
  return () => {
    //下一次更新之前和组件卸载之前调用，用于清理上次更新后的副作用，
    console.log('num即将再次更新或组件卸载');
  };
}, [num]);

```


:::warning 注意

- 默认情况下，useEffect在第一次渲染之后（无论是否指定了dep）和每次指定dep更新之后都会执行。
- 多个useEffect则会按声明顺序执行。
- useEffect不能使用async 作为回调函数。你应该另外声明一个async函数并在useEffect中调用它。
:::
