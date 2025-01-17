# 深入React Hooks

本文并不完全从零讲解React Hooks的用法，而是主要介绍Hook使用的最佳实践，注意事项和基本原理。

![react-hooks.png](/react_hooks.png)

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
### 闭包陷阱

由于函数每次渲染上下文互相独立的原因，在异步操作中更新state会触发闭包陷阱，导致出现数据更新不同步的现象：
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

你可通过使用[useRef](#useref)解决此问题

### 批量更新

如果你在一个事件处理函数中多次调用更新函数，每次调用都会触发一个更新，但 React 会尽可能将这些更新`合并到一次重新渲染`中以提高性能。

此外，setState是异步更新(将多次setState存储在queue队列中，等待调度完成一起更新)，通常你需要在useEffect回调中才能拿到最新的state值。

然而，如果你在更新函数中基于先前的 state 来计算新的 state（例如，通过闭包捕获的 state），你可能需要**使用函数的形式来确保你得到的是最新的 state 值**。


```jsx
function Counter() {  
  const [count, setCount] = useState(0);  
  
  // 正确的更新方式，使用函数形式确保使用最新的 state  
  const handleIncrement = () => {  
    setCount(prevCount => prevCount + 1);  
    // 假设你想再次更新，但基于当前最新的 count  
    setCount(prevCount => prevCount + 1); // 这里 prevCount 已经是更新后的值了  
  };  
  
  return (  
    <div>  
      <p>You clicked {count} times</p>  
      <button onClick={handleIncrement}>  
        Click me  
      </button>  
    </div>  
  );  
}
```

:::warning 其他注意事项
- React是根据每个useState`定义时的顺序`来确定你在更新State值时更新的是哪个state。这一点同hook的调用顺序原理一致。
- 与class的setState不同,useState更新state时是通过`Object.is`来比较新/旧state，并且`直接用新state替换旧state`。如果新旧state相等，则不会更新渲染。而class是进行新旧state合并。
- initState只会在第一次渲染时取值，后续渲染会忽略
- useState`不能直接用于存储函数或函数组件`，它会调用该函数并且将函数的返回值作为最终state值进行存储或更新。所以你可以使用`const [func,setFunc] = useState(()=>initFunc)`这种写法
:::
## useEffect

什么是副作用？

> 副作用（Side Effects）指的是那些在函数组件执行过程中，没有发生在数据向视图转换过程中的逻辑。这些操作通常会影响组件的外部状态或环境，例如数据获取（如Ajax请求）、手动修改DOM、设置订阅（如WebSocket连接）、监听浏览器事件（如窗口大小变化）、设置或清除定时器等。

React 通过useEffect来管理副作用，其执行原理大致如下：

:::info 执行原理
- 调度副作用：

  当你在组件内部调用useEffect时，你实际上是`将一个副作用函数及其依赖项数组排队等待执行`。这个函数并不会立即执行，而是会被React收集起来，等待合适的时机执行。

- 依赖项检测：

  如果useEffect的第二个参数（依赖项数组）被提供，React会在每次渲染时比较当前的依赖项数组和上一次的依赖项数组。如果依赖项有变化，或者没有提供依赖项数组（意味着依赖项为所有props和state），则副作用函数会重新执行。

- 执行副作用：

  在Commit阶段之后，React会处理所有排队的副作用（异步执行）。如果组件是首次渲染，所有的副作用都会执行。如果组件是重新渲染，则根据依赖项数组的变化情况来决定是否执行副作用函数。

- 清理机制

  如果副作用函数返回了一个函数，那么这个函数将被视为清理函数。在执行当前的副作用之前，以及组件卸载前，React会先调用上一次渲染中的清理函数。
:::
```jsx
const [num, setNumber] = useState(0);

// 无依赖的useEffect
// 相当于class的componentDidMount
useEffect(() => {
    //处理副作用逻辑
    return ()=>{
        //相当于class的componentWillUnmount
    }
}, []);

// 有依赖的useEffect
useEffect(() => {
  console.log('第一次组件渲染后或num更新渲染后');
  return () => {
    //下一次更新之前或组件卸载之前调用，用于清理上次更新后的副作用，
    console.log('num即将再次更新或组件卸载');
  };
}, [num]);

```


:::warning 注意

- 默认情况下，useEffect在第一次渲染之后（无论是否指定了dep）和每次指定dep更新之后都会执行。
- 多个useEffect则会按声明顺序执行。
- useEffect不能使用async 作为回调函数。你应该另外声明一个async函数并在useEffect中调用它。
:::


## useLayoutEffect


useEffect 是`异步非阻塞调用`，大致流程如下：

:::info 流程
1. 触发渲染函数执行（改变状态，或者父组件重新渲染）
2. React调用组件的渲染函数
3. 屏幕中重绘完成（Renderer commit阶段结束）
4. 执行useEffect
:::

useLayoutEffect 是`同步阻塞调用`，大致流程如下：

:::info 流程
1. 触发渲染函数执行（改变状态，或者父组件重新渲染）
2. React调用组件的渲染函数
3. DOM 变更后（Renderer render阶段结束），执行useLayoutEffect，并且React等待它执行完成（即Renderer commit阶段的Layout子阶段同步执行）
4. 屏幕中重绘完成
:::


**使用场景**：

大部分情况下使用useEffect即可。

针对小部分特殊情况如**短时间内触发了多次状态更新导致渲染多次以致屏幕闪烁的情况或者在状态更新后涉及DOM修改**，使用useLayoutEffect会在浏览器渲染之前同步更新
DOM 数据，哪怕是多次的操作，也会在渲染前一次性处理完，再交给浏览器绘制。这样不会导致闪屏现象发生。


## useReducer

useReducer与useState都用来管理更新状态，但useReducer可以`更加优雅地处理复杂状态`。

useReducer的机制与Redux类似。

示例：
```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState,);

  return (
    <>
      Count: {state.count}
      {/*  dispatch 用来接收一个 action参数「reducer中的action」，用来触发reducer函数，更新最新的状态*/}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}

```


:::warning 注意
-  与setState一样，dispatch调用后，状态更新是异步的，因此立刻读取状态可能仍是旧的。并且同样是通过`Object.is`来比较新/旧state。
-  如果页面state比较复杂，同时需要操作或更新多个state值，或者需要子组件触发state的变化，推荐使用useReducer，否则仍可以使用useState.
:::


### 第三个参数

useReducer还有第三个参数init，通过它可以`优化初始化状态时的性能`

假设场景：计数器的值保存在localStorage里面，进入页面的时候，我们希望从localStorage中读取值来作为useReducer初值.

:::code-group 
```jsx [使用第二个参数初始化状态]
function getInitialCount() {
  const savedCount = localStorage.getItem("count");
  return savedCount ? Number(savedCount) : 0;
}

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, getInitialCount());

  // 使用useEffect来监听状态的变化，并将其保存到localStorage
  useEffect(() => {
    localStorage.setItem("count", state.count);
  }, [state.count]);

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button>
    </>
  );
}

```
```jsx [使用第三个参数初始化状态]
function init(initialValue) {
  // 尝试从localStorage中读取值
  const savedCount = localStorage.getItem("count");

  // 如果有值并且可以被解析为数字，则返回它，否则返回initialValue
  return { count: savedCount ? Number(savedCount) : initialValue };
}

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, 0, init);

  // 使用useEffect来监听状态的变化，并将其保存到localStorage
  useEffect(() => {
    localStorage.setItem("count", state.count);
  }, [state.count]);

  return (
          <>
            Count: {state.count}
            <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>
            <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button>
          </>
  );
}

```

**主要区别**：直接调用函数作为第二个参数：这个函数会在`每次组件渲染时执行`。使用第三个参数init函数，init函数只在组件`初次渲染时执行一次`。
:::

### 应用场景

- **实现中间件**
```jsx
function thunkMiddleware(dispatch) {
    // 调用原始的dispatch之前首先检查了action的类型。实际上，你可以在这里添加任何你想要的逻辑，例如日志记录、错误处理、请求API等。
    return function(action) {
        if (typeof action === 'function') {
            action(dispatch);
        } else {
            dispatch(action);
        }
        // 在dispatch调用之后，依然可以添加额外的逻辑。
        console.log("Action dispatched at: ", new Date().toISOString());
    };
}

function fetchData() {
    return dispatch => {
        fetch("/api/data")
            .then(res => res.json())
            .then(data => dispatch({ type: 'SET_DATA', payload: data }));
    };
}

function App() {
    const [state, unenhancedDispatch] = useReducer(reducer, initialState);
    const dispatch = thunkMiddleware(unenhancedDispatch);
    
    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);
}

```

- **实现简易状态管理工具**

需要与useContext配合使用，见下述讲解。

## useContext

useContext解决的是：让开发者在某些场景下，从多层嵌套传值的组件树中解脱出来，通过context实现`跨层级共享状态`。

典型应用：**实现简易状态管理工具**（配合useReducer）

```jsx
// 定义状态、reducer 和 context:
const ThemeContext = React.createContext();

const initialState = { theme: 'light' };

function themeReducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_THEME':
            return { theme: state.theme === 'light' ? 'dark' : 'light' };
        default:
            return state;
    }
}

```

```jsx
// 创建Provider组件：
function ThemeProvider({ children }) {
    const [state, dispatch] = useReducer(themeReducer, initialState);

    return (
        <ThemeContext.Provider value={{ theme: state.theme, toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }) }}>
            {children}
        </ThemeContext.Provider>
    );
}
```

```jsx
// 在子组件中使用和修改context
function ThemedButton() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button style={{ backgroundColor: theme === 'light' ? '#fff' : '#000' }} onClick={toggleTheme}>
            Toggle Theme
        </button>
    );
}

```

### 性能优化

**当Provider的value属性值发生变化时，所有使用了useContext的组件都将重新渲染。**

如果value经常变化，或者消费者组件很多，那么这会引起大量的不必要的渲染。


- 解决方法1：**使用多个Context或 Context Provider**

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
	      <Toolbar />
         <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
	        Toggle Theme
	      </button>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

```
当某一部分的数据发生变化时，只有依赖于那部分数据的组件会重新渲染。

- 解决方法2：**使用useMemo或useCallback缓存指定value**

```js
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}

```

## useRef
```js
// 定义
const inputRef = useRef(null);

// 使用
console.log(inputRef.current)

```
useRef返回一个可变的 ref 对象，通过.current可以获取保存在useRef的值。

useRef与useState的核心区别在于：

- useRef的返回对象`在组件的整个生命周期中都是同一个引用`，而不是每次渲染都重新创建。
- useState中的状态改变时，组件会重新渲染。而当useRef的.current属性改变时，组件`不会重新渲染`。


useRef可用于访问DOM元素，保存一些不用于实时渲染的状态。


:::warning 注意

- 应该`避免在渲染期间读/写ref`，因为ref更新不会触发渲染，而state是异步更新。所以很容易与一些依赖ref值的state组合产生非期望中的渲染结果
  ```js
  function DisplayValue({ value }) {
    const previousValue = useRef(value);
  
      // 错误：在渲染期间修改 ref
    if (previousValue.current !== value) {
      previousValue.current = value;
    }
  
    return (
      <div>
        Current Value: {value} <br />
        {/* 错误：在渲染期间读 ref */}
        Previous Value: {previousValue.current}
      </div>
    );
  }

  ```
- useRef的初始值同样`只会在首次渲染时取值`，但如果初始值是一个函数的返回值，那么依然会每次渲染时调用。虽然依然不影响运行结果，但会有性能损耗。
:::


## useMemo

useMemo用于根据指定依赖缓存计算结果，，避免不必要的渲染。

除了缓存一些逻辑计算的结果，还可以用于缓存组件和函数：


:::code-group 
```js [缓存计算结果]
function Example(){

    const [count, setCount]= useState(1);
    
    // 任何state/props变化都会重新计算num
    // const num = (555 * 666666 )+count
  
  
    //只有count值改变时，才会重新计算
    const num = useMemo(() => {
        return (555 * 666666 )+count
    },[count])

    return <div>
    <h4>总和:{num}</h4>
        <button onClick={() => setCount(count + 1)}>+1</button>
        </div>

}
```
```js [缓存组件]
function ParentComponent(props) {
  const [someData, setSomeData] = useState(initialData);

  // 类似于给ExpensiveComponent组件添加React.memo包裹的效果
  const MemoizedExpensiveComponent = useMemo(() => {
    return <ExpensiveComponent data={someData} />;
  }, [someData]);

  return (
          <div>
            {MemoizedExpensiveComponent}
            {/* 其他组件和逻辑 */}
          </div>
  );
}

```

```js [缓存函数]
const handleUserClick = useMemo(() => {
  return (userName) => {
    alert(`Clicked on: ${userName}`);
  };
}, []);

```
:::

### 避免过度优化
```js
import React, { useState, useMemo } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    const handleIncrease = useMemo(() => {
        return () => {
            setCount(count + 1);
        };
    }, [count]);

    return (
        <div>
            <div>{count}</div>
            <button onClick={handleIncrease}>Increase</button>
        </div>
    );
}

export default Counter;


```

上述个例子中，原始的组件是简单的，并且性能表现得很好。引入useMemo只是增加了代码的复杂性，而并没有带来任何实际的性能提升。

`useMemo本身也有开销`。在这种情况下，任何由useMemo带来的小优势都被其自身的开销抵消了，因为每次count变化，handleIncrease都会重新计算。


## useCallback

useCallback是对useMemo的特化，它可以返回一个缓存版本的函数，只有当它的依赖项改变时，函数才会被重新创建。这意味着如果依赖没有改变，函数引用保持不变，从而避免了因函数引用改变导致的不必要的重新渲染。

从本质上说，`useCallback(fn, deps)`就是`useMemo(() => fn, deps)`的语法糖。



何时使用useCallback：

- **子组件的性能优化**：当你将函数作为 prop 传递给已经通过`React.memo`进行优化的子组件时，使用useCallback可以确保子组件不会因为父组件中的函数重建而进行不必要的重新渲染。
- **Hook 依赖**：如果你正在传递的函数会被用作其他 Hook（例如useEffect）的依赖时，使用useCallback可确保函数的稳定性，从而避免不必要的副作用的执行。
- **复杂计算与频繁的重新渲染**：在应用涉及很多细粒度的交互，如绘图应用或其它需要大量操作和反馈的场景，使用useCallback可以避免因频繁的渲染而导致的性能问题。

避免使用useCallback：

- **过度优化**：在大部分情况下，函数组件的重新渲染并不会带来明显的性能问题，过度使用useCallback可能会使代码变得复杂且难以维护。
- **简单组件**：对于没有经过React.memo优化的子组件或者那些不会因为 prop 变化而重新渲染的组件，使用useCallback是不必要的。
- **使代码复杂化**：如果引入useCallback仅仅是为了“可能会”有性能提升，而实际上并没有明确的证据表明确实有性能问题，这可能会降低代码的可读性和可维护性。
- **不涉及其它 Hooks 的函数**：如果一个函数并不被用作其他 Hooks 的依赖，并且也不被传递给任何子组件，那么没有理由使用useCallback。

示例：

```js
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: Date.now(), text };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  }, [todos]);  // 这里是问题所在，todos的依赖导致这个useCallback几乎失去了其作用

  return (
    <div>
      <input value={inputValue} onChange={handleInputChange} />
      <button onClick={() => handleAddTodo(inputValue)}>Add Todo</button>
      <ul>
        {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
      </ul>
    </div>
  );
}

```
在上面的示例中，每当todos改变，handleAddTodo都会重新创建，尽管我们使用了useCallback。这实际上并没有给我们带来预期的性能优化。正确的做法是利用setTodos的函数式更新，这样我们就可以去掉todos依赖：
```js
const handleAddTodo = useCallback((text) => {
  const newTodo = { id: Date.now(), text };
  setTodos((prevTodos) => [...prevTodos, newTodo]);
}, []);  // 注意这里的空依赖数组

```

## useImperativeHandle

在class组件中，通过ref可以访问DOM 节点或组件实例，通过组件实例可以拿到子组件内部的状态和方法。

在函数组件中，默认是没有组件实例的,ref是不可用的。需要通过`forwardRef`来定义组件的DOM引用

通过`useImperativeHandle`并配合`forwardRef`可以自定义我们想要暴露给父组件的实例方法或属性。



子组件定义要暴露的状态和方法：
```js

import {useImperativeHandle,forwardRef} from 'react'

const ForwardedCustomInput = forwardRef((props, ref)=> {
  const inputRef = useRef();
  const [state,setState] = useState({})
  const updateChildState = (state)=>{
      setState(state)
  }
  useImperativeHandle(ref, () => ({
    // 修改子组件保存的useRef状态值
    clear: () => {
      inputRef.current.value = '';
    },
    // 修改子组件的state
    updateChildState,
    //子组件的state
    childState:state
  }));

  return <input ref={inputRef} />;
})

```

父组件操作ref

```js
function App() {
  const inputRef = useRef();

  return (
    <div>
      <ForwardedCustomInput ref={inputRef} />
      <button onClick={() => inputRef.current.clear()}>Clear Input</button>
      <button onClick={() => console.log(inputRef.current.childState)}>getChildState</button>
      <button onClick={() => inputRef.current.updateChildState({a:1})}>updateChildState</button>
    </div>
  );
}

```

## useId

useId的出现背景：

:::tip 应用场景  
当你看到一个服务端渲染的应用，它的渲染过程会是这样：服务端会先生成 HTML，然后将这个 HTML 发送到客户端，在客户端，React 会进行一个叫做 hydration 的过程，即将服务器端生成的 HTML 和客户端的 DOM 进行匹配，并生成最终的 HTML。

而在这个过程中，我们有时候需要给 DOM 生成唯一的 ID。例如：我们需要通过 JavaScript 或 CSS 选择器来访问 DOM 的时候；或者某些HTML属性（如 aria-labelledby）需要使用唯一的 ID 来关联元素。

如果在 hydration 过程中，服务器端和客户端生成的 ID 不一致，那么就会导致 hydration 失败。为了解决这个问题，React v18 引入了一个新的 Hook——useId。通过使用一些内部机制，React 确保了`无论是在服务器端还是客户端，对于同一个组件实例，useId 都会返回相同的 ID`。

:::



```jsx
const inputId = useId()
const selectId = useId()
```

应用场景：

- 创建DOM元素的唯一ID
- 为同一组件实例的各个元素的属性生成统一前缀
- ...

## 自定义Hooks

没有 Hooks 之前，高阶组件HOC和 Render Props 本质上都是将复用逻辑提升到父组件中。

Hooks 出现之后，我们将复用逻辑提取到组件顶层，而不是强行提升到父组件中。这样就能够`逻辑解耦，避免 HOC 和 Render Props 带来的嵌套地狱`

**示例1：获取当前组件的挂载时间**

:::code-group 

```jsx [Render Props]
import { useEffect, useState } from 'react';
const MountTimeProvider = ({ render }) => {
  const [mountTime, setMountTime] = useState(null);
  useEffect(() => {
    setMountTime(Date.now());
  }, []);
  return render({ mountTime });
};

const Input = ({ mountTime, value }) => {
  return (
          <div>
            <input type="text" value={value} />
            <p>input mountTime:{mountTime}</p>
          </div>
  );
};

const App = () => {
  return (
          <MountTimeProvider
                  render={({ mountTime }) => <Input value={'inputValue'} mountTime={mountTime} />}
          />
  );
};
export default App;

```
```jsx [高阶组件HOC]
import { useEffect, useState } from 'react';
const withMountTime = (Component) => {
  // 相比Render Props，高阶组件还可以操控传入组件的props
  return (props) => {
    const [mountTime, setMountTime] = useState(null);
    useEffect(() => {
      setMountTime(Date.now());
    }, []);
    return <Component {...props} mountTime={mountTime} />;
  };
};

const Input = withMountTime(({ mountTime, value }) => {
  return (
          <div>
            <input type="text" value={value} />
            <p>input mountTime:{mountTime}</p>
          </div>
  );
});

const App = () => <Input value={'inputValue'} />;
export default App;
```
```jsx [自定义Hook]

import { useEffect, useState } from 'react';

const useMountTime = () => {
  const [mountTime, setMountTime] = useState(null);

  useEffect(() => {
    setMountTime(Date.now());
  }, []);

  return mountTime;
};

const Input = ({ value }) => {
  const mountTime = useMountTime();
  return (
          <div>
            <input type="text" value={value} />
            <p>input mountTime:{mountTime}</p>
          </div>
  );
};

const App = () => <Input value={'inputValue'} />;
export default App;

```
:::

**示例2：封装一个根据指定userId获取用户数据的插件**

:::code-group

```jsx [Render Props]
import { useEffect, useState } from 'react';

const UserDataProvider = ({ userId, render }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    fetch(`http://example.api.com/getUser?id=${userId}`)
            .then((response) => response.json())
            .then((data) => {
              setUserData(data);
              setLoading(false);
            })
            .catch((error) => {
              setError(error);
              setLoading(false);
            });
  }, []);
  return render({ loading, userData, error });
};

const UserData = ({ data }) => {
  const { loading, userData, error } = data;
  if (loading) return <span>loading...</span>;
  if (error) return <span>error</span>;
  return (
          <div>
            User Msg
            <p>userName:{userData?.name}</p>
            <p>userAge:{userData?.age}</p>
          </div>
  );
};

const App = () => {
  return <UserDataProvider userId={1} render={(data) => <UserData data={data} />} />;
};
export default App;


```
```jsx [高阶组件HOC]
import { useEffect, useState } from 'react';
const withFetchUserData = (Component, userId) => {
  // 相比Render Props，高阶组件还可以操控传入组件的props
  return (props) => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
      setLoading(true);
      fetch(`http://example.api.com/getUser?id=${userId}`)
              .then((response) => response.json())
              .then((data) => {
                setUserData(data);
                setLoading(false);
              })
              .catch((error) => {
                setError(error);
                setLoading(false);
              });
    }, []);
    return <Component {...props} data={{ loading, userData, error }} />;
  };
};

const UserData = withFetchUserData(({ data }) => {
  const { loading, userData, error } = data;
  if (loading) return <span>loading...</span>;
  if (error) return <span>error</span>;
  return (
          <div>
            User Msg
            <p>userName:{userData?.name}</p>
            <p>userAge:{userData?.age}</p>
          </div>
  );
}, 1);

const App = () => <UserData />;
export default App;
```
```jsx [自定义Hook]
import { useEffect, useState } from 'react';

const useFetchUserData = (userId) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    fetch(`http://example.api.com/getUser?id=${userId}`)
            .then((response) => response.json())
            .then((data) => {
              setUserData(data);
              setLoading(false);
            })
            .catch((error) => {
              setError(error);
              setLoading(false);
            });
  }, []);

  return { loading, userData, error };
};

const UserData = () => {
  const { loading, userData, error } = useFetchUserData(1);
  if (loading) return <span>loading...</span>;
  if (error) return <span>error</span>;
  return (
          <div>
            User Msg
            <p>userName:{userData?.name}</p>
            <p>userAge:{userData?.age}</p>
          </div>
  );
};

const App = () => <UserData />;
export default App;


```
:::
