# 浏览器跨域

## 同源策略

所谓同源是浏览器的一种安全策略：若两个地址的`域名`、`协议`、`端口` 相同，则它们是同源的。

**域名**：网站ip的唯一标识，如www.baidu.com，www.qq.com

**协议**：浏览器连接并访问资源的遵从的统一约定。主要为http和https两种。

**端口**：不同的端口对应不同的应用程序，http网站首页一般默认端口为80端口，https则为443。

示例（以`http://www.example.com/list.html`为对比地址）：

| URL                                   | 是否同源     |
| ------------------------------------- | ------------ |
| http://test.example.com/list.html     | 否，域名不同 |
| https://www.example.com/list.html     | 否，协议不同 |
| http://www.example.com:8080/list.html | 否，端口不同 |
| http://www.example.com/detail.html    | 是           |

## 跨域

不同源的地址之间无法通过ajax，fetch等途径进行访问，这种请求称之为`跨域请求`。

此外，浏览器的Cookie、WebStorage 和 IndexedDB数据也无法跨域读取。

跨域报错示例：

![跨域报错.png](/cross_origin.png)

:::warning 注意
对于图片、js脚本、css资源这种静态资源文件还是可以通过对应的img标签,script标签和link标签跨域进行调用。
:::


## 跨域解决方法

### JSONP

利用`script标签的src属性不受同源策略的限制`，并且资源加载完成后会被当作js脚本立即执行的特点，来达到跨域请求资源的目的。

**JSONP大致流程**：

1. 前端定义一个全局函数foo，该函数用来对服务端返回的数据进行处理操作。该函数接收一个参数data，data是你需要服务端返回给你的数据
```js
window.foo = (data)=>{
    //对data进行操作     
}
```
2. 前端给html文件动态添加一个js脚本，该脚本的scr值为返回所需数据的请求接口地址，示例：

```html
<script src="http://www.test.com/api/test?callback=foo"></script>
```
其中`callback`参数值表示先前定义的全局函数foo。

3. 然后服务端定义该接口返回的数据，返回的数据通常是表示`立即执行foo函数`的一段js代码，示例：

```js
// 以express为例：
app.get('/api/test',(req,res)=>{
    const {callback} = req.query;
    // 返回一段js代码，代码的内容是一个函数的调用，函数的名字是前端的get请求的参数。
    res.send(`${callback}("前端需要的后台数据")`)
})

```
4. 当该接口响应成功后，会立即调用前端已定义好的foo函数，至此完成跨域请求。


**JSONP特点：**

- 优点：兼容性好，支持老的浏览器

- 缺点：只能发送get请求，不安全（jsonp的资源都被所有人访问到）。

### 反向代理


- 开发环境

现代前端构建工具如Webpack,Vite等都支持通过本地服务**proxy**配置来实现本地服务器开发时发起跨域请求。

以Vite为例：

```ts
// vite.config.ts
import { defineConfig } from "vite"

export default defineConfig({
    server: {
      proxy: {
        "/api": {
          target: `http://localhost:3000`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
})

```
- 生产环境

  使用`Nginx配置反向代理`来解决跨域。

> 关于反向代理详见：[反向代理](/advance/http#反向代理)


### CORS

CORS(*Cross-origin resource sharing*，跨域资源共享)是一个 W3C 标准，定义了在必须访问跨域资源时，浏览器与服务器应该如何沟通。

浏览器将跨域请求分为两类：

**（1）简单请求**

:::tip 定义  
1：请求方法是下列之一：

- GET
- HEAD
- POST

2：HTTP请求头信息不超出以下几种字段：

- Accept
- Accept-Language
- Content-Language
- Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain
:::

同时满足以上两种情况则视为`简单请求`。

![简单请求.png](/cors_1.png)

简单请求时，浏览器会直接发送跨域请求，并设置如下**请求头**表明这是一个跨域的请求：

- `Origin`（当前域名）

服务器端接到请求后，会根据自己的跨域规则，设置如下**响应头**来返回验证结果：

- `Access-Control-Allow-Origin`（允许的跨域请求域名）
- `Access-Control-Allow-Methods`（允许的跨域请求方式）

如果验证成功，则会直接返回访问的资源内容。

如果请求时Origin指定的源不在服务端设置的对应响应头的许可范围内，一般服务器会返回一个`403 Forbidden`的HTTP响应和控制台错误。




**（2）非简单请求**

不符合简单请求所需条件的其他跨域请求都视为非简单请求。


非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为`预检"请求（preflight）`，是一个`OPTION`请求。

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的请求，否则就报错。

![预检请求.png](/cors_2.png)

预检请求的请求头：

- `Origin`：表示请求来自哪个源。
- `Access-Control-Request-Method`：**必填**，用来列出浏览器的CORS请求会用到哪些HTTP方法。
- `Access-Control-Request-Headers`：该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段。

服务器收到请求后会设置响应头：

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`：返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
- `Access-Control-Allow-Headers`：是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
- `Access-Control-Allow-Credentials`：用于控制是否携带cookie，跨域请求默认不传递cookie。
- `Access-Control-Max-Age`：该字段可选，用来指定本次预检请求的有效期，单位为秒。在此期间，不用发出另一条预检请求。

如果预检请求验证通过，浏览器才会发送真正的跨域请求。

验证失败（比如origin不在信任名单内）则会返回`403状态码`，浏览器不会发送真正的跨域请求


:::tip cookie跨域
默认情况下，跨源请求不提供凭据(cookie、HTTP认证及客户端SSL证明等)。通过将withCredentials属性设置为true，可以指定某个请求应该发送凭据。

使用方法：

- 客户端必须在AJAX请求中打开`withCredentials`属性
- 服务器端设置响应头`Access-Control-Allow-Credentials: true`
- 服务器端设置响应头`Access-Control-Allow-Origin`的值来指定允许跨域的域名且必须为一个确定域名，而不能使用*这样的通配符。
:::
