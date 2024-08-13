# Vue原理

## 响应式和双向绑定

### 响应式原理

响应式即数据驱动视图，我们修改数据，视图随之响应更新。

- Vue3基于发布-订阅模式（观察者模式）使用`Proxy`（vue2使用的是`Object.defineProperty`）来创建一个响应式代理对象，该对象可以拦截并处理对原始对象属性的读写、增删等操作。
- 当访问响应式对象的属性时，会触发Proxy的get陷阱，Vue3会在此刻收集依赖（如正在渲染的组件或计算属性），并将它们与属性关联起来。
- 当修改响应式对象的属性时，会触发Proxy的set陷阱，Vue3会通知所有依赖该属性的组件或计算属性进行更新。
- Vue3在拦截到属性的变化后，通常会使用`Reflect`来执行相应的默认操作（如属性的读取、设置等），以确保代码的健壮性和可维护性。

:::code-group
```js [vue3]
class Dep {
    constructor() {
        this.subscribers = new Set();
    }

    depend() {
        // 在实际 Vue 中，这里会处理依赖收集  
        // 但为了简化，我们仅记录依赖（虽然不实际使用）  
        console.log('A component is watching this property.');
    }

    notify() {
        // 当属性值变化时，通知所有订阅者  
        this.subscribers.forEach(sub => sub());
    }

    subscribe(watcher) {
        this.subscribers.add(watcher);
    }
}

function reactive(target) {
    if (typeof target !== 'object' || target === null) {
        return target;
    }

    const handler = {
        get(target, key, receiver) {
            const dep = new Dep();
            // 假设每次访问都触发依赖收集（实际中会更复杂）  
            dep.depend();

            // 递归地将对象属性也转换为响应式（深度响应式）  
            const result = Reflect.get(target, key, receiver);
            if (typeof result === 'object' && result !== null) {
                return reactive(result);
            }
            return result;
        },
        set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);
            // 这里应该有一个地方来存储每个属性的 Dep 实例  
            // 但为了简化，我们假设每次设置都触发全局通知  
            console.log(`Property ${key} changed to ${value}`);
            // 在实际中，你需要根据 key 来找到对应的 Dep 实例并调用 notify  
            // 但由于我们没有存储这些 Dep 实例，所以我们不调用 notify  
            return result;
        }
    };

    return new Proxy(target, handler);
}

// 使用示例  
const state = reactive({
    count: 0,
    nested: {
        value: 'Hello'
    }
});

// 访问属性会触发依赖收集（虽然在这个简化示例中没有实际作用）  
console.log(state.count); // 0  
console.log(state.nested.value); // Hello  

// 修改属性会触发通知（但在这个示例中，我们没有实现真正的通知机制）  
state.count = 1; // 控制台输出：Property count changed to 1  
state.nested.value = 'World'; // 控制台输出：Property value changed to World  

// 注意：这个示例没有实现真正的依赖收集和派发更新机制。  
// 在实际 Vue 3 中，每个属性都会有一个 Dep 实例来跟踪其依赖，  
// 当属性值变化时，Dep 实例会通知所有订阅了该属性的 watcher 执行更新。
```
```js [vue2]
function defineReactive(obj, key, val) {
    // 递归地将对象属性也转换为响应式  
    observe(val);

    // 创建一个依赖收集器  
    const dep = new Dep();

    // 利用 Object.defineProperty 拦截属性的 get 和 set 操作  
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            // 当属性被访问时，收集依赖  
            Dep.target && dep.depend();
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
}

function observe(value) {
    if (!isObject(value) || value instanceof Array) {
        // 注意：这里简单处理了非对象和数组的情况，实际 Vue 2 会对数组进行特殊处理  
        return;
    }
    Object.keys(value).forEach(key => {
        defineReactive(value, key, value[key]);
    });
}

function isObject(value) {
    // 简单的类型检查  
    return typeof value === 'object' && value !== null;
}

class Dep {
    constructor() {
        this.subscribers = new Set();
    }

    depend() {
        if (Dep.target) {
            this.subscribers.add(Dep.target);
        }
    }

    notify() {
        this.subscribers.forEach(sub => sub());
    }

    static target = null; // 用于存储当前正在依赖收集的 watcher  
}

// 示例用法  
const state = {
    count: 0
};

observe(state);

// 假设我们有一个 watcher 来模拟组件的依赖  
function watcher() {
    console.log(`Count is: ${state.count}`);
}

// 临时设置 Dep.target 为 watcher，模拟依赖收集  
Dep.target = watcher;
// 访问属性以触发依赖收集  
state.count;
Dep.target = null; // 重置 Dep.target  

// 修改属性值，触发更新  
state.count = 1; // 控制台输出：Count is: 1（但这里不会直接输出，因为 watcher 没有被持续监听）  

// 注意：由于这个示例没有持续监听机制，所以 watcher 只在依赖收集时执行了一次。  
// 在 Vue 2 中，watcher 会被存储在组件的实例中，并在数据变化时由 Vue 的内部机制重新触发。
```

### 双向数据绑定原理


:::
