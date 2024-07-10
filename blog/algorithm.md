# 算法

## 数据结构

大O表示**时间复杂度**：

O(1): 代码中不存在循环语句、递归语句，即时千行万行，复杂度也是 O(1) 。

O(n)：代码中存在循环语句、递归语句。

栈：先入后出（比如Array.pop实现了出栈）

队列：先入先出（比如Array.shift实现了出列）

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
