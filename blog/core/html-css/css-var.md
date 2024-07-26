# CSS变量

## 声明和使用

### 基本用法

```css
/*声明*/
:root{
    --color: red;
}
/*使用*/
#div {
    color: var(color)
}

```
::: warning 变量命名规则
不能包含$，[，^，(，%等字符，普通字符局限在只要是“数字[0-9]”“字母[a-zA-Z]”“下划线_”和“短横线-”这些组合，但是可以是中文，日文或者韩文。
:::


### 组合使用

当变量的值是字符串时，可以直接拼接：
```css

:root{
  --screen-category: 'category'  /*/变量值是字符串*/
}
body:after {
  content: '--screen-category: 'var(--screen-category);  // 直接拼接
}
```

当变量的值是数值时，必须使用`calc()`函数计算：

```css
.foo {
  --gap: 20;
  /*  错误*/
  margin-top: var(--gap)px;     /* [!code --] */
  /*  正确*/
  margin-top: calc(var(--gap) * 1px);    /* [!code ++] */
}

```

### 缺省值

若使用的变量没有定义，则会使用缺省值:

```css
.box {
  --1: #369; 
}
/*body里面访问不到.box定义的--1，因此使用#cd0000*/
body {
  background-color: var(--1, #cd0000);
}
```

若变量已定义且语法无问题，但是变量的值不适用当前属性，则会使用缺省值:

```css
body {
  --color: 20px;
  /* 20px虽然语法正确，但不可能做为background-color的属性值，则使用其缺省值*/
  background-color: var(--color, #cd0000);
}
```

## 继承和作用域

想让变量在局部可用，就定义在某个特定的选择器下即可:

```css
:root{
  color: red; /*全局可用*/
}
.box {
  --1: #369;  /*只在.box这个作用域可用*/ 
}
body {
  background-color: var(--1, #cd0000);
}
```
继承则是由元素层级决定:

```css
<div class="wrapper">
   <div class="content1"></div>
   <div class="content2"></div>
</div>

.wrapper {
   --color: red;
}

.content1 {
    /*继承了wrapper的`--color:red`并修改为`--color: yellow`，且只在content1的作用域内有效*/
   --color: yellow;
}
```

## js操作css变量

```css
:root {
   --color: red;
}
```

```js
//读取
const  root = getComputedStyle(document.documentElement);
let color = root.getPropertyValue('--color').trim();
console.log(color); // 'red'

//改变
document.documentElement.style.setProperty('--color', 'yellow');
color = root.getPropertyValue('--color').trim();
console.log(color);  // 'yellow'

//删除
document.documentElement.style.removeProperty('--color');
color = root.getPropertyValue('--color').trim();
console.log(color); // 'red',这里无法真正删除

```

## 与预处理器的比较

| 参数                 | 动态性     | 作用域          | js交互性 |
  |--------------------|---------|--------------|-------|
| CSS变量              | 可在运行时修改 | 可继承，可组合，有作用域 | 支持    |
| 预处理器(Sass,Less等)变量 | 不可修改    | 可继承,无作用域     | 不支持   |



