# 其他零碎

## WebStorage

特点：

- 相比[Cookie]，WebStorage可存储的`数据量更大`（5MB左右）。
- 相比[Cookie]，WebStorage同样保存在客户端，但`不与服务器进行交互通信，可节省流量`。
- WebStorag只能存储`字符串`类型数据。

`sessionStorage`：用于存储某个特定会话的数据，即同一标签栏下的同源页面。如果跳转到了非同源页面或新打开标签栏，则新页面不会存在原sessionStorage数据。

:::warning 注意
当通过`window.open 或链接打开新页面时(不能是新窗口)`，新页面会复制前一页的`sessionStorage`，但并不共享。
:::

`localStorage`：对于同源页面（无论是否是同一标签栏）是共享公用的，并且只要你不去主动删除，它会永久保存在浏览器中。





[Cookie]:/principle/cookie_session#cookie
