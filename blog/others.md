# 其他

## WebStorage

特点：

- 相比[Cookie]，WebStorage可存储的`数据量更大`（5MB左右）。
- 相比[Cookie]，WebStorage同样保存在客户端，但`不与服务器进行交互通信，可节省流量`。
- WebStorage只能存储`字符串`类型数据。

`sessionStorage`：用于存储某个特定会话的数据，即同一标签栏下的同源页面。如果跳转到了非同源页面或新打开标签栏，则新页面不会存在原sessionStorage数据。

`localStorage`：对于同源页面（无论是否是同一标签栏）是共享公用的，并且只要你不去主动删除，它会永久保存在浏览器中。

:::warning 注意
- 当通过`window.open 或链接打开新页面时(不能是新窗口)`，新页面会复制前一页的`sessionStorage`，但并不共享。
- 设置WebStorage值时，会默认执行`toString()`操作，需要注意类型检测。
:::


## 性能优化

### CSS

- 减少CSS文件请求个数，控制在1-2个。2个CSS文件请求会比包含相同内容的1个CSS文件请求要传递的数据更多。此外线上的CSS文件中不要使用@import，因为这并不能减少Http请求次数
- 压缩和缓存CSS文件
- 减少重绘重排
- 降低 CSS 选择器的复杂性

### JS
- 避免浏览器渲染阻塞Js文件。如给script标签添加async或defer属性
- 使用事件委托减少事件监听数量
- 减少dom操作
- 尽量通过class而不是动态修改style来调整样式

### 资源

- 静态资源使用cdn ，减少服务器延迟
- 使用字体图标 iconfont或者svg 代替jpg/png图标
- 图片懒加载或者叫延迟加载（滚动到图片位置时再加载）
- 使用响应式图片
- 使用 webp 格式的图片减小图片体积

### React
- 使用hooks那些api
- 使用shuouldComponetUpdate和pureComponent
- 路由懒加载
- 使用React.fragment避免不必要的dom添加
- 尽量使用函数式组件
- 尽量保证稳定的dom结构，不要频繁增删dom
- 动态列表渲染使用key


# 其他

- 减少http请求次数
- 使用http2（解析快，多路复用，头部压缩）



[Cookie]:/advance/cookie-session#cookie
