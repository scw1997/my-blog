# 零碎

## label标签

- label标签的`for`属性与指定表单元素的`id`绑定来实现关联表单
```html
<label for="name">姓名</label>
<input type="text" id="name">

<label for="age">年龄</label>
<input type="number" id="age">

<span>性别</span>
<input type="radio" id="boy" name="sex" value="男">
<label for="boy">男</label>

<input type="radio" id="girl" name="sex" value="女">
<label for="girl">女</label>
```
- 将表单控件放到label标签内，这种情况下，label标签只能包含一个表单元素，如果包含多个只对第一个有效。

```html
<label >点击获取input焦点
    <input type="text">
</label>

<label >点击获取textarea焦点
    <textarea></textarea>
</label>
```
## meta标签

```html
<!--  定义ie浏览器使用最新版本渲染页面-->
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<meta http-equiv="content-Type" content="text/html;charset=utf-8">
<meta charset="utf-8">
<!--告诉搜索引擎你的网页的关键字，多个关键字之间用逗号隔开-->
<meta name="keywords" content="html,css,javascript,sass,less,react,vue"/>
<meta name="description" content="一枚菜鸡前端一路走来的技术学习笔记，谈不不上多么深入，旨在为同道中人做技术分享！">
<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>
<!--告诉搜索机器人哪些页面需要索引，哪些页面不需要索引。-->
<meta name="robots" content="all"/>
<!--标注网页的作者-->
<meta name="author" content="fanlaBoy"/>
```

## !DOCTYPE html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
</body>
</html> 
```
用于声明当前HTML文档的解析类型(document.compatMode)。通常来讲，HTML文档的解析类型分为以下两种：

- BackCompat：怪异模式，浏览器使用自己的怪异模式解析渲染页面。

- CSS1Compat：标准模式，浏览器使用W3C的标准解析渲染页面。

当我们在HTML文档的第一行（必须）定义了<!DOCTYPE html>，则表示使用标准模式去解析文档。

反之，若没有定义，则默认是怪异模式。在怪异模式下，不同的浏览器解析HTML文档的显示效果如CSS可能存在较大差异，所以定义统一使用标准模式正是为了避免怪异模式下各种兼容性问题，去强制统一各浏览器的解析模式。

