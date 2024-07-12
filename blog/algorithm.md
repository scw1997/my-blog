# 数据结构和算法

## 数据结构


- **时间复杂度**

描述代码执行时间（次数）

- O(1)：只执行一次的代码。不存在循环语句、递归语句，即时千行万行）
- O(n)：循环执行n次。代码中存在循环语句、递归语句。
- O(n^2)：循环（如双层for循环）

> 一段存在多种不同时间复杂度的代码，则取较大值；例如同时包含只执行一次和执行n次的代码，则整体时间复杂度为O(n)


- **空间复杂度**
描述代码执行中需要占用的内存空间

- O(1)：只声明/存储了一个变量
- O(n)：比如数组里存储了n个元素

### 栈和队列


- **栈（Stack）**

种遵从`先进后出`原则的有序集合。在栈里，新元素都靠近栈顶，旧元素都接近栈底。


入栈：插入新元素，把新元素放到栈顶元素的上面，使之成为新的栈顶元素。

出栈：删除栈顶元素，使下方紧跟的元素为新的栈顶元素。

![入栈.png](/stack_1.png)
![出栈.png](/stack_2.png)

原生js中没有栈这种结构，但是可用Array实现栈的所有功能。如`pop`实现删除栈顶元素，`push`进行入栈。

```js
class Stack {
    constructor(){
        this.items = []

    }
    size(){
        return this.items.length
    }
    push(item){
        this.items.push(item)
    }
    pop(){
        return this.items.pop()
    }
    isEmpty(){
        return this.items.length===0
    }
    peek(){
        return this.items[this.items.length-1]
    }
    toString(){
        return this.items.join(' ')
    }

}
const s1 = new Stack()
s1.push('1')
s1.push('sss')
s1.push('yyyy')
s1.pop()
console.log(s1)
console.log(s1.size(),s1.isEmpty(),s1.peek(),s1.toString())

```

应用：

- **算法题：有效的括号**

    给定一个由多个左右括号字符组成的字符串，判断其是否整体为一个有效的括号
    ```js
    '((()))' //有效
    '(((())' //无效
    '()()()' //无效
    '(()())' //有效
    ```
    :::tip 思路分析
    
    越靠后的左括号，匹配的是越往前的右括号。
    
    那么可以定义一个空栈，从左往右遍历字符串。碰到左括号则将其入栈，碰到右括号将其出栈。遍历完成之后若栈空了，则证明整体括号有效，否则无效
    :::

    
- **队列（Queue）**

- 先入先出（比如Array.shift实现了出列）

## 常见算法

- 冒泡排序

:::tip 步骤
1. 比较相邻的元素。如果第一个比第二个大（升序排序中），就交换它们两个；
2. 对每一对相邻元素做同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数；
3. 针对所有的元素重复以上的步骤，除了最后一个；

:::
```js
function bubbleSort(arr) {
    //console.time('BubbleSort');
    // 获取数组长度，以确定循环次数。
    let len = arr.length;
    // 遍历数组len次，以确保数组被完全排序。
    for(let i=0; i<len; i++) {
        // 遍历数组的前len-i项，忽略后面的i项（已排序部分）。
        for(let j=0; j<len - 1 - i; j++) {
            // 将每一项与后一项进行对比，不符合要求的就换位。
            if(arr[j] > arr[j+1]) {
                [arr[j+1], arr[j]] = [arr[j], arr[j+1]];
            }
        }
    }
    //console.timeEnd('BubbleSort');
    return arr;
}
```

- 快速排序

```js
function quickSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  const cur = arr[arr.length - 1];
  const left = arr.filter((v, i) => v <= cur && i !== arr.length - 1);
  const right = arr.filter((v) => v > cur);
  return [...quickSort(left), cur, ...quickSort(right)];
}

```

- 插入排序

```js

function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    let target = arr[j];
    while (j > 0 && arr[j - 1] > target) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = target;
  }
  return arr;
}
```
