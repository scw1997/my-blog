# BFC块级格式化上下文


BFC(Block formatting context)直译为"块级格式化上下文"。

它是一个独立的渲染区域，只有Block-level box（**display 属性为 block, list-item, table 的元素**）参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

`如果一个元素具有 BFC，内部子元素再怎么翻江倒海，都不会影响外部的元素`。


## BFC特点

- BFC内部的Box会在垂直方向，一个接一个地放置。

- Box垂直方向的距离由margin决定。属于同一个BFC内部的两个相邻Box会发生[margin合并](#margin合并)，不同BFC之间则不会发生margin合并。

- 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。

- BFC的区域不会与float box重叠。

- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

- 计算BFC的高度时，浮动元素也参与计算。


## 创建BFC的方法

- html根元素;
- float 的值不为 none;
- overflow 的值不为visible；
- display 的值为 table-cell、table-caption , inline-block ,flex, inline-flex,grid,inline-grid中的任何一个；
- position 的值不为 relative 和 static。

## BFC应用场景

### （1）防止垂直方向margin合并现象

见下方：[margin合并](#margin合并)

### （2）创建自适应两栏布局
![自适应两栏.png](/fit_two.png)

:::code-group
```html
<body>
    <div class="aside"></div>
    <div class="main"></div>
</body>
```
```css
    body {
        width: 300px;
        position: relative;
    }
 
    .aside {
        width: 100px;
        height: 150px;
        float: left;
        background: #f66;
    }
 
    .main {
        /*成为bfc*/
        overflow: hidden;
        height: 200px;
        background: #fcc;
    }
```
:::
main元素与浮动的aside重叠，因此会根据包含块的宽度，和aside的宽度变化，自动变宽或变窄（当main没有设置固定尺寸时）。

### （3）清除浮动（解决浮动元素父元素高度塌陷）

![高度塌陷.png](/height_destroy.png)
:::code-group
```html
 <div class="par">
    <div class="child"></div>
    <div class="child"></div>
</div>

```
```css
 .par {
    border: 5px solid #fcc;
    width: 300px;
}
 
.child {
    border: 5px solid #f66;
    width:100px;
    height: 100px;
    float: left;
}
```
:::


我们在使用浮动时，如果浮动元素的父元素没有指定高度，会造成父级元素高度塌陷

由于计算BFC的高度时，浮动元素也参与计算。所以创建BFC即可达到清除浮动，避免父元素高度塌陷的效果。

![清除浮动.png](/clear_float.png)

```css
.par {
    overflow: hidden;
}
```
## margin合并

### 现象

- **（1）相邻兄弟元素 margin 合并**

示例：
:::code-group

```html
<div class="container">
    <div class="child">我是child</div>
</div>
```
```css
.container{
    width: 200px;
   height: 200px;
    background-color: yellow;
    padding: 10px;
}
.child{
    width: 100px;
    background-color: green;
    margin: 20px 0;
}
```
:::
![相邻合并.png](/margin_merge_1.png)


- **（2）父元素和最后一个子元素的margin合并**

示例：
:::code-group

```html
<div class="container">
    <div class="child">我是child</div>
</div>
```
```css
.container{
    width: 200px;
    height: 200px;
    background-color: yellow;
    margin-top: 20px;
}
.child{
    width: 100px;
    background-color: green;
    margin-top: 20px;
}
```
:::
![相邻合并.png](/margin_merge_2.png)


实际上，以下三个部分的html代码在默认情况下就是等价的

```html
<div class="father"> 
 <div class="son" style="margin-top:80px;"></div> 
</div> 

<div class="father" style="margin-top:80px;"> 
 <div class="son"></div> 
</div> 

<div class="father" style="margin-top:80px;"> 
 <div class="son" style="margin-top:80px;"></div> 
</div>


```

###  margin合并计算

margin合并计算规则可概括为——**正正取大值，正负值相加，负负最负值**

示例：

俩兄弟元素间上面那个margin-bottom为20px，下面那个margin-top为10px，则最终两元素间外间距为较大的20px

俩兄弟元素间上面那个margin-bottom为50px，下面那个margin-top为-10px，则最终两元素间外间距为50+（-10）=40px

父子元素间，父元素margin-top为-50px，子元素margin-top为-10px，则最终两元素间外间距为负值较大的-50px

### margin合并消除

对于 margin-top 合并，可以进行如下操作（满足一个条件即可）：

• 父元素设置为块状格式化上下文元素（BFC）；

• 父元素设置 border-top 值；

• 父元素设置 padding-top 值；

• 父元素和第一个子元素之间添加内联元素进行分隔。

对于 margin-bottom 合并，可以进行如下操作（满足一个条件即可）：

• 父元素设置为块状格式化上下文元素（BFC)；

• 父元素设置 border-bottom 值；

• 父元素设置 padding-bottom 值；

• 父元素和最后一个子元素之间添加内联元素进行分隔；

• 父元素设置 height、min-height 或 max-height。

所以，我们可以统一采取**父元素设置为块状格式化上下文元素BFC**的方法消除margin合并：

```css
/*父元素*/
.container { 
 overflow: hidden; 
} 
```

> 注意：margin合并现象并非CSS的设计Bug，实际上它的存在意义在于让图文信息的排版更加自然。


