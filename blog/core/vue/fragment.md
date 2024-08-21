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


## 其他

- `h函数`（`createElementVNode` API的别名）用于创建vnode节点，通常在函数式组件、渲染函数中使用。

    :::code-group 
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

