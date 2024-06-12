# Cookie & Session & Token

## Cookie

Cookie是浏览器实现的一种数据存储技术。

一般由服务器生成，发送给浏览器（客户端也可进行cookie设置）进行存储，下一次请求同一网站时会把该cookie发送给服务器。

### 特点

- cookie存储在**客户端（浏览器）**，发送请求时自动携带放在请求头中。

- cookie只能以文本的方式保存**字符串**类型的数据。

- 单个cookie保存的数据不能超过**4KB**。

- cookie的**安全性不高**，别人可以分析存放在本地的cookie并进行cookie欺骗。

- cookie**默认不可跨域**，可通过特殊的操作如**设置withCredentials属性为true**实现跨域（跨域介绍详见[这里](/principle/cross-origin)）。

### 属性

| 属性名称 | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| domain   | 指定cookie所属域名，默认当前域名                             |
| path     | 指定cookie在哪个域名路由下生效，默认为/                      |
| maxAge   | 指定cookie的有效时长，单位为秒。当值小于0时表示当前会话关闭后即失效，为-1时表示删除该cookie。默认为-1。 |
| expires  | 指定cookie的有效截至日期（现已被maxAge取代）。               |
| secure   | 指定cookie是否仅被使用安全协议传输。当该值为true，则cookie仅在https中生效，http无效。默认为false |
| httpOnly | 若该属性有值，则客户端无法通过JS脚本去获取cookie信息，但仍可以在浏览器的Application工具中手动修改cookie。具备一定程度的安全性。 |


**1：客户端设置**

可通过JavaScript脚本来获取和设置cookie。

客户端可以设置expires, domain,path, secure(只有在https协议的网页中, 客户端设置secure类型cookie才能生效), 但无法设置httpOnly选项。

示例：

```js
document.cookie = "name=xiaoming; age=12 "
```

**2：服务端设置**

浏览器会发送HTTP请求到服务端后，服务器在进行响应到客户端时可以在响应头中设置`Set-Cookie`属性从而保存cookie在客户端中。注意：

- 一个Set-Cookie属性只能设置一个cookie, 当你想设置多个, 需要添加同样多的Set-Cookie。
- 服务端可以设置cookie的所有选项: expires, domain, path, secure, HttpOnly。

### iframe中cookie无效?
参考文章：[https://juejin.cn/post/6935683384710529055](https://juejin.cn/post/6935683384710529055)


:::warning 使用cookie需注意

- 不要存储敏感数据，比如用户密码，账户余额
- 使用 httpOnly 在一定程度上提高安全性
- 移动端对 cookie 的支持不是很好，而 session 需要基于 cookie 实现，所以移动端常用的是 token
:::

## Session

session 是另一种记录服务器和客户端会话状态的机制，并且`session 是基于 cookie` 实现的。

服务器要知道当前请求发给自己的是谁，为了做这种区分，服务器就是要给每个客户端分配不同的"身份标识"，然后客户端每次向服务器发请求的时候，都带上这个“身份标识”。

![session.png](/session.png)

### 流程

用户第一次请求服务器的时候，服务器根据用户提交的相关信息，创建对应的 Session。请求返回时将此 Session 的唯一标识信息 SessionID 返回给浏览器。浏览器接收到服务器返回的 SessionID 信息后，会将此信息存入到 Cookie 中，同时 Cookie 记录此SessionID 属于哪个域名。

当用户第二次访问服务器的时候，请求会自动判断此域名下是否存在 Cookie 信息，如果存在自动将 Cookie 信息也发送给服务端，服务端会从 Cookie 中获取 SessionID，再根据 SessionID 查找对应的 Session 信息，如果没有找到说明用户没有登录或者登录失效，如果找到 Session 证明用户已经登录可执行后面操作。


### 特点

- Session 是基于 cookie 实现，cookie失效或删除则session也无法获取。

- Session 是存储在服务器端，所以安全性比cookie高。

- Session 可以存任意数据类型。

- Session的默认生效时间是30分钟。只要在生效时间内，即使该session值已被修改，依然可通过旧有Cookie访问到旧有Session值。

- Session 可存储数据的容量远高于 Cookie，但是当访问量过多，会占用过多的服务器资源。

## Token

Token 是令牌，访问资源接口（API）时所需要的资源凭证。

Token 使服务端无状态化，不会存储会话信息。

![token.png](/token.png)


### 流程

1：客户端使用用户名跟密码请求登录。

2：服务端收到请求，去验证用户名与密码。

3：验证成功后，服务端会签发一个 token 并把这个 token 发送给客户端。

4：客户端收到 token 以后，会把它存储起来，比如放在 cookie 里或者 localStorage 里。

5：客户端每次向服务端请求资源的时候需要带着服务端签发的 token。

6：服务端收到请求，然后去验证客户端请求里面带着的 token ，如果验证成功，就向客户端返回请求的数据。

### 特点

- 每一次请求都需要携带 token，需要把 token 放到 HTTP 的 Header 里。

- token签发后存储在客户端，不占用服务器资源，可减轻服务器压力。

- 使用token无需担心跨域问题，可自由使用。

## Json Web Token

JWT（Json Web Token）：Token技术的一种现有标准，也是目前最流行的跨域认证解决方案,是一种无状态认证机制。

JWT主要由Header（头部），Payload（负载），Signature（签名）三部分组成。如下图示例：

![jwt_1.png](/jwt_1.png)

Header：是一个 JSON 对象，描述 JWT 的元数据。

Payload：也是一个 JSON 对象，用来存放实际需要传递的数据。

Signature：对前两部分的签名，防止数据篡改。
### 流程

![jwt_2.png](/jwt_2.png)

1：用户输入用户名/密码登录，服务端认证成功后，会返回给客户端一个 JWT

2：客户端将 token 保存到本地（通常使用 localstorage，也可以使用 cookie）

3：当用户希望访问一个受保护的路由或者资源的时候，需要请求头的 Authorization 字段中使用Bearer 模式添加 JWT，其内容看起来是下面这样

```shell
Authorization: Bearer <token>
```
### 使用方式

- 将JWT放在Cookie 里面自动发送，缺点是默认不可跨域。

-  将JWT放在HTTP 请求头信息的 Authorization 字段里（`主流做法`）。

如下所示：

```html
Authorization: Bearer <token>
```

- JWT就放在POST请求的数据体里。

- JWT放在请求URL的参数里，如http://www.example.com/user?token=xxx


### 与标准Token的区别

**Token**：服务端验证客户端发送过来的 Token 时，还需要查询数据库获取用户信息，然后验证 Token 是否有效。

**JWT**： 将 Token 和 Payload 加密后存储于客户端，服务端只需要使用密钥解密进行校验（校验也是 JWT 自己实现的）即可，不需要查询或者减少查询数据库，因为 JWT 自包含了用户信息和加密的数据。

### 特点

- JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。

- JWT 不加密的情况下，不能将秘密数据写入 JWT。

- JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。

- JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。

- JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。

- 为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。

> 参考文章：[阮一峰 - JSON Web Token 入门教程](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)
