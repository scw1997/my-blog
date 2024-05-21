# HTML/CSS零碎笔记

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


## width相关属性

- `fill-available`：与div元素宽度的默认行为一致，即宽度占满父元素的宽度（100%）
- `min-content`:内部元素最小宽度值最大的那个元素的宽度。例如img元素的最小宽度值就是图片呈现的宽度，对于文本元素，如果全部是中文，则最小宽度值就是一个中文的宽度值；如果包含英文，因为默认英文单词不换行，所以，最小宽度可能就是里面最长的英文单词的宽度。
- `max-content`：元素内容的宽度，能多大就多大，忽略父元素宽度的限制（即可溢出）。
- `fit-content`：元素内容的宽度，但永远不会超过父元素宽度（自适应）。与`inline-block`,`absolute`,`float`元素默认行为一致。

## 移动端H5屏幕尺寸适配优选方案

使用postcss-plugin-px2rem插件：
```js
// postcss.config.js
module.exports = {
    plugins: {
        'postcss-plugin-px2rem': {
            rootValue: 100, // px数值/rem数值
            exclude: /(node_modules)/,
            minPixelValue: 1, // 1px以上的生效
            selectorBlackList: ['html'],
            propBlackList: ['max-width', 'max-height', 'min-width', 'min-height'] //忽略转换的css属性
        }
    }
};

```
使用rem方案配合px2rem插件，动态更新font-size：
```css
html {
    /*750为设计稿基准*/
    font-size: calc(100vw / 7.5) !important;
    /*这里本应该写100vw/750px即750设计稿是a px，css代码依然写a px，最终转换成a rem。但由于px2rem插件中配置的rootValue为100，即最终转换成0.0a rem（也是为了兼容iphone），所以响应的也要改成100vw/ 7.5*/
    background-color: #fff;
    height: 100%;
}

@media screen and (min-width: 751px) {
    /*设置上限值，兼容pc端显示效果*/
    html {
        font-size: 80px !important;
    }
}
```

## 两/三栏横向拉伸布局

效果示例：

![Markdown Logo](/stretch-layout.png)

代码：
::: code-group
```html
<div class="column">
    <div class="column-left">
        <div class="resize-bar"></div>
        <div class="resize-line"></div>
        <div class="resize-save">
            左侧的内容，左侧的内容，左侧的内容，左侧的内容
        </div>                                            
    </div>
    <div class="column-right">
        右侧的内容，右侧的内容，右侧的内容，右侧的内容
    </div>
</div>
```
```css
.column {
    overflow: hidden;
}
.column-left {
    height: 400px;
    background-color: #fff;
    position: relative;
    float: left;
}
.column-right {
    height: 400px;
    padding: 16px;
    background-color: #eee;
    box-sizing: border-box;
    overflow: hidden;
}
.resize-save {
    position: absolute;
    top: 0; right: 5px; bottom: 0; left: 0;
    padding: 16px;
    overflow-x: hidden;
}
.resize-bar {
    width: 200px; height: inherit;
    resize: horizontal;
    cursor: ew-resize;
    cursor: col-resize;
    opacity: 0;
    overflow: scroll;
}
/* 拖拽线 */
.resize-line {
    position: absolute;
    right: 0; top: 0; bottom: 0;
    border-right: 2px solid #eee;
    border-left: 1px solid #bbb;
    pointer-events: none;
}
.resize-bar:hover ~ .resize-line,
.resize-bar:active ~ .resize-line {
    border-left: 1px dashed skyblue;
}
.resize-bar::-webkit-scrollbar {
    width: 200px; height: inherit;
}

/* Firefox只有下面一小块区域可以拉伸 */
@supports (-moz-user-select: none) {
    .resize-bar:hover ~ .resize-line,
    .resize-bar:active ~ .resize-line {
        border-left: 1px solid #bbb;
    }
    .resize-bar:hover ~ .resize-line::after,
    .resize-bar:active ~ .resize-line::after {
        content: '';
        position: absolute;
        width: 16px; height: 16px;
        bottom: 0; right: -8px;
        background: url(./resize.svg);
        background-size: 100% 100%;
    }
}
```
:::

> 引用链接：https://www.zhangxinxu.com/study/201903/css-idea/behavior-stretch.php?aside=0

## flex相关

- 针对flex item元素，如果给其某个子元素设置单行超出省略的样式无效或者需要根据父元素高度来自适应高度时，则可尝试给flex item元素样式添加`width:0（横向flex布局）`或者`height:0（纵向flex布局）`

## scss/less相关

- 样式继承
  ::: code-group
    ```scss
    //1：mixin方式
    @mixin style{
      color:red;    
    }
    .class{
      @include style;
    }
  
    //2：mixin方式（带参数）
    @mixin style($color){
      color:$color;    
    }
    .class{
      @include style(#ccc);
    }
  
     //3：extend方式
    .style{
        color:red  
    }
    .class{
     @extend .style
    }
  
    // 4：占位符extend方式（推荐此方式，如果不被引用，它是不会被编译到 css 文件中）
    %style{
      color:red
    }
    .class{
    @extend %style
    }

    ```

    ```less
    //1: 直接调用
    .style{
      color:red    
    }
    .class{
      .style
    }
  
     //2: 直接调用（带参数）
    .style(@params){
      color:@params
    }
    .class {
      .style(#000)
    }

    ```
  :::

## textarea元素高度自适应
  ```js
  const textarea = document.getElementById('textarea');
  textarea.oninput=function () {
      this.style.height = this.scrollHeight+'px'
  }
  ```
## 伪元素引入icon图标
```css
.box::before{
    /*注意content:""和display:block为必须属性*/
    content:"";
    display: block;
    background-image: url("./icon.svg");
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
}
```

## 文本溢出显示省略号：

- 单行文本
```css
.ellipsis{
  /*需要确保盒子有固定/最大宽度才可生效*/
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
```
- 多行文本
```css
.ellipsis2{
    /*需要确保盒子有固定/最大宽度才可生效*/
    display: -webkit-box;
    -webkit-box-orient: vertical;
    /*这里2表示超出2行省略*/
    -webkit-line-clamp:2; 
    overflow: hidden;
}
```

## 换行属性

- **word-wrap:break-word**

  只会在单词与单词(中文不涉及)之间的间隔处（一般是空格）才会换行
- **word-break:break-all**

  只要超出每行最大文本长度就会换行（即使这个单词还没结束）
- **white-space:pre-wrap**

  文本内容若包含换行符（\n或\r），则在换行符位置换行。此外，文本默认超出盒子宽度也不换行，也可用此属性

## background相关

### background-size

- **cover**

  保持原图像宽高比例，缩小或放大使原图像正好铺满背景空间,但超出背景尺寸的部分图像将不显示，可能会导致图像不完整.

- **contain**

  保持原图像宽高比例，进行缩小或放大至图片的宽度或高度任意一边等于背景空间的宽度或高度，保证了图片的完整显示。但很可能背景空间会未完全占满并出现空白背景

### background-origin

设置背景图片填充时的起始位置,`对背景颜色无效`

### background-clip
设置背景图片或背景颜色的显示范围

## 元素隐藏最佳设置

```css
.hide {
    /*辅助设备和SEO可识别*/
    clip: rect(0, 0, 0, 0) !important;
    /*clip默认占空间，加上fixed可脱离文档流*/
    position: fixed !important;
}
```
## class类名命名建议

- 使用短命名,如`.some-intro`
- 加统一前缀,如`.ant-xxx`
- 部分通用样式采用CSS属性命名法,如`.mb20`(表示margin-bottom:20px)
- 不使用拼音
- 不使用id选择器和标签选择器（耦合度高）
- 减少嵌套（选择器是从右往左匹配的，嵌套多会影响性能虽然很小。而且优先级混乱，与HTML结构耦合度高）
- 使用小写英文，不用驼峰命名

## 其他

- 元素的width和height如果设置为百分比，默认是基于父元素的`content-box`尺寸计算的（无论是否为border-box）
- `outline`属性不影响盒子的宽度和高度
- 一般来说,`line-height`的合适取值范围在1.2~1.5之间
- 过渡动画`transition`中对类似宽度和高度的`auto`属性是无效的
- `overscroll-behavior:contain`:常用于解决移动端的滚动穿透问题；
- `scroll-behavior:smooth`:使得具有滚动的元素在滚动行为触发时视觉效果更加平滑（例如滚动到锚点链接对应的元素位置时）。可以给任何有滚动的元素无脑添加上该属性。也不需考虑兼容性
- 宽/高度相关属性值产生冲突时的优先级: `min-(width/height) > max-(width/height) > width/height`

