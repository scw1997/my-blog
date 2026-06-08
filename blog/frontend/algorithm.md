# 数据结构和算法

## 数据结构

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

- 数组元素的内存空间是连续的，而链表不是，它的元素都各自是独立的空间。
- 大多数语言中，数组的大小是固定的，从数组的起点或中间插入或移除项的成本很高，因为需要移动元素；而链表`大小不确定，插入/删除元素只需要修改其指针指向`。
- 数组访问元素直接通过下标即可。但链表`必须从头开始访问，直至找到对应元素`。
- 综上，所以数组查询快，增删慢；链表查询慢，增删快



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
:::tip 双向链表首尾操作较快的原因

链表的头部通常通过一个指针（如 head）直接访问。插入或删除时：
- 插入：新节点的 next 指向原 head，然后更新 head 为新节点。
- 删除：将 head 指向 head.next，并释放原节点的内存。

而每个节点有 prev 和 next 指针，尾节点通过 tail 指针直接访问。插入时只需更新尾节点的 next 和新节点的 prev。

:::

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
bfs(tree); //A B C D F E G

```
## 算法

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


以下是一些常见算法：

### 冒泡排序

:::info 步骤

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

console.log('sorted arr',bubbleSort([2,4,3,6,7,5,1]))
```


#### 时间复杂度：

最好情况：**O(n)**。 此时输入数组已经是排序状态时，冒泡排序只需要遍历一次数组。

平均情况：**O(n^2)**。在大多数情况下，需要进行大约 n^2/2 次比较和 n 次交换。

最坏情况：**O(n^2)**。此时输入数组是逆序，需要进行 n(n-1)/2 次比较和 n-1 次交换。

#### 空间复杂度：**O(1)**



### 快速排序

:::info 步骤
1. 选择基准（Pivot）：从数列中挑出一个元素，称为"基准"（pivot），
2. 分区（Partitioning）：重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作。
3. 递归（Recursion）：递归地把小于基准值元素的子数列和大于基准值元素的子数列排序。
:::
```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  let pivot = arr[Math.floor(arr.length / 2)]; // 选择中间元素作为基准  
  let left = [];
  let right = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  // 递归地对左右两边进行快速排序  
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 测试  
let arr = [3, 6, 8, 10, 1, 2, 1];
console.log(quickSort(arr)); // 输出: [1, 1, 2, 3, 6, 8, 10]

```

#### 时间复杂度

最好情况：**O(n*logn)**。 此时选择的基准元素都能将待排序数组均分为两个长度接近的子数组。

平均情况：**O(n*logn)**。

最坏情况：**O(n^2)**。此时选择最小或最大的元素作为基准元素，或者当输入数组已经是有序或接近有序时。

#### 空间复杂度
最好情况：**O(logn)**。此时将数组均分为两个长度接近的子数组时。

平均情况：**O(logn)**。

最坏情况：**O(n)**。 


###  选择排序


:::info 步骤
1. 在未排序序列中找到最小（或最大）元素，存放到排序序列的起始位置。
2. 再从剩余未排序元素中继续寻找最小（或最大）元素，然后放到已排序序列的末尾。
3. 重复第二步，直到所有元素均排序完毕。
:::
```js
function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    // 找到 [i, n) 区间里的最小值的索引  
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // 将找到的最小值交换到它应该在的位置  
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}

// 使用示例  
let arr = [64, 25, 12, 22, 11];
selectionSort(arr);
console.log(arr); // 输出: [11, 12, 22, 25, 64]

```

#### 时间复杂度

最好情况：**O(n^2)**。即使数组已经是排序好的，算法仍然需要比较所有元素。

平均情况：**O(n^2)**。

最坏情况：**O(n^2)**。

#### 空间复杂度：O(1)



###  插入排序
:::info 步骤
1. 从第一个元素开始，该元素可以认为已经被排序。
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描。
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置。
4. 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置。
5. 将新元素插入到该位置后。
6. 重复步骤2~5。
   :::
```js
function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    /* 将arr[i]插入到arr[0]...arr[i-1]已排序序列中的正确位置 */
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// 使用示例  
let arr = [12, 11, 13, 5, 6];
insertionSort(arr);
console.log(arr); // 输出: [5, 6, 11, 12, 13]
```
#### 时间复杂度

最好情况：**O(n)**。此时输入数组已经是排序好的。

平均情况：**O(n^2)**。

最坏情况：**O(n^2)**。此时输入数组是逆序排列。

#### 空间复杂度：O(1)



###  归并排序
:::info 步骤
1. 分解：将数组分解成两个较小的子数组，直到子数组的大小为1。
2. 递归进行排序并合并：递归地对子数组进行排序，并将已排序的子数组合并成一个大的有序数组，直到合并为1个完整的数组。
   :::
```js
function mergeSort(arr) {
  if (arr.length < 2) {
    return arr;
  }

  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [], indexLeft = 0, indexRight = 0;

  while (indexLeft < left.length && indexRight < right.length) {
    if (left[indexLeft] < right[indexRight]) {
      result.push(left[indexLeft]);
      indexLeft++;
    } else {
      result.push(right[indexRight]);
      indexRight++;
    }
  }

  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
}

// 使用示例  
let arr = [38, 27, 43, 3, 9, 82, 10];
console.log(mergeSort(arr)); // 输出: [3, 9, 10, 27, 38, 43, 82]
```
#### 时间复杂度

最好情况：**O(n * log n)**。归并排序的时间复杂度与数组的初始顺序无关，总是需要将数组分解成单个元素的子数组，然后再合并。

平均情况：**O(n * log n)**。

最坏情况：**O(n * log n)**。

#### 空间复杂度：O(n)



###  顺序查找
:::info 步骤
1. 从数据结构的第一个元素开始。
2. 逐个检查每个元素，看它是否等于要查找的元素。
3. 如果找到匹配的元素，则返回该元素的索引或元素本身。
4. 如果遍历完整个数据结构仍未找到匹配的元素，则返回表示未找到的值。
   :::
```js
function sequentialSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // 找到目标元素，返回其索引  
    }
  }
  return -1; // 未找到目标元素，返回-1  
}

// 使用示例  
let arr = [3, 5, 7, 9, 11];
let target = 7;
console.log(sequentialSearch(arr, target)); // 输出: 2  

target = 13;
console.log(sequentialSearch(arr, target)); // 输出: -1
```
#### 时间复杂度

最好情况：**O(1)**。此时要查找的元素是数组的第一个元素。

平均情况：**O(n)**。

最坏情况：**O(n)**。此时要查找的元素不存在于数组中，或者它是数组的最后一个元素。

#### 空间复杂度：O(1)



###  二分查找
:::info 步骤
1. 计算中间位置：计算两个指针中间位置的值作为中间点。
2. 比较中间元素与目标值：
   - 如果中间元素正好是要查找的元素，则搜索过程结束。
   - 如果要查找的元素大于中间元素，则调整搜索范围的左指针，使其指向中间位置的下一个位置。
   - 如果要查找的元素小于中间元素，则调整搜索范围的右指针，使其指向中间位置的前一个位置。
3. 重复步骤2和3，直到找到目标值或搜索范围为空。
:::
```js
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            return mid; // 找到目标，返回索引  
        } else if (arr[mid] < target) {
            left = mid + 1; // 调整左指针  
        } else {
            right = mid - 1; // 调整右指针  
        }
    }

    return -1; // 未找到目标，返回-1  
}

// 示例  
let arr = [1, 2, 4, 5, 6, 8, 12];
console.log(binarySearch(arr, 5)); // 输出: 3  
console.log(binarySearch(arr, 7)); // 输出: -1
```
#### 时间复杂度

最好情况：**O(1)**。此时目标值正好是数组的中间元素。。

平均情况：**O(n)**。n是数组的长度。因为每次比较都会将搜索范围缩小一半。

最坏情况：**O(n)**。同上

#### 空间复杂度：O(1)
