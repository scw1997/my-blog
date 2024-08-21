# Vue原理


## 响应式原理

响应式即数据驱动视图，我们修改数据，视图随之响应更新。

- Vue3基于发布-订阅模式（观察者模式）使用`Proxy`（vue2使用的是`Object.defineProperty`）来创建一个响应式代理对象，该对象可以拦截并处理对原始对象属性的读写、增删等操作。
- 当访问响应式对象的属性时，会触发Proxy的get陷阱，Vue3会在此刻收集依赖（即添加订阅者），如正在渲染的组件或计算属性，并将它们与属性关联起来。
- 当修改响应式对象的属性时，会触发Proxy的set陷阱，Vue3会通知所有依赖该属性的组件或计算属性进行更新（即通知订阅者更新）。
- Vue3在拦截到属性的变化后，通常会使用`Reflect`来执行相应的默认操作（如属性的读取、设置等），以确保代码的健壮性和可维护性。

下面为响应式系统的简易模拟实现：
:::code-group
```ts [Vue3]
// Dep类负责依赖追踪和派发更新
class Dep {
    //定义一个当前正在处理的订阅者变量值
    static currentSubscriber = null;
    subscribers: Set<any>;
    constructor() {
        // 定义一个set集合用于管理订阅者
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
```js [Vue2]
// Dep类负责依赖追踪和派发更新
class Dep {
    //定义一个当前正在处理的订阅者变量值
    static currentSubscriber = null;
    subscribers: Set<any>;
    constructor() {
        // 定义一个set集合用于管理订阅者
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

function reactive(obj) {
    // 创建一个依赖收集器
    const dep = new Dep();
    Object.keys(obj).forEach((key) => {
        let value = obj[key];
        // 利用 Object.defineProperty 拦截属性的 get 和 set 操作
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 触发添加订阅者（如果currentSubscriber有值的话）
                dep.depend();
                // 如果当前属性值也为对象类型，递归地将对象属性也转换为响应式（深度响应式）
                if (typeof value === 'object' && value !== null) {
                    return reactive(value);
                }
                return value;
            },
            set(newVal) {
                if (newVal === value) return;
                // 更新当前属性值
                value = newVal;
                // 属性值变化，触发订阅者的回调重新执行
                dep.notify();
            }
        });
    });
    return obj;
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
:::

## 双向数据绑定原理
Vue.js 是基于 MVVM 模式设计的：
- **Model**：表示数据模型，是应用程序中用于处理数据和逻辑的组件。
- **View**：视图，是用户界面，负责数据的显示。
- **ViewModel**：视图模型，是 Vue.js 的核心，它作为 Model 和 View 之间的桥梁，负责将 Model 的数据同步到 View 上显示出来，以及将 View 的修改同步回 Model。

Vue的双向数据绑定是**基于MVVM模式和上述的响应式系统原理设计**,一般是通过`v-model`指令来是实现的。

v-model 在内部是语法糖，背后具体表现为监听表单元素的 input 事件，并更新数据模型中对应的数据。同时，当数据模型中的数据被手动修改变时，表单元素视图也会同时反映最新数据。

```vue
<template>
   <input v-model='localValue'/>
</template>

```
上述的组件就相当于如下代码：


```vue
<template>
   <!-- 这里添加了input时间的监听和value的属性绑定 -->
   <input @input='onInput' :value='localValue' />
   <span>{{localValue}}</span>
</template>
<script>
  export default{
    data(){
      return {
        localValue:'',
      }
    },
    methods:{
      onInput(v){
         //在input事件的处理函数中更新value的绑定值
         this.localValue=v.target.value;
         console.log(this.localValue)
      }
    }
  }
</script>

```