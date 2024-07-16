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

### 栈（Stack）


一种遵从`先进后出`原则的有序集合，也叫`堆栈`。

在栈里，新元素都靠近栈顶，旧元素都接近栈底。


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
    get size(){
        return this.items.length
    }
    push(item){
        // 入栈
        this.items.push(item)
    }
    pop(){
        // 出栈
        return this.items.pop()
    }
    clear(){
      this.items = []
    }
    get isEmpty(){
        // 返回是否栈空
        return this.items.length===0
    }
    peek(){
        // 返回栈顶元素
        return this.items[this.items.length-1]
    }

}
const s1 = new Stack()
s1.push('1')
s1.push('sss')
s1.push('yyyy')
s1.pop()
console.log(s1)
console.log(s1.size,s1.isEmpty,s1.peek())

```

**应用场景**：

- 算法题：有效的括号

    给定一个由多个左右括号字符组成的字符串，判断其是否整体为一个有效的括号
    ```js
    '((()))' //有效
    '(((())' //无效
    '()()()' //无效
    '(()())' //有效
    ```
    :::tip 思路分析
    
    `越靠后的左括号，匹配的是越往前的右括号。`
    
    那么可以定义一个空栈，从左往右遍历字符串。碰到左括号则执行一次入栈，碰到右括号则执行一次出栈。遍历完成之后若栈空了，则证明整体括号有效，否则无效
    :::

- js函数调用栈

  js解释器使用栈来控制函数的调用顺序。最后调用的函数最先执行完毕。

- 浏览器历史记录
- 撤消操作


<br/>

### 队列（Queue）

一种遵从`先进先出`原则的有序集合。

队列在尾部添加新元素，并从头部移除元素。最新添加的元素必须排在队列的末尾。


![队列.png](/queue_1.png)

js中没有队列这种结构，但是可用Array实现栈的所有功能。如push添加新元素到队列中，shift取出第一个进入的元素：

```js
class Queue {

    constructor(items) {
        this.items = items || []
    }

    enqueue(element){
        // 入列
        this.items.push(element)
    }

    dequeue(){
        // 出队
        return this.items.shift()
    }

    front(){
        // 返回队头元素
        return this.items[0]
    }

    clear(){
        this.items = []
    }

    get size(){
        return this.items.length
    }

    get isEmpty(){
        return !this.items.length
    }
    
}
const queue = new Queue()
console.log(queue.isEmpty) // true

queue.enqueue('John')
queue.enqueue('Jack')
queue.enqueue('Camila')
console.log(queue.size) // 3
console.log(queue.isEmpty) // false
queue.dequeue()
queue.dequeue()
queue.print() // 'Camila'

```

**应用场景**：

- js事件循环的异步队列
- 管理需要按顺序执行的API请求

### 链表（Linked Lists）

链表是按顺序存储数据元素，链表不是保留索引，而是`指向其他元素`。

第一个节点称为头部(head)，而最后一个节点称为尾部(tail)。

**链表与数组的区别**：

- 数组元素的内存空间是连续的，而链表不是。
- 大多数语言中，数组的大小是固定的，从数组的起点或中间插入或移除项的成本很高，因为需要移动元素；而链表`大小不确定，插入/删除元素只需要修改其指针指向`。
- 数组访问元素直接通过下标即可。但链表`必须从头开始访问，直至找到对应元素`。



#### 单链表


![单链表.png](/linked_lists_1.png)


```js
// 链表节点
class Node {
    constructor(element) {
        this.element = element
        this.next = null
    }
}

// 链表
class LinkedList {

    constructor() {
        this.head = null
        this.length = 0
    }

    // 追加元素
    append(element) {
        const node = new Node(element)
        let current = null
        if (this.head === null) {
            this.head = node
        } else {
            current = this.head
            while(current.next) {
                current = current.next
            }
            current.next = node
        }
        this.length++
    }

    // 任意位置插入元素
    insert(position, element) {
        if (position >= 0 && position <= this.length) {
            const node = new Node(element)
            let current = this.head
            let previous = null
            let index = 0
            if (position === 0) {
                this.head = node
            } else {
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                node.next = current
                previous.next = node
            }
            this.length++
            return true
        }
        return false
    }

    // 移除指定位置元素
    removeAt(position) {

        // 检查越界值
        if (position > -1 && position < length) {
            let current = this.head
            let previous = null
            let index = 0
            if (position === 0) {
                this.head = current.next
            } else {
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                previous.next = current.next
            }
            this.length--
            return current.element
        }
        return null
    }

    // 寻找元素下标
    findIndex(element) {
        let current = this.head
        let index = -1
        while (current) {
            if (element === current.element) {
                return index + 1
            }
            index++
            current = current.next
        }
        return -1
    }

    // 删除指定文档
    remove(element) {
        const index = this.indexOf(element)
        return this.removeAt(index)
    }

    isEmpty() {
        return !this.length
    }

    size() {
        return this.length
    }

    // 转为字符串
    toString() {
        let current = this.head
        let string = ''
        while (current) {
            string += ` ${current.element}`
            current = current.next
        }
        return string
    }
}

```

#### 双向链表

单链表只能获取的下一个节点的信息。而双向链表除了包含对下一节点的引用next外，还包含了对上一节点的引用prev：

![双向链表.png](/linked_lists_2.png)



```js
// 链表节点
class Node {
    constructor(element) {
        this.element = element
        this.prev = null
        this.next = null
    }
}

// 双向链表
class DoublyLinkedList {

    constructor() {
        this.head = null
        this.tail = null
        this.length = 0
    }

    // 任意位置插入元素
    insert(position, element) {
        if (position >= 0 && position <= this.length){
            const node = new Node(element)
            let current = this.head
            let previous = null
            let index = 0
            // 首位
            if (position === 0) {
                if (!head){
                    this.head = node
                    this.tail = node
                } else {
                    node.next = current
                    this.head = node
                    current.prev = node
                }
            // 末位
            } else if (position === this.length) {
                current = this.tail
                current.next = node
                node.prev = current
                this.tail = node
            // 中位
            } else {
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                node.next = current
                previous.next = node
                current.prev = node
                node.prev = previous
            }
            this.length++
            return true
        }
        return false
    }

    // 移除指定位置元素
    removeAt(position) {
        if (position > -1 && position < this.length) {
            let current = this.head
            let previous = null
            let index = 0

            // 首位
            if (position === 0) {
                this.head = this.head.next
                this.head.prev = null
                if (this.length === 1) {
                    this.tail = null
                }

            // 末位
            } else if (position === this.length - 1) {
                this.tail = this.tail.prev
                this.tail.next = null

            // 中位
            } else {
                while (index++ < position) {
                     previous = current
                     current = current.next
                }
                previous.next = current.next
                current.next.prev = previous
         }
         this.length--
         return current.element
        } else {
            return null
        }
    }

    // 其他方法...
}

```

#### 循环链表

循环链表和链表之间唯一的区别在于，最后一个元素指向下一个元素的指针(tail.next)不是null， 而是指向第一个元素(head)

![循环链表.png](/linked_lists_3.png)

### 集合（Set）
集合是一种无序且元素不重复的数据结构。ES6提供了原生集合Set结构。

出于学习目的，我们实现一个集合类：

```js
class Set {

    constructor() {
        this.items = {}
    }

    has(value) {
        return this.items.hasOwnProperty(value)
    }

    add(value) {
        if (!this.has(value)) {
            this.items[value] = value
            return true
        }     
        return false
    }

    remove(value) {
        if (this.has(value)) {
            delete this.items[value]
            return true
        }
        return false
    }

    get size() {
        return Object.keys(this.items).length
    }

    get values() {
        return Object.keys(this.items)
    }
}
const set = new Set()
set.add(1)
console.log(set.values)  // ["1"] 
console.log(set.has(1))  // true 
console.log(set.size) // 1 
set.add(2)
console.log(set.values)  // ["1", "2"] 
console.log(set.has(2))  // true 
console.log(set.size) // 2 
set.remove(1)
console.log(set.values) // ["2"] 
set.remove(2)
console.log(set.values) // []
```
### 字典（Dict）

集合是一种键值对的结构。ES6提供了原生字典Map结构。

出于学习目的，我们实现一个字典类：

```js
class Dictionary {

    constructor() {
        this.items = {}
    }

    set(key, value) {
        this.items[key] = value
    }

    get(key) {
        return this.items[key]
    }

    remove(key) {
        delete this.items[key]
    }

    get keys() {
        return Object.keys(this.items)
    }

    get values() {

        /*
        也可以使用ES7中的values方法
        return Object.values(this.items)
        */

        // 在这里我们通过循环生成一个数组并输出
        return Object.keys(this.items).reduce((r, c, i) => {
            r.push(this.items[c])
            return r
        }, [])
    }
}
const dictionary = new Dictionary()
dictionary.set('Gandalf', 'gandalf@email.com')
dictionary.set('John', 'johnsnow@email.com')
dictionary.set('Tyrion', 'tyrion@email.com')

console.log(dictionary)
console.log(dictionary.keys)
console.log(dictionary.values)
console.log(dictionary.items)

```
### 树（Tree）

树是一种非线性的数据结构，由于其存储的所有元素之间具有明显的层次特性，因此常被用来存储具有层级关系的数据，比如文件系统中的文件。

![树.png](/tree_1.png)

应用场景：

- HTML DOM树
- 系统文件结构
- 企业部门人员组织架构

树的分类有很多种，前端主要了解二叉树即可。

#### 二叉树

二叉树是一种特殊的树，它的子节点个数不超过两个，且分别称为该结点的左子树（left subtree）与右子树（right subtree）

![二叉树.png](/tree_2.png)
#### 二叉树的遍历

```js
const tree ={
    value:'A',
    left:{
      value:'B',
      left:{
          value:'D',
          right:{
              value:'E'
          }
      },
      right:{
        value:'F',
        left:{
            value:'G'
        }
      }
    },
    right:{
        value:'C'
    }  
}
```

按照根节点访问的顺序不同，二叉树的遍历分为以下三种：

:::code-group
```js [先序遍历]
// 1. 访问根节点
// 2. 对根节点的左子树进行先序遍历
// 3. 对根节点的右子树进行先序遍历
const preOrder = (node)=> {
    if (node) {
      console.log(node.value)
      preOrder(node.left)
      preOrder(node.right)
    }
}

preOrder(tree) //A B D E F G C
```
```js [中序遍历]
// 1. 对根节点的左子树进行先序遍历
// 2. 访问根节点
// 3. 对根节点的右子树进行先序遍历
const preOrder = (node)=> {
  if (node) {
    preOrder(node.left)
    console.log(node.value)
    preOrder(node.right)
  }
}

preOrder(tree) //D E B G F A C
```
```js [后序遍历]
// 1. 对根节点的左子树进行先序遍历
// 2. 对根节点的右子树进行先序遍历
// 3. 访问根节点
const preOrder = (node)=> {
  if (node) {
    preOrder(node.left)
    preOrder(node.right)
    console.log(node.value)
  }
}

preOrder(tree) //E D G F B C A
```
:::
#### 深度优先遍历

深度优先遍历意味着尽可能深地搜索树的分支,是一种利用`递归`实现的搜索算法。上述二叉树的三种遍历方式均属于`深度优先遍历`，只是访问顺序不同。

特点：简单易实现，内存消耗相对较小
#### 广度优先遍历

广度优先遍历意味着按层次遍历树，即先访问所有第一层的节点，然后是第二层的节点，依此类推。

特点：空间复杂度较高

使用`队列`来实现，按照节点被发现的顺序进行访问：

```js
// 1. 新建队列，将根节点入队
// 2. 然后队头出队，并访问对头，将其左右子节点（若有）入队
// 3. 重复2，直至队列为空


function bfs(root) {  
    if (root === null || root===undefined) return;  
      
    const queue = [root];  
      
    while (queue.length > 0) {  
        const node = queue.shift(); // 出队  
          
        // 访问当前节点  
        console.log(node.value)
          
        // 如果左子节点存在，则入队  
        if (node.left) queue.push(node.left);  
          
        // 如果右子节点存在，则入队  
        if (node.right) queue.push(node.right);  
    }  
}  
  
// 使用示例  
bfs(tree);

```
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
