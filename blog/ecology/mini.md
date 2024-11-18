# 微信小程序

每个小程序页面都由`wxml，wxss,js,json(页面配置)`文件组成

## 生命周期

### 应用层面

应用生命周期是指小程序整体的生命周期，包括小程序的启动、显示、隐藏、错误处理等事件。这些事件主要通过`App()`函数中的钩子函数来处理。

- **onLaunch(options)**

    当小程序初始化完成时，会触发onLaunch。这是**全局只触发一次**的函数，可以在该函数中进行一些初始化操作，如获取用户信息、设置全局变量等。

- **onShow(options)**：

    小程序初始化完成或从后台进入前台显示时，会触发onShow。这个函数可以用来处理一些需要在小程序显示时执行的逻辑，如页面数据的刷新。

- **onHide()**

    当小程序从前台进入后台时，会触发onHide。可以在该函数中处理一些需要在小程序隐藏时执行的逻辑，如暂停音乐播放、停止定位等。

- **onError(error)** 

    当小程序发生脚本错误，或者API调用失败时，会触发onError并带上错误信息。可以在该函数中进行错误处理，如上报错误日志、给用户提示等。


### 页面层面

页面生命周期是指小程序中每个页面的生命周期，包括页面的加载、显示、隐藏、卸载等事件。这些事件主要通过`Page()`函数中的钩子函数来处理。

- **onLoad(options)**

   页面加载时触发,`一个页面只会调用一次（除非页面卸载后重新进入）`。可以在该函数中**设置页面初始状态，初始数据请求**等。options参数包含了页面跳转时传入的参数。
- **onShow()**

   页面显示时触发。每次打开页面都会触发该函数，可以在该函数中**进行页面数据的更新操作**。
- **onReady()**

  页面初次渲染完成时触发，`一个页面只会调用一次（除非页面卸载后重新进入）`。表示页面已经准备好，可以和视图层进行交互。可以进行**DOM操作，渲染完成后的初始化设置**等。
- **onHide()**

    页面隐藏时触发。当`navigateTo或底部tab切换`时会触发该函数，可以在该函数中进行一些页面隐藏时需要执行的操作，如清除定时器、暂停音视频播放等。
- **onUnload()**

    页面卸载时触发。当`redirectTo或navigateBack`时会触发该函数，可以在该函数中进行页面卸载前的清理工作，如清除定时器、释放资源等。

- **onPullDownRefresh()**

  用户下拉页面时触发。可以在该函数中处理下拉刷新的逻辑。

- **onReachBottom()**

  页面上拉触底时触发。可以在该函数中处理上拉加载的逻辑。

- **onShareAppMessage()**

    用户点击分享按钮或右上角菜单分享时触发。可以在该函数中返回自定义的分享信息。

- **onPageScroll()**

   页面滚动时触发。可以获取页面滚动的位置信息，实现一些滚动相关的效果。


![mini_hook_1.png](/mini_hook_1.png)

:::warning 注意

- 首次进入小程序会先触发应用生命周期中onLaunch方法和onShow方法，其次触发页面生命周期中onLoad、onShow和onReady方法。

- 前台切换到后台时，先触发页面生命周期中onHide方法，再触发应用生命周期的onHide方法。

- 后台切换到前台时，先触发应用生命周期中onShow方法，再触发页面生命周期的onShow方法。
:::
### 组件层面

- **created**

  组件实例刚刚被创建，此时还不能调用setData等方法，组件的节点树也未生成。

- **attached**

  组件实例进入页面节点树时执行。此时可以调用setData等方法，改变组件的数据。

- **ready**

  组件布局完成，此时可以获取组件的宽高等信息。

- **moved**

  组件在页面中的位置发生变化时执行。

- **detached**

  组件实例被从页面节点树移除时执行。


示例：

```js
Component({
  // 监听当前组件的生命周期
  lifetimes: {
    created() {
      console.log("created 组件被创建出来了");
    },
    ready() {
      console.log("ready 组件被附加到页面的节点树上了");
``    },
    attached() {
      console.log("attached 组件被显示出来了");
    },
    detached() {
      console.log("detached 组件从页面上被移除了");
    },
  },
  // 监听挂载到的页面对应的生命周期
  pageLifetimes: {
    hide() {
      console.log("页面被隐藏了");
    },
    show() {
      console.log("页面显示出来了");
    }
  }

});
```

![mini_hook_2.png](/mini_hook_2.png)

注意：

- 当页面中包含组件时，组件的生命周期(包括pageLifetimes)总是优先于页面，Behaviors生命周期优先于组件的生命周期。除了页面卸载时，`Page.onUnload` 会优先`Component.detached`触发

## setData
setData大致过程：
- 逻辑层虚拟 DOM 树的遍历和更新，触发组件生命周期和 observer 等；
- 将 data 从逻辑层传输到视图层；
- 视图层虚拟 DOM 树的更新、真实 DOM 元素的更新并触发页面渲染更新。

:::warning 注意
- data 应只包括渲染相关的数据
- 每次 setData 都会触发逻辑层虚拟 DOM 树的遍历和更新，也可能会导致触发一次完整的页面渲染流程。
- 组件的 setData 只会引起当前组件和子组件的更新
- 仅在需要进行页面内容更新时调用 setData；
- 对连续的 setData 调用尽可能的进行合并；
- 避免不必要的 setData；
- 避免以过高的频率持续调用 setData，例如毫秒级的倒计时；
- 避免在 onPageScroll 回调中每次都调用 setData。
- 避免在切后台后仍进行高频的 setData
- setData 应只传入发生变化的字段；
:::

## wxss 

组件对应 wxss 文件的样式，只对组件wxml内的节点生效。编写组件样式时，需要注意以下几点：

:::warning 注意
- 组件和引用组件的页面不能使用id选择器（#a）、属性选择器（[a]）和标签名选择器，请改用class选择器。
- 组件和引用组件的页面中使用后代选择器（.a .b）在一些极端情况下会有非预期的表现，如遇，请避免使用。
- 子元素选择器（.a>.b）只能用于 view 组件与其子节点之间，用于其他组件可能导致非预期的情况。
- 继承样式，如 font 、 color ，会从组件外继承到组件内。
- 除继承样式外， app.wxss 中的样式、组件所在页面的的样式对自定义组件无效（除非更改组件样式隔离选项）。
:::
默认情况下，**自定义组件的样式只受到自定义组件 wxss 的影响**。除非在当前组件js文件的options中指定特殊的样式隔离选项 `styleIsolation`：

:::info styleIsolation选项值
- **isolated**: 表示启用样式隔离，在自定义组件内外，使用 class 指定的样式将不会相互影响（一般情况下的默认值）；
- **apply-shared**: 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
- **shared**:表示页面 wxss 样式将影响到自定义组件，自定义组件 wxss 中指定的样式也会影响页面和其他设置了 apply-shared 或 shared 的自定义组件。（这个选项在插件中不可用。）
:::
## 页面跳转

- **wx.navigateTo()** : 保留当前页面，跳转到应用内的某个页面（类似web端的push）。但是不能跳到 tabbar 页面
- **wx.redirectTo()** :  关闭当前页面，跳转到应用内的某个页面（类似web端的replace）。但是不允许跳转到 tabbar 页面
- **wx.switchTab()** :  跳转到 TabBar 页面，并关闭其他所有非 tabBar 页面
- **wx.navigateBack()**: 关闭当前页面，返回上一页面或多级页面(类似web端的go(-n)）。可通过getCurrentPages() 获取当前的页面栈，决定需要返回几层
- **wx.reLaunch()**:  关闭所有页面，打开到应用的某个页面。

## 数据通信

- 通过`app.globalData`存储全局信息，所有页面均可访问和设置
- 跳转页面时通过在url后面拼接参数，并在目标url页面中的**onLoad**钩子获取参数
- 使用本地storage缓存

## 性能优化

### 启动性能

- 合理使用分包加载
- 避免非必要的全局自定义组件和插件
- 控制静态资源大小（减少图片等静态资源大小，尽可能使用CDN链接）
- 及时清理废弃的无用代码和资源

### 运行时性能

- 合理使用setData,见上方：[setData](#setdata)
- 非必要不监听页面或组件的 scroll 事件,会有性能开销
- 控制WXML 节点数量和层级
- 控制在 Page 构造时传入的自定义数据量
- 避免在 onHide/onUnload 执行耗时操作，如同步接口调用、setData 等
- 事件监听的及时解绑和定时器的及时清理

## Uniapp

- uniapp不支持vue中的`component`动态组件标签,只能使用条件渲染.
- uniapp不支持vue中的h函数,defineComponent等渲染方法
- uniapp如果遇到自定义单文件组件(非页面)文件中引用第三方组件并且需要覆盖第三方组件样式,除了需要在style中使用`:deep`,还需要配置`styleIsolation`:
```vue
<script setup lang="ts">
defineOptions({
  options: {
    styleIsolation: 'shared'
  }
});
</script>
```

## 其他

- 小程序中默认不支持cookie，可以通过第三方库`weapp-cookie`实现
- wxss中，`750rpx`表示屏幕宽度。
- 在事件回调中传递参数
  ```js
  <button bindtap="get"  data-name="测试"> 拿到传值</button>
  
  get(e){
      console.log(e.currentTarget.dataset.name)
  },
  
  ```
- 与Vue的双向数据绑定不同，小程序直接使用`this.data.key = value `是不能更新到视图当中的， 必须使用`this.setData({ key ： value })` 来更新值。这点与React有些类似。