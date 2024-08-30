# Vue零碎

## ref vs reactive

### ref

- 接收一个类型为**基本类型，引用类型或DOM Ref引用**的参数，返回一个响应式的Ref对象。此Ref对象只包含一个指向其内部值的value属性
- 若Ref传入值为基本类型，则.value指向传入值值本身。若为非基本类型，则.value指向的值为传入值通过reactive转换成的响应式Proxy对象。
- 若传入值为一个对象且在顶层解构使用该ref，其属性值会失去响应性。所以必须通过例如**ref.value.xx**等方式来获取或者设置属性最新值
- 在template中使用时若最终渲染值类型为Ref对象，则会自动解包（无需调用.value）
- 若传入一个对象，watch默认对ref做浅层监听（可通过设置deep:true开启深层监听），这意味着对象内部属性被修改后默认不会触发watch回调

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
const person = ref({ name: 'scw' });
const { name } = person.value;

watch(person, () => {
    // 不会触发
    console.log('watch监听到person变化');
});
</script>

<template>
    <!-- 这里如果使用解构的name会永远是第一次的值，需要使用person.name -->
    <span @click="() => (person.name = 'scw1')">{{ person.name }}</span>
</template>

```

### reactive

- 接收一个类型为**对象，数组，Map，Set**之一的参数，返回一个对应传入对象的响应式的Proxy对象
- 返回的proxy对象与传入对象是不对等的，传入对象被修改，proxy对象也会同步更新，反之也一样。
- reactive会递归地将对象的所有属性都转换为响应式数据
- 若reactive返回值在顶层解构使用，其属性值会失去响应性。所以必须通过例如**obj.xx**等方式来获取或设置最新值
- watch默认对reactive做深层监听，这意味着对象内部属性被修改后默认会触发watch回调

```vue
<script setup lang="ts">
import { reactive, watch } from 'vue';
const person = reactive({ name: 'scw' });
const { name } = person;

watch(person, () => {
    // 会触发
    console.log('watch监听到person变化');
});
</script>

<template>
    <!-- 这里如果使用解构的name会永远是第一次的值，需要使用person.name -->
    <span @click="() => (person.name = 'scw1')">{{ person.name }}</span>
</template>

```


## KeepAlive

`KeepAlive`为vue的全局内置组件，其本身不会渲染出来，也不会出现在父组件链中。包裹动态组件时，会缓存不活动的组件，而不是销毁它们。


```vue
<KeepAlive :include="[name1,name2]" :exclude="[name3,name4]" :max="5"> 
    <Component :is="currentComponent"></Component> 
</KeepAlive>

```
> 注意：KeepAlive标签内的子元素标签存在多个时，只会处理`第一个子元素`

组件参数：

- include：可传字符串/正则表达式/数组，名称（即组件的`name`字段）匹配成功的组件会被缓存
- exclude：可传字符串/正则表达式/数组，名称（即组件的`name`字段）匹配成功的组件不会被缓存
- max：可传数字，限制缓存组件的最大数量，超过max则按照`LRU算法`进行置换



:::info LRU算法

1. 当组件被keep-alive包裹时，如果组件的name（组件名称属性）满足include（包含）和exclude（不包含）条件，并且缓存数量未达到max（缓存组件的最大数量）限制，则该组件的实例会被缓存起来。
2. 缓存的组件实例会按照被访问的顺序存储在内部的一个数据结构中（包含由组件ID和Tag生成的缓存Key和对应虚拟DOM数据），这个数据结构通常结合了哈希表和双向链表的特点，以便快速访问和更新缓存项的顺序。
3. 当缓存中的组件被访问时，keep-alive会更新该组件在内部数据结构中的位置，将其移动到链表的头部（表示最近被访问）。
4. 如果组件在缓存中已存在，但位置不是头部，keep-alive会将其移动到头部，以反映其最近被访问的状态。
5. 当缓存数量达到max限制，并且又有新的组件需要被缓存时，keep-alive会移除链表尾部的组件（表示最久未使用），并将新组件添加到链表的头部。移除的组件实例会被销毁，以释放内存空间。
:::

```js
// src/core/components/keep-alive.js

export default {
  name: 'keep-alive',
  abstract: true, // 判断此组件是否需要在渲染成真实DOM
  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },
  created() {
    this.cache = Object.create(null) // 创建对象来存储  缓存虚拟dom
    this.keys = [] // 创建数组来存储  缓存key
  },
  mounted() {
    // 实时监听include、exclude的变动
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
  destroyed() {
    for (const key in this.cache) { // 删除所有的缓存
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },
  render() {
    //     
  }
}

```

:::warning 注意
- KeepAlive只对`组件`有效，对虚拟DOM片段/普通html标签无效
- KeepAlive 先匹配被包含组件的 name 字段，如果 name 不可用，则匹配当前组件 components 配置中的注册名称。
- keepAlive `不会在函数式组件`中正常工作，因为它们没有缓存实例。
- 当匹配条件同时在 include 与 exclude 存在时，以 exclude 优先级最高。
- 包含在 KeepAlive但符合exclude的组件，不会调用`activated`和 `deactivated`。
:::


被KeepAlive包裹的的组件可在自身组件的内部通过`activated`和`deactivated`两个生命周期来监听是否被渲染：

```vue
<!--某个被缓存的组件-->
<script setup lang="ts">
  import { onActivated, onDeactivated } from 'vue';

  onActivated(() => {
    //被渲染
  });

  onDeactivated(() => {
    //被缓存而隐藏
  });
</script>
```

经典应用场景：**实现特定缓存路由**

:::code-group
```js [路由配置]
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      //路由定义时配置需要被缓存的路由
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
  ]
})


```
```vue [Hoem.vue]
<!--Home.vue-->
<script>
export default {
  name: "Home",
  beforeRouteLeave(to, from, next) {
    //可在路由页面即将渲染前更新修改缓存标识   
    to.meta.keepAlive = false;
    next();
  },
};
</script>
```
```vue [App.vue]
<template>
  <div id="app">
    <!--需要被缓存的路由页面放进KeepAlive中-->
    <KeepAlive>
      <RouterView v-if="$route.meta.keepAlive"></RouterView>
    </KeepAlive>
    <RouterView v-if="!$route.meta.keepAlive"></RouterView>
  </div>
</template>

```
:::

## 生命周期

- `onBeforeMount`：组件被挂载之前被调用。此时还没有创建 DOM 节点，即将进行首次渲染
- `onMounted`：组件挂载完成后执行，主要用于访问DOM相关。此时所有**同步**子组件都已经被挂载,自身的 DOM 树已经创建完成并插入了父容器中。
- `onBeforeUpdate`：在组件即将因为响应式状态变更而更新其 DOM 树之前调用。
- `onUpdated`：在组件因为响应式状态变更而更新其 DOM 树之后调用。
- `onBeforeUnmount`：在组件实例被卸载之前调用。此时组件实例依然还保有全部的功能。
- `onUnmounted`：组件实例被卸载之后调用。可用于清理一些副作用，例如计时器、DOM 事件监听器或者与服务器的连接。
- `onErrorCaptured`：捕获了后代组件传递的错误时调用
- `onActivated`：若组件实例是KeepAlive缓存树的一部分，当组件被插入到 DOM 中时调用。
- `onDeactivated`：若组件实例是KeepAlive缓存树的一部分，当组件从 DOM 中被移除时调用。

:::warning
- 不要在 `onUpdated` 钩子中更改组件的状态，这可能会导致无限的更新循环
- Vue3中的setup函数替代了Vue2中的`beforeCreate`和`created`生命周期钩子，所有的初始化逻辑都可以在setup函数中编写。
- Vue3中的`onBeforeUnmount/onUnmounted`相当于Vue2中的`beforeDestroy`和`destroyed`生命周期钩子。

:::

## setup

### setup函数

这个函数在组件的beforeCreate和created生命周期钩子之前被调用（此时无法使用this来访问组件实例），用于设置组件的响应式状态、计算属性、方法等。它返回一个对象，该对象中的属性和方法可以在组件的模板中直接使用。

:::tip setup函数解决了什么问题：

在Vue 2.x版本中，组件的逻辑通常使用data、methods、computed、watch等选项来组织和实现。但在大型或复杂的组件中，随着逻辑的增多，这种方式可能会导致代码变得难以管理和维护。Vue 3的setup方法和Composition API的引入，允许开发者以更具响应性和函数式的方式来组织和复用Vue组件中的代码，特别是在处理复杂逻辑或跨组件共享逻辑时非常有用。

setup允许开发者将组件逻辑抽离到可复用的组合函数中，而不是混在选项中，这大大提高了代码的复用性和可维护性。

:::

```vue
<template>  
  <div>  
    <h1>{{ count }}</h1>  
    <button @click="increment">Increment</button>  
  </div>  
</template>  
  
<script>  
import { ref } from 'vue';  
  
export default {  
  name: 'CounterWithSetup',  
  setup() {  
    const count = ref(0);  
  
    function increment() {  
      count.value++;  
    }  
  
    // 必须显式返回对象，以便在模板中使用  
    return {  
      count,  
      increment  
    };  
  }  
};  
</script>
```


### script setup
`script setup`是Vue 3.2+版本中引入的一种新的语法糖，它允许在script标签内直接加上setup属性，从而省略了传统的export default语法。

在script setup中，你可以直接编写响应式状态的声明、方法的定义等，而无需显式地返回一个对象。Vue会自动处理这些声明，使它们可以在模板中直接使用。

```vue
<template>  
  <div>  
    <h1>{{ count }}</h1>  
    <button @click="increment">Increment</button>  
  </div>  
</template>  
  
<script setup>  
import { ref } from 'vue';  
  
// 直接在顶层声明响应式引用和方法  
const count = ref(0);  
  
function increment() {  
  count.value++;  
}  
  
// 无需显式返回，Vue会自动处理  
</script>
```

## 组件name

### 设置name

可通过以下方法设置组件name：

- **自动生成**

script setup只要在script开启setup语法糖模式，单文件组件会自动根据文件名生成对应的 name 选项 

- **额外开启一个script用来定义name**

这种方式会显得不优雅和令人疑惑：

```vue

<!--这个script只用来定义name-->
<script lang='ts'>
  export default {
    name:"XXX"
  }
</script>


<!--这个script用于编写业务逻辑-->
<script lang="ts" setup>
import {ref,reactive } from 'vue'
</script>


<style lang="less" scoped>

</style>

```

- **使用第三方插件**

如unplugin-vue-define-options，具体配置方法自行查询。


### 使用name

组合的name属性主要有以下应用场景：

- **递归组件**

```vue
<template>
 <div>
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="item-title border-bottom">
        <span class="item-title-icon"></span>
        {{ item.title }}
        <!-- 当数据中有children属性时，说明他是一个多级菜单，对组件本身进行循环递归 -->
        <div v-if="item.children" class="item-children">
          <DetailList :list="item.children"></DetailList>  // [!code error]
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailList', // [!code error]
  props: {
    list: Array
  }
}
</script>
```

- **配合KeepAlive**

配合KeepAlive组件的include 或 excludes属性可以缓存指定组件

- **代码调试**

在Vue有报错或者调试（如vue-devtools）的时候可以看到组件的name

## 修饰符

#### 事件修饰符

- @click.prevent：阻止默认行为
- @click.stop：阻止冒泡
- @click.self：只触发当前元素自身的事件
- @click.once：只触发一次
- @keydown.enter/delete/tab：按键相关
- @click.left/right：鼠标相关
- .....

#### v-model修饰符

- v-model.trim:对表单值进行两端的空格去除并存储
- v-model.lazy:只有当input失去焦点时，才执行数据双向同步
- v-model.number:对表单值进行number转换并存储

## 组件通信方式

- props
- emit自定义事件（子组件调用父组件方法并传递参数）
- useAttrs（获取除props定义以外的传递的方法和属性）
- provide/inject（跨多层组件通信）
- ref配合defineExpose（父组件获取子组件方法/状态）
- slot中的作用域插槽
- 第三方状态管理工具（vuex，pina等）
- 全局事件总线（非Vue标准api，只是一种解决方案思想）
  :::code-group
    ```ts [入口文件]
    // main.js 或 main.ts  
    import { createApp } from 'vue'  
    import App from './App.vue'  
    
    // 创建一个空的Vue实例作为全局事件总线  
    const EventBus = new Vue();  
    
    // 将EventBus添加到Vue的原型上，以便在组件中通过this.$eventBus访问  
    const app = createApp(App);  
    app.config.globalProperties.$eventBus = EventBus;  
    
    app.mount('#app');
    ```
    ```vue [组件A]
    <template>  
      <button @click="sendMessage">Send Message</button>  
    </template>  
    
    <script>  
    export default {  
      methods: {  
        sendMessage() {  
          // 使用全局事件总线触发事件  
          this.$eventBus.$emit('message-sent', 'Hello from Component A!');  
        }  
      }  
    }  
    </script>
    ```
    ```vue [组件B]
    <template>  
      <div>Message: {{ message }}</div>  
    </template>  
    
    <script>  
    export default {  
      data() {  
        return {  
          message: ''  
        };  
      },  
      created() {  
        // 组件创建时监听事件  
        this.$eventBus.$on('message-sent', (msg) => {  
          this.message = msg;  
        });  
      },  
      beforeUnmount() {  
        // 组件销毁前移除监听器，防止内存泄漏  
        this.$eventBus.$off('message-sent');  
      }  
    }  
    </script>
    ```
    :::

## toRef & toRefs

**toRef**

传入一个响应式reactive对象和该对象的一个属性Key，将**该属性转为ref对象**并返回该属性

```vue
<script setup lang="ts">
import { reactive, toRef, toRefs } from 'vue';

const obj = reactive({ name: 'scw' });
// 以下写法，name属性不具备响应式
// const name = obj.name;

// toRef将属性值转成ref对象可使属性具有响应式
// 若属性key不存在,则toRef返回值为undefined
const name = toRef(obj, 'name');
</script>
<template>
    <div @click="obj.name = 'scw1'">name：{{ name }}</div>
</template>

```

**toRefs**

传入一个响应式reactive对象，将该对象的**每个属性转为ref对象**并返回一个新的对象

```vue
<script setup lang="ts">
  import { reactive, toRefs } from 'vue';

  const obj = reactive({ name: 'scw' });
  // 解构方式下，name属性不具备响应式
  // const { name } = obj;

  // toRefs可使属性具有响应式
  const { name } = toRefs(obj);
</script>
<template>
  <div @click="obj.name = 'scw1'">name：{{ name }}</div>
</template>


```
:::tip 技巧
- 可对`defineProps`的返回值进行toRefs包裹,然后解构使用
:::

## v-model实现

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

## 其他

- `h函数`（**createElementVNode** API的别名）用于创建vnode节点，通常在函数式组件、渲染函数中使用。

    :::code-group 
    ```vue [基本用法]
    <script setup lang="ts">
    import { h } from 'vue';
    
    const MyDiv = h('div', {class:'xxx',style:{color:'red'}}, [h('h1', null, '第一个子节点')]);
    </script>
    
    <template>
        <MyDiv />
    </template>
    ```
    ```vue [函数式组件]
    <script setup lang="ts">
      import { h, createApp } from 'vue';
      // 定义一个函数式组件，使用h函数来渲染内容
      const MyComponent = (props, { slots }) => {
        return h('div', null, [
          h('h1', null, 'Hello Vue 3'),
          h(
              'p',
              null,
              `This is a functional component using the h function. Props: ${props.message}`
          ),
          slots.default ? slots.default() : null // 使用插槽
        ]);
      };
    </script>
    
    <template>
      <MyComponent message="Hello Vue 3">
        <div>我是Slot</div>
      </MyComponent>
    </template>
    
    
    ```
    ```vue [渲染函数]
    <script setup lang="ts">
      import { h, createApp, defineComponent } from 'vue';
      // 通过模板语法和来定义一个组件
      const MyComponent = defineComponent({
        setup(props, { slots }) {
          //渲染函数
          return () =>
              h('div', null, [
                h('h1', null, 'Hello Vue 3'),
                h(
                    'p',
                    null,
                    `This is a functional component using the h function. Props: ${props.message}`
                ),
                slots.default ? slots.default() : null // 使用插槽
              ]);
        }
      });
    </script>
    
    <template>
      <MyComponent message="Hello Vue 3">
        <div>我是Slot</div>
      </MyComponent>
    </template>
    
    ```
    :::
- `useAttrs()`用于获取当前组件props声明以外的父组件传递的属性（在template中亦可通过`$attrs`获取），与props是互补关系。此外attrs无法通过watch等方式监听变化。

-  `<style scoped>`中的样式默认只对当前组件内标签元素生效，对于**内部的子组件则不生效**。否则请使用`:deep`进行深度作用。另外当前组件里通过**v-html**渲染的内容也默认不会被sccoped样式应用
- `Vue.createApp()`允许你在同一个页面中创建**多个**共存的 Vue 应用，而且每个应用都拥有自己的用于配置和全局资源的作用域。
- `app.mount()`的返回值是`根组件实例`，而非应用实例。
- `nextTick()` 可以在状态改变后立即使用，以等待 DOM 更新完成。
  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM 还未更新
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM 此时已经更新
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```
- `v-once` 表示只渲染一次，后续哪怕data有更新也不更新渲染（虽然data已变化）
- Vue2组件中普通函数声明的this指向的是当前`组件实例`（箭头函数则指向window），在Vue3的setup方法里**无法使用this**，因为setup() 函数在组件实例被创建之前被调用，此时this还未指向组件实例（此时为undefined），而script setup中的代码是在组件的 setup() 函数的作用域内执行的，同样无法使用this。
- v-if与v-for不能同时使用在同一个标签上，因为v-if的优先级更高，这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名。可采用以下方式:
  ```vue
  <template v-for="(item, index) in list">
    <div :key="item.id" v-if="item.age > 18">
      <span>age>18</span>
    </div>
  </template> 
  ```
- 事件绑定函数默认传递第一个参数为event，若要额外手动传递其他参数，则要获取到event参数则需要手动传递  

  ```vue
  <script setup lang="ts">
  //默认参数
  const handleSpanClick = (event) => {
      console.log('event', event);
  };
  
  // 带额外参数
  const handleDivClick = (event, params) => {
      console.log('event', event);
    console.log('params', params); //scw
  };
  </script>
  <template>
      <span @click="handleSpanClick"></span>
      <div @click="handleDivClick($event, 'scw')"></div>
  </template>

  ```
-`app.component`定义的是全局组件，处处可以使用,不用仍占内存空间. 在Vue2中通过`compoent:{xxx: xxx}`引入并注册的组件是局部组件，只有在注册时才能使用.
- 默认情况下,非props中接收的属性会被自动接收并添加到组件的根元素节点属性上,可通过设置`inheritAttrs: false`来关闭这一行为
  ```vue
  <script setup lang="ts">
  
  defineOptions({
      inheritAttrs: false
  });
  </script>
  ```