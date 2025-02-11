# 伪类 & 伪元素

介绍部分比较高频率使用的伪类 & 伪元素。

## 伪类

伪类使用`单冒号`，如:hover,:visited。

### :root
匹配html根元素标签，常用于`配置全局CSS变量`。

而html选择器则负责样式，二者本质是一样的。

示例：
```css
:root{
    --blue:#2486ff;
    --red:#f4615c;
    --layerWidth:1190px
}
html{
   overflow: auto;
}
```

### :nth-child & :nth-last-child

xxx:nth-child(n)：表示匹配**作为其父元素的第n个子元素**的xxx元素。

xxx:nth-last-child(n)： 表示匹配**从后往前数的作为其父元素的第n个子元素**的xxx元素。

:::tip `nth-child(An+B)` 语法

其中A，B，n均为不为负的整数，但A前面可以添加负号。

nth-child(5n)匹配第5，10，15...个子元素。

nth-child(3n+4)匹配第4，7，10...个子元素。

nth-child(-n+3)匹配前3个子元素。

nth-last-child(-n+3)匹配最后3个子元素。

:::

### :nth-of-type & :nth-last-of-type

xxx:nth-of-type(n) 表示匹配**与xxx元素标签类型一致的子元素集合里**第n个子元素。

xxx:nth-last-of-type(n) 表示与**xxx元素标签类型一致的子元素集合里**的从后往前数的第n个子元素。

> `nth-of-type(An+B)` 语法与上面nth-child(An+B)语法类似。

此选择器主要适用于特定标签组合并且组合不断重复的场景，例如dl标签的子标签dt和dd的组合。


### :not

xxx:not()是否定伪类，如果xxx元素与()里的选择器不匹配，则会匹配该伪类。

> :not()伪类自身[优先级]为0，最终的优先级由括号内的选择器表达式决定。

示例：

```css
.test:not(.test1){
    /*    */
}
/*可以不断级联*/
input:not(:disabled):not(:read-only){
    /*    */
}
```
### :is & :where

- :is()

  把括号中的选择器依次分配出去，对于那种复杂的有很多逗号分隔的选择器非常有用。

  该伪类**自身优先级为0，最终的[优先级]由()里参数优先级最高的那个选择器决定**。

- :where()

  语法和作用与:is()伪类一致，唯一的区别在于:where()的最终优先级（包括括号里的选择器）始终为0`

示例：

```css
.test>img,.test1>img,.test2>img,.test3>img{
    /*       */
 }

/*等价于*/

:is(.test,.test1,.tes2,.test3)>img{
    /*       */
}
```

## 伪元素

伪元素使用`双冒号`,如::before。

- 优点：不占用DOM节点，减少DOM节点数。 让CSS帮助解决了一部分JavaScript问题，简化了开发。 避免增加毫无意义的页面元素。

- 缺点：不利于调试。

### ::before和::after

在被选中元素里面、元素现有内容之前（后）插入内容。

**特点**

- 默认`display: inline`,不脱离文档流，占据实际元素空间。
- 必须设置content属性，否则一切都是无用功。
- 会继承原本元素的CSS属性（如原元素的颜色等）。

### 其他伪元素

- `::first-line`：匹配元素第一行，仅块元素。
- `::first-letter`：匹配元素第一个字母，仅块元素。
- `::selection`：匹配鼠标长按拖动选中的内容。
- `::placeholder`：匹配input元素的placeholder内容的样式。

示例：

```css
div::first-line{
  color:red;
}
span::selection{
  color: red;
}
input::placeholder {
  color: red;
  font-size: 1.2em;
  font-style: italic;
}
```

[优先级]:/core/html-css/selector-priority
