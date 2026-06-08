# Vue原理

## 虚拟DOM

虚拟DOM就是 `用JS对象来模拟 DOM 结构`

vue模板代码：
```vue
<template>
    <div id="app" class="container">
        <h1>fanlaBoy</h1>
    </div>
</template>

```
转为虚拟DOM后：
```js
{
  tag:'div',
  props:{ id:'app', class:'container' },
  children: [
    { tag: 'h1', children:'fanlaBoy' }
  ]
}

```
:::info 模板编译原理

解析阶段：使用大量的正则表达式对template字符串进行解析，将标签、指令、属性等转化为抽象语法树AST。

优化阶段：遍历AST，找到其中的一些静态节点并进行标记，方便在页面重渲染的时候进行diff比较时，直接跳过这一些静态节点，优化runtime的性能。

生成阶段：将最终的AST转化为render函数字符串。
:::

## Diff算法

### Vue2

- Diff算法基于**深度优先**，只在**同层级的节点**间进行比较，避免跨层级的操作，这样可以将时间复杂度从O(n^3)降低到O(n)。
- 进入`patch`过程：

  先判断是否是首次渲染，如果是首次渲染那么我们就直接**createElm**即可；

  如果不是首次渲染就去判断新老两个节点否为同一节点，即**标签名和key是否相同**（`sameVNode`过程）。如果不为相同节点，则删除旧节点并创建新节点进行替换；如果为相同节点，则进行子节点以及文本的比较和处理（`patchVNode`过程）。

- 在`patchVNode`过程中:
  
  如果Vnode和oldVnode指向同一个对象，则直接return即可；

  将旧节点的真实 DOM 赋值到新节点（真实 dom 连线到新子节点）称为elm，然后遍历调用 update 更新 oldVnode 上的所有属性，比如 class,style,attrs,domProps,events...；

  如果新老节点都有文本节点，并且文本不相同，那么就用vnode.text更新文本内容。

  如果oldVnode有子节点而Vnode没有，则直接删除老节点即可；

  如果oldVnode没有子节点而Vnode有，则将Vnode的子节点真实化之后添加到DOM中即可。

  如果两者都有子节点，则执行updateChildren函数比较子节点。

- 当两个节点都有子节点时，会进入`updateChildren`过程，这是Diff算法的核心部分。该算法通过“双端比较”的方式，从新旧子节点列表的两端开始，同时向中间遍历，寻找可以复用的节点:
  :::info 双端比较
  1. 对比头头、尾尾、头尾、尾头是否可以复用（**可以快速检测出 reverse 操作，加快 Diff 效率**），即是否为同一节点
  2. 如果可以复用，就进行节点的更新或移动操作，并更新对应的新旧节点的头/尾部指针。
  3. 如果经过四个端点比较后都没有可复用的节点，则将新节点的子节点集合的头部节点去旧子节点集合查找，如果找到可复用的节点，则将相应的节点进行更新（patchNode），并将新集合中该节点移动到头部，然后新节点头部指针右移。如果找不到，则说明这个头部节点是新增节点，只需要将其挂载到头部即可。
  4. 然后不断重复1，2，3步骤，直到新节点头部指针已无法再右移，即已不存在待比较更新的节点。此时若待比较更新的旧节点集合中还存在节点，则批量删除。
  :::

  :::warning 关于key
  在不使用 key 或者列表的 index 作为 key 的时候，每个元素对应的位置关系都是 index，如果后续涉及到元素顺序的变更导致位置关系的变更，假如同一个key，新旧集合的对应元素类型不同，Vue会将这些节点都不视为同一节点，这意味会重新创建渲染。如果元素类型相同，但是依然已经不是同一个元素/组件了，还容易发生元素/组件内部状态的混乱（例如元素类型相同的A组件的内部状态覆盖到B组件上了）。所以key有利于精确的找到相同节点从而提升性能。
  :::

假设新旧两个节点各自的子节点类型相同，且都设置了唯一key，则有如下示例：

示例1： 
```js
//旧子节点集合
[a,b,c,d,e]
        
        
// 新子节点集合
[b,c,a,e,d]
```
:::info 解析  

- 通过四个端点比较（a-b,e-d,a-d,e-b）后，发现不存在可复用的节点。此时取新集合中的头部节点b，发现在旧节点中存在，则更新b节点（patchNode过程）并将b节点作为最终diff结果的第1个节点。并将新集合头部指针右移。
- 此时待比较更新的旧集合为`[a,c,d,e]`，新集合为`[c,a,e,d]`,当前的diff结果为[b]。接着继续进行双端比较。
- 通过四个端点比较（a-c,e-d,a-d,e-c）后，发现不存在可复用的节点。此时取新集合中的头部节点c，发现在旧节点中存在，则更新c节点（patchNode过程）,将c节点作为最终diff结果的第2个节点。并将新集合头部指针右移。
- 此时待比较更新的旧集合为`[a,d,e]`，新集合为`[a,e,d]`,当前的diff结果为[b,c]，接着继续进行双端比较.
- 通过四个端点比较（a-a,e-d,a-d,e-a）后，发现存在可复用的节点a，则更新a节点（patchNode过程）,将a节点作为最终diff结果的第3个节点。并将新集合头部指针右移。
- 此时待比较更新的旧集合为`[d,e]`，新集合为`[e,d]`,当前的diff结果为[b,c,a]，接着继续进行双端比较.
- 通过四个端点比较（d-e,e-d,d-d,e-e）后，发现存在可复用的节点d和e，则更新d,e节点（patchNode过程）,并按新集合中的顺序将e,d节点作为最终diff结果的第4,5个节点。
- 此时待比较更新的旧集合为`[]`，新集合为`[]`,当前的diff结果为[b,c,a,e,d]。当前子节点结合diff比较完毕.
:::

示例2：

```js
//旧子节点集合
[a,b,c,d,e]
        
        
// 新子节点集合
[a,c,e,f]
```

:::info 解析

- 通过四个端点比较（a-a,e-f,a-f,e-a）后，发现存在可复用的节点a，则更新a节点（patchNode过程）并将a节点作为最终diff结果的第1个节点。并将新集合头部指针右移。
- 此时待比较更新的旧集合为`[b,c,d,e]`，新集合为`[c,e,f]`,当前的diff结果为[a]。接着继续进行双端比较。
- 通过四个端点比较（b-c,e-f,b-f,e-a）后，发现不存在可复用的节点。此时取新集合中的头部节点c，发现在旧节点中存在，则更新c节点（patchNode过程）并将c节点作为最终diff结果的第2个节点。并将新集合头部指针右移。
- 此时待比较更新的旧集合为`[b,d,e]`，新集合为`[e,f]`,当前的diff结果为[a,c]。接着继续进行双端比较。
- 通过四个端点比较（b-e,e-f,b-f,e-e）后，发现存在可复用的节点e。则更新e节点（patchNode过程）并将e节点作为最终diff结果的第3个节点。并将新集合头部指针右移。
- 此时待比较更新的旧集合为`[b,d]`，新集合为`[f]`,当前的diff结果为[a,c,e]。接着继续进行双端比较。
- 通过四个端点比较（b-f,d-f,b-f,d-f）后，发现不存在可复用的节点。此时取新集合中的头部节点f，发现在旧节点中不存在，说明为新增节点并将f节点作为最终diff结果的第4个节点。
- 此时待比较更新的旧集合为`[b,d]`，新集合为`[]`,当前的diff结果为[a,c,e,f]。待比较更新的新集合为空，批量删除待比较更新的旧集合的剩余元素，diff比较完毕。
:::
### Vue3

Vue3的Diff算法优化了双端对比方式，大致过程为：

- 循环进行头和头比，将相同节点保持不变，直到发现不同节点则停止循环
- 循环尾和尾比，将相同节点保持不变，直到发现不同节点则停止循环
- 通过以上两个循环后，发现新的节点序列比老的节点序列多；遇到这种情况，我们就直接循环把多余的新增节点全部挂载到相应的位置即可。需要注意是向前挂载，还是向后挂在。这里我们是用当前e2的值加1去判断，如果e2+1>e2，那么就向后插入，反之则向前插入
  ![vue_principle_1](/vue_principle_1.png)  
- 通过以上两个循环后，如果发现老的节点序列比新的节点序列多；那么我们直接循环卸载多余的旧序列节点即可
  ![vue_principle_2](/vue_principle_2.png)
- 基于**最长递增子序列**进行移动/添加/删除，最大程度降低了 DOM 操作。


假设新旧两个节点各自的子节点类型相同，且都设置了唯一key，则有如下示例：

示例1：
```js
//旧子节点集合
[a,b,c,d,e]
        
        
// 新子节点集合
[b,c,a,e,d]
```
:::info 解析
- 先进行头和头比，发现不同就结束循环，得到 [  ]
- 再进行尾和尾比，发现不同就结束循环，得到 [  ]
- 再获取新集合中没有比较过的节点 [ b,c,a,e,d]，并拿到对应节点在旧集合里对应的下标，生成数组 [1,2,0,4,3]，-1表示旧集合没有则说明是新增
- 然后再拿取出数组里的最长递增子序列，也就是 [ 0,4] 对应的节点 [ a, e ]，保持不动
- 最终然后只需要把其他剩余的节点即[b,c,d]和[b,c,d]，基于Vu2的diff策略和上述保持不动节点的位置进行a,d,e节点的移动即可
:::


示例2：
```js
//旧子节点集合
[a,b,c,d,e]
        
        
// 新子节点集合
[a,c,e,f]
```

:::info 解析
- 先进行头和头比，发现不同就结束循环，得到 [ a ],保持不动
- 再进行尾和尾比，发现不同就结束循环，得到 [  ]
- 再获取新集合中没有比较过的节点 [ c,e,f]，并拿到对应节点在旧集合里对应的下标，生成数组 [ 2, 4, -1 ]，-1表示旧集合没有则说明是新增
- 然后再拿取出数组里的最长递增子序列，也就是 [ 2,4] 对应的节点 [ c, e ]
- 最终然后只需要把其他剩余的节点即[b,d]和[f]，基于Vu2的diff策略和上述保持不动节点的位置进行添加和删除即可


:::

此外，Vue3的Diff算法还新增了：

- **静态提升**：将不参与更新的元素保存起来，只创建一次，之后在每次渲染的时候不停地复用。而Vue2中是永远都会重新创建渲染。所以Vue2 是全量 Diff，Vue3 是静态标记 + 非全量 Dif
- **事件缓存**
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

:::warning 为什么vue3使用了proxy
- proxy可以拦截更多操作（包括删除，枚举，函数调用等），而Object.defineProperty只能拦截对象属性的读取和设置
- Vue 2.x 中，对数组的变更需要借助一些特殊的方法（如 $set）来实现响应式。而在 Vue 3.0 中，由于 Proxy 的支持，数组的 push、pop、splice 等原生方法也能够被自动捕获并触发响应式更新，无需额外的处理。对数组的变更。
- Object.defineProperty 需要对每个属性进行遍历和定义 getter/setter，对于大型对象或频繁修改的对象，这种方式的性能开销较大。而 Proxy 的拦截操作是在底层实现的，能够减少不必要的遍历和定义，从而提高性能。
- 由于proxy只能代理对象，基本类型值无法直接变成响应式，所以vue3 ref通过封装成对象来通过`.value`访问其值。
:::
## 双向数据绑定原理
Vue.js 是基于 MVVM 模式设计的：
- **Model**：表示数据模型，是应用程序中用于处理数据和逻辑的组件。
- **View**：视图，是用户界面，负责数据的显示。
- **ViewModel**：视图模型，是 Vue.js 的核心，它作为 Model 和 View 之间的桥梁，负责将 Model 的数据同步到 View 上显示出来，以及将 View 的修改同步回 Model。

Vue的双向数据绑定是**基于MVVM模式和上述的响应式系统原理设计**,一般是通过`v-model`指令来是实现的。

v-model 在内部是语法糖，背后具体表现为监听表单元素的 input 事件，并更新数据模型中对应的数据。同时，当数据模型中的数据被手动修改变时，表单元素视图也会同时反映最新数据。

### 组件的v-model

:::info 原理
组件上面的v-model编译后会生成`modelValue`属性和`@update:modelValue`事件。

在组件上面使用v-model，需要子组件中定义一个名为modelValue的props来接收父组件使用v-model绑定的变量，然后使用这个modelValue绑定到子组件的指定表单元素中。

子组件使用emit抛出`@update:modelValue`事件去更新v-model属性绑定的变量，该操作通常是在指定表单元素的原生input事件回调中去触发。
:::

自定义表单组件

```vue
<!--CustomInput.vue-->
<script setup>
  // 默认情况下，v-model 使用的 prop 是 'modelValue'
  // Vue 会自动处理 update:modelValue 事件
  const props = defineProps({
    modelValue: String
  });
</script>
<template>
  <div>
    <input
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            type="text"
            placeholder="Edit me"
    />
  </div>
</template>


```

使用示例:

```vue
<script setup>
import CustomInput from './CustomInput.vue';
import { ref } from 'vue';

const inputValue = ref();
</script>

<template>
    <div>
        <CustomInput v-model="inputValue" />
        <p>The value is: {{ inputValue }}</p>
    </div>
</template>

```

多个v-model:

:::code-group
```vue [表单组件]
<script setup>
// 默认情况下，v-model 使用的 prop 是 'modelValue'
// Vue 会自动处理 update:modelValue 事件
const props = defineProps({
    model1: String,
    model2: String
});
</script>
<template>
    <div>
        <input
            :value="model1"
            @input="$emit('update:model1', $event.target.value)"
            type="text"
            placeholder="Edit me"
        />
        <input
            :value="model2"
            @input="$emit('update:model2', $event.target.value)"
            type="text"
            placeholder="Edit me"
        />
    </div>
</template>

```


```vue [使用]
<script setup>
import CustomInput from './CustomInput.vue';
import { ref } from 'vue';

const inputValue1 = ref();
const inputValue2 = ref();
</script>

<template>
    <div>
        <CustomInput v-model:model1="inputValue1" v-model:model2="inputValue2" />
        <p>The value1 is: {{ inputValue1 }}</p>
        <p>The value2 is: {{ inputValue2 }}</p>
    </div>
</template>


```
:::




### 原生标签的v-model

:::info 原理
原生input上面使用v-model编译后不会生成modelValue属性，只会生成`onUpdate:modelValue`回调函数和`vModelText`自定义指令。（@update:modelValue事件其实等价于onUpdate:modelValue回调函数）。

在原生input上面使用v-model，是由编译后自动生成的vModelText自定义指令在mounted和beforeUpdate钩子函数中去将v-model绑定的变量值更新到原生input输入框的value属性，以保证v-model绑定的变量值和input输入框中的值始终一致。

vModelText自定义指令会在created钩子函数中去监听原生input标签的input或者change事件。在事件回调函数中去调用onUpdate:modelValue回调函数，然后在回调函数中去更新v-model绑定的变量。在原生input标签中，这些操作是由vue内部完成的。
:::


```vue
<template>
   <input v-model='localValue'/>
</template>

```
上述的代码就相当于如下代码：

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




