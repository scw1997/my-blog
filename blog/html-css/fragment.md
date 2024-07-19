# HTML/CSS零碎

## label标签

:::code-group
```html [第1种形式]
<!--label标签的`for`属性与指定表单元素的`id`绑定来实现关联表单-->

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

```html [第2种形式]
<!--将表单控件放到label标签内，这种情况下，label标签只能包含一个表单元素，如果包含多个只对第一个有效。-->
<label >点击获取input焦点
    <input type="text">
</label>

<label >点击获取textarea焦点
    <textarea></textarea>
</label>
```
:::
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


## width属性

- `fill-available`：与div元素宽度的默认行为一致，即宽度占满父元素的宽度（100%）。该值并非标准，也可能是`stretch`

- `min-content`:内部元素最小宽度值最大的那个元素的宽度。例如img元素的最小宽度值就是图片呈现的宽度，对于文本元素，如果全部是中文，则最小宽度值就是一个中文的宽度值；如果包含英文，因为默认英文单词不换行，所以，最小宽度可能就是里面最长的英文单词的宽度。

- `max-content`：元素内容的宽度，能多大就多大，忽略父元素宽度的限制（即可溢出）。

- `fit-content`：元素内容的宽度，但永远不会超过父元素宽度（自适应）。与**inline-block，absolute，float**元素默认行为一致。


## 两/三栏横向拉伸布局

效果示例：

![Markdown Logo](/stretch_layout.png)

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

## flex

flex默认值为flex:0 1 auto（**只许缩小，不许放大,默认为内容大小**）

flex:none等价于flex:0 0 auto（**既不缩小也不放大，固定为内容大小**）

flex:auto等价于flex:1 1 auto（**能小就小，能大就大，弹性自适应**）


- 当width，flex-basis同时存在时，`flex-basis优先级更高`。

- 针对flex item元素，如果给其某个子元素设置单行超出省略的样式无效或者需要根据父元素高度来自适应高度时，则可尝试给flex item元素样式添加`width:0（横向flex布局）`或者`height:0（纵向flex布局）`。

- flex item即使被指定可收缩，但其会存在一个`隐性最小宽度`，换句话说它不会无限收缩。可通过设置**min-width**属性来覆盖控制这个最小宽度。同理，我们也可以通过设置**max-width**来控制flex item的放大上限。

## vertical-align



![x-height](/x_height.png)

x-height 指的就是小写字母 x 的高度

`vertical-align: middle`的middle 指的是**基线往上 1/2 x-height** 高度


- vertical-align 属性只能作用在 display 计算值为 `inline、inline-block，inline-table 或 table-cell` 的元素上，**浮动**和**绝对定位**会让元素块状化，因此这两种情况也不会使vertical-align属性生效。

- 当vertical-align属性值为px数值时，该数值是相对于当前元素的基线baseline的位置，即正数则上移，负数则下移。从这一点来看，vertical-align:baseline等同于vertical-align:0。

- 当vertical-align属性值为百分比值时，其相对的是当前元素line-height的百分比。

## line-height

- 对于**非替换元素（即不包括input,img,select,textarea元素）的纯内联元素**，其可视高度完全由 line-height 决定

- 对于`块级元素`，line-height 对其本身是`没有任何作用`的，我们平时改变 line-height，块级元素的高度跟着变化实际上是通过改变块级元素里面内联级别元素占据的高度实现的。

- 无论内联元素line-height 如何设置，最终父级元素的高度都是由`数值较大`的那个 line-height 决定的

示例：

```css
/*示例1*/
.box { 
 line-height: 96px; 
} 
.box span { 
 line-height: 20px; 
} 

/*示例2*/
.box { 
 line-height: 20px; 
} 
.box span { 
 line-height: 96px; 
} 

```
假如文字就 1 行，上述两种情况.box 元素的高度都是96px

## 浮动

### 浮动元素特性

- 具有`包裹性`，当其未主动设置宽度时，其宽度右内部元素决定。且其宽度最大不会超过其包含块的宽度。即等价于`width:fit-content`

- 块状化（其display属性的计算值都会自动变成"block"或“table”）并格式化上下文（即创建[BFC]）。

- 会脱离文档标准流。

- 无margin合并问题（源自BFC特性）。

### 清除浮动

- 让父元素也浮动（没有从根本解决问题，反而生成了新的浮动问题）。

- 给父元素设置高度（此法比较死板，让父元素高度固定死了，无法自适应高度）。

- 给父元素设置overflow:hidden（此法原理在于让父元素成为一个BFC，唯一缺点容易导致溢出内容被隐藏掉。）

- `伪元素与clear属性配合（推荐）`：

```css
/*对浮动元素的父元素设置*/
.clear::after{
  clear: both;
  content:'';
  /*clear属性只对块元素有效，而伪元素::afer默认是行级*/
  display: block;
}
```
## scss/less

### 样式继承
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
  /*需要确保当前盒子有固定/最大宽度才可生效*/
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
```
- 多行文本
```css
.ellipsis2{
    /*需要确保当前盒子有固定/最大宽度才可生效*/
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

## background

### background-size

- **cover**

  保持原图像宽高比例，缩小或放大使原图像正好铺满背景空间,但超出背景尺寸的部分图像将不显示，可能会导致图像不完整.

- **contain**

  保持原图像宽高比例，进行缩小或放大至图片的宽度或高度任意一边等于背景空间的宽度或高度，保证了图片的完整显示。但很可能背景空间会未完全占满并出现空白背景

### background-origin

设置背景图片填充时的起始位置,`对背景颜色无效`

### background-clip
设置背景图片或背景颜色的显示范围

## z-index

`当元素z-index 不是 auto 的时候（默认是auto），会创建层叠上下文`。

- 拥有层叠上下文的元素永远会比没有层叠上下文的元素的层叠水平高（即覆盖在其上面）。
- 拥有层叠上下文的同级元素之间，z-index值越大，层叠水平越高。z-index值相同，则渲染顺序越往后，层叠水平越高
- 不含层叠上下文的同级元素之间(即未设置z-index)，则继续比较各自同级后代元素，直到遇到拥有层叠上下文的后代元素，然后按上述规则判断层叠水平。

示例1：

```html
<div style="position:relative; z-index:auto;"> 
 <!-- 人像图片 --> 
 <img src="1.jpg" style="position:absolute; z-index:2;"> 
</div> 

<div style="position:relative; z-index:auto;"> 
 <!-- 景色图片 --> 
 <img src="2.jpg" style="position:relative; z-index:1;"> 
</div> 
```
结论：**人像图片会覆盖在景色图片上方**（双方div都无层叠上下文，则比较子元素，人像img的z-index较大）。

示例2：

```html
<div style="position:relative; z-index:0;">
  <!-- 人像图片 -->
  <img src="1.jpg" style="position:absolute; z-index:2;">
</div>

<div style="position:relative; z-index:0;">
  <!-- 景色图片 -->
  <img src="2.jpg" style="position:relative; z-index:1;">
</div> 
```
结论：**景色图片会覆盖在人像图片上方**（双方div都有层叠上下文，且z-index相同，则渲染顺序后者层叠水平高）。

## 元素隐藏最佳设置

```css
.hide {
    /*辅助设备和SEO可识别*/
    clip: rect(0, 0, 0, 0) !important;
    /*clip默认占空间，加上fixed可脱离文档流*/
    position: fixed !important;
}
```
## position

### static

position属性的默认值。此时 top、right、bottom、left 属性无效。

### relative

基于元素原本的位置进行定位移动。

- 定位包含块为父元素的的content-box
- 定位后原位置依然占用布局空间，所以不脱离标准文档流
- 定位后的元素位置不影响周围其他元素的布局
- top和bottom属性同时存在时，只有top生效；left和right属性同时存在时，只有left生效

### absolute

通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置。

- 定位包含块为最近的position不为static的祖先元素的padding-box，若没有符合条件的祖先元素，则为根元素html标签。
- 定位后，原位置不占用布局空间，所以脱离标准文档流
- 定位的元素可以设置外边距（margin），且不会与其他边距合并。
- 定位元素的宽度由自身内容决定，且不会超过其包含块的宽度
- 定位与float同时使用时，float无效

:::tip 技巧

如果absolute定位的元素，没有设置top/left/bottom/right属性并且其祖先元素不含relative定位，则其默认仍在原位置，但依然脱离标准流（不占据空间）。

此时你可通过margin或padding等属性进行位置定位。

所以，absolute是`独立的CSS属性值`，必须改掉“ 只要有absolute定位，其必有祖先元素relative定位，top,left必有属性值或者必须有z-index ”的错误观点
:::
> 

### fixed

基于页面根元素html标签的位置进行定位。

- 定位的包含块为根元素html标签。
- 定位后，原位置不占用布局空间，所以脱离标准文档流

:::warning fixed失效现象

由于设置了transform属性的元素的特有渲染特性，会导致设置了fixed定位的子元素其fixed定位失效，而变成了基于transform元素的绝对定位现象。

此时的现象可视为transform元素拥有了position:relative属性，而原fixed定位的元素设置了position:absolute属性

:::

## CSS三角形应用

![border_0.png](/border_0.png)

```css
div {
    /*核心是宽高都为0*/
    width: 0;
    height: 0;
    border: 40px solid;
    border-color: orange blue red green;
}
```
等腰三角形：

![triangle_1.png](/triangle_1.png)

```css
div {
    width: 0;
    height: 0;
    /*三角形箭头冲向哪里，该方向的border-width为0,其他方向不为0*/
    border-width: 0 100px 100px 100px;
    border-style: solid;
    /* 不需要的方向的颜色为transparent*/
    border-color: transparent transparent red transparent ;
}
```
直角三角形：

![triangle_2.png](/triangle_2.png)

```css
div {
    width: 0;
    height: 0;
    /*三角形箭头冲向哪里，该方向的border-width为0,其他方向不为0*/
  	/*实现直角三角形，不需要的那一部分的该方向的border-width为0*/
    border-width: 0 0 100px 100px;
    border-style: solid;
    /* 不需要的方向的颜色为transparent*/
    border-color: transparent transparent red transparent ;
}
```

对比进度条：

![triangle_3.png](/triangle_3.png)

```css
 *,::before,::after{
        box-sizing: border-box;
    }
    .container{
        width: 500px;
        height: 50px;
        background-color: red;
    }
    .left{
        width: calc(50% - 25px);
        height: 100%;
        background-color: yellow;
        position: relative;
    }
    /*直角三角形模拟斜线效果*/
    .left::after{
        position: absolute;
        top:0;
        content:'';
        right: -25px;
        width: 0;
        height: 0;
        /*修改对应方向的border-width大小可改变三角形的斜度*/
        border-width: 0 25px 50px 25px;
        border-style: solid;
        border-color: transparent transparent yellow transparent;
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

- 元素的width和height如果设置为百分比，默认是基于父元素的`content-box`尺寸计算的（无论是否为border-box）。

- `outline`属性不影响盒子的宽度和高度。

- 一般来说,`line-height`的合适取值范围在1.2~1.5之间。

- 过渡动画`transition`中对类似宽度和高度的`auto`属性是无效的。

- `overscroll-behavior:contain`:常用于解决移动端的滚动穿透问题。

- `scroll-behavior:smooth`:使得具有滚动的元素在滚动行为触发时视觉效果更加平滑（例如滚动到锚点链接对应的元素位置时）。可以给任何有滚动的元素无脑添加上该属性。也不需考虑兼容性。

- 宽/高度相关属性值产生冲突时的优先级: `min-(width/height) > max-(width/height) > width/height`。


[BFC]:/html-css/bfc
