# Vue原理

## 响应式和双向绑定

### 响应式原理

响应式即数据驱动视图，我们修改数据，视图随之响应更新。

- Vue3基于发布-订阅模式（观察者模式）使用`Proxy`（vue2使用的是`Object.defineProperty`）来创建一个响应式代理对象，该对象可以拦截并处理对原始对象属性的读写、增删等操作。
- 当访问响应式对象的属性时，会触发Proxy的get陷阱，Vue3会在此刻收集依赖（如正在渲染的组件或计算属性），并将它们与属性关联起来。
- 当修改响应式对象的属性时，会触发Proxy的set陷阱，Vue3会通知所有依赖该属性的组件或计算属性进行更新。
- Vue3在拦截到属性的变化后，通常会使用`Reflect`来执行相应的默认操作（如属性的读取、设置等），以确保代码的健壮性和可维护性。

:::code-group
```ts [vue3]
        // Dep类负责依赖追踪和派发更新
class Dep {
    //定义一个当前正在处理的订阅者变量值
    static currentSubscriber = null;
    subscribers: Set<any>;
    constructor() {
        // 定义一个set集合用于管理订阅者，即
        this.subscribers = new Set();
    }
    depend() {
        // depend负责添加订阅者（如果当前订阅者有值则表示需要新增，否则不用处理）
        if (Dep.currentSubscriber) {
            this.subscribers.add(Dep.currentSubscriber);
        }
    }
    notify() {
        // 当响应式数据变化时，通知所有订阅者，重新执行各个订阅者的回调逻辑，使其访问到响应式数据最新值
        this.subscribers.forEach((subscriber) => subscriber());
    }
}

// 模拟Vue的watch API
// 第一次定义watcher时，会设置currentSubscriber值并会执行回调函数（函数内部可能会包含对响应式数据的访问），此时将回调函数作为观察者添加进集合里
// 后续当响应式数据被修改时，则会执行订阅者集合里的对应回调函数，访问到响应式数据的最新值
function watcher(callBack) {
    Dep.currentSubscriber = callBack;
    callBack();
    // 重置currentSubscriber值，避免访问响应式数据时重复添加订阅者
    Dep.currentSubscriber = null;
}

function reactive(target) {
    const dep = new Dep();
    const handlers = {
        get(target, key, receiver) {
            // 触发添加订阅者（如果currentSubscriber有值的话）
            dep.depend();
            // 以默认行为返回当前属性值
            // 如果当前属性值也为对象类型，递归地将对象属性也转换为响应式（深度响应式）
            const result = Reflect.get(target, key, receiver);
            if (typeof result === 'object' && result !== null) {
                return reactive(result);
            }
            return result;
        },
        set(target, key, newValue, receiver) {
            if (target[key] === newValue) return true;
            const res = Reflect.set(target, key, newValue, receiver);
            // 属性值变化，触发订阅者的回调重新执行
            dep.notify();
            return res;
        }
    };

    return new Proxy(target, handlers);
}

// 使用示例
const state = reactive({
    count: 1
});

let total = 0;

watcher(() => {
    total = state.count * 2;
});

console.log(total); // 输出：2
state.count = 2;
console.log(total); // 输出：4
state.count = 3;
console.log(total); // 输出：6

```
```js [vue2]
// Dep类负责依赖追踪和派发更新
class Dep {
    //定义一个当前正在处理的订阅者变量值
    static currentSubscriber = null;
    subscribers: Set<any>;
    constructor() {
        // 定义一个set集合用于管理订阅者，即
        this.subscribers = new Set();
    }
    depend() {
        // depend负责添加订阅者（如果当前订阅者有值则表示需要新增，否则不用处理）
        if (Dep.currentSubscriber) {
            this.subscribers.add(currentSubscriber);
        }
    }
    notify() {
        // 当响应式数据变化时，通知所有订阅者，重新执行各个订阅者的回调逻辑，使其访问到响应式数据最新值
        this.subscribers.forEach((subscriber) => subscriber());
    }
}



// 模拟Vue的watch API
// 第一次定义watcher时，会设置currentSubscriber值并会执行回调函数（函数内部可能会包含对响应式数据的访问），此时将回调函数作为观察者添加进集合里
// 后续当响应式数据被修改时，则会执行订阅者集合里的对应回调函数，访问到响应式数据的最新值
function watcher(callBack) {
    Dep.currentSubscriber = callBack;
    callBack();
    // 重置currentSubscriber值，避免访问响应式数据时重复添加订阅者
    Dep.currentSubscriber = null;
}

function reactive(obj) {
    if (!(obj === 'object' && obj !== null) || obj instanceof Array) {
        // 注意：这里简单处理了非对象和数组的情况，实际 Vue 2 会对数组进行特殊处理  
        return;
    }
    Object.keys(obj).forEach(key => {
        // 创建一个依赖收集器  
        const dep = new Dep();

        // 利用 Object.defineProperty 拦截属性的 get 和 set 操作  
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 当属性被访问时，收集依赖  
                 dep.depend();
                return val;
            },
            set(newVal) {
                if (newVal === val) return;
                val = newVal;
                // 当属性值变化时，通知所有订阅者  
                dep.notify();
                // 递归地将新值也转换为响应式（深度响应式）  
                observe(newVal);
            }
        });
    });
}



```

### 双向数据绑定原理


:::
