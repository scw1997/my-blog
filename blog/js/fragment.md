# JS零碎

## 数组异步遍历

数组本身的遍历方法（forEach，map,some,every,filter）并不支持async/await。这是因为这些函数都是`同步`的，它们不会等待异步操作（如Promise）完成。

但是通过`Promise.all`配合map可以实现：

```js
const arr = [1, 2, 3];

const asyncRes = await Promise.all(arr.map(async (i) => {
    await sleep(10);
    return i + 1;
}));

console.log(asyncRes);
// 2,3,4
```

此外，`for of`循环原生支持async/await 异步遍历。

## Map vs Object

比较：

- Object的key只能是`数字、字符串、Symbol`；Map的key可以是`任意类型`；
- Map是迭代对象；Object不可以迭代；
- Map会记录写入顺序；Object会对key进行序列化后按照字典排序；
- Map有内置各种操作函数；Object没有；


:::tip 总结
- 数据量大，频繁写入用Map
- 对写入顺序有要求使用Map
- 多层数据嵌套用Object，链式读取方便
:::
## 其他

- `Object.create()`：创建一个原型对象指向**传入参数**的空对象

  `{}`：创建一个原型指向**Object.prototype**的空对象
