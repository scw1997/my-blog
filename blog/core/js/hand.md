# JS手写实现

通过原生js代码手写实现一些特性


## instanceof

```js
function myInstanceof(target, contructor) {
  //！！！注意箭头函数不能作为contructor
  // 不断沿着原型链向上判断
  while (true) {
    if (target === null) {
      return false;
    }
    if (target.__proto__ === contructor.prototype) {
      return true;
    }
    target = target.__proto__;
  }
}

// 测试
myInstanceof('a' ,String)  //true

myInstanceof({a:1} ,Object)  //true

myInstanceof(1 ,Object)  //true

myInstanceof(true ,Number)  //false
```

## new

```js
function myNew(contructor, ...args) {
    //！！！注意箭头函数不能作为contructor
  //创建以contructor.prototype为原型的对象实例obj  
  const obj = Object.create(contructor.prototype);
  // 修改调用myNew时contructor中的this指向，并传递参数
  const res = contructor.call(obj, ...args);
  // 若contructor调用无返回值，则以obj为返回值
  if (res && (typeof res === "object" || typeof res === "function")) {
    return res;
  }
  return obj;
}

// 测试
function Person(name,age){
    this.name = name;
    this.age = age
}
const obj = myNew(Person,'scw',25)
console.log(obj.name) //'scw'
```

## compose函数

Compose 函数允许你将`多个函数组合成一个函数`，这个新函数按照`从右到左`的顺序（即从最后一个函数到第一个函数）来执行这些函数。即`compose(f, g, h) 等价于 (...args) => f(g(h(...args)))`。

```js
function compose(...funcs) {  
  if (funcs.length === 0) {  
    return arg => arg;  
  }  
  
  if (funcs.length === 1) {  
    return funcs[0];  
  }  
  
  return funcs.reduce((pre, cur) => (...args) => pre(cur(...args)));  
}  
  
// 使用示例  
function multiply(x) {  
  return x * 2;  
}  
  
function add(x) {  
  return x + 1;  
}  
  
const composed = compose(multiply, add);  
console.log(composed(5)); // 12 (因为 5 先经过 add 变成 6，再经过 multiply 变成 12)

```


## curry函数

Curry 函数是一种将接受`多个参数`的函数转换成接受一个`单一参数`（最初函数的第一个参数）的函数，并且返回接受余下的参数且返回结果的新函数的技术。这个过程可以递归进行，直到所有参数都被接收。

```js
function curry(fn) {  
  return function curried(...args) {  
    if (args.length >= fn.length) {  
      // 如果收集到的参数数量足够，直接调用原函数  
      return fn.apply(this, args);  
    } else {  
      // 否则，返回一个新的函数，该函数将收集剩余的参数  
      return function(...args2) {  
        return curried.apply(this, args.concat(args2));  
      };  
    }  
  };  
}  
  
// 使用示例  
function add(a, b, c) {  
  return a + b + c;  
}  
  
const curriedAdd = curry(add);  
console.log(curriedAdd(1)(2)(3)); // 6  
console.log(curriedAdd(1, 2)(3)); // 6
```

## 防抖 & 节流

- 防抖
```js
const debounce = (fun , delay) => {
    let timer: number | null;

    return (...args) => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = window.setTimeout(() => {
            fun.call(EMPTY, ...args);
            timer = null;
        }, delay);
    };
};

// 调用
let elem = document.getElementById('input');
elem.addEventListener('change', debounce(function () {
    console.log('change');
}, 1000))

```
- 节流
```js
const throttle = (fun, delay) => {
    let timer

    return (...args) => {
        if (timer) {
            return;
        }

        timer = window.setTimeout(() => {
            fun.call(EMPTY, ...args);
            timer = null;
        }, delay);
    };
};



// 调用
let dom = document.getElementById('div');
dom.addEventListener('drag', throttle(function () {
    console.log('drag');
}, 300));
```

## bind & call & apply

:::code-group 

```js [apply]
Function.prototype.myApply = function (context, args) {
    //这里默认不传就是给window,也可以用es6给参数设置默认参数
    context = context || window
    args = args ? args : []
    //给context新增一个独一无二的属性以免覆盖原有属性
    const key = Symbol()
    //this就是调用apply的函数
    context[key] = this
    //通过隐式绑定的方式调用函数
    const result = context[key](...args)
    //删除添加的属性
    delete context[key]
    //返回函数调用的返回值
    return result
}
```
```js [call]
//传递参数从一个数组变成逐个传参了,不用...扩展运算符的也可以用arguments代替
Function.prototype.myCall = function (context, ...args) {
    //这里默认不传就是给window,也可以用es6给参数设置默认参数
    context = context || window
    args = args ? args : []
    //给context新增一个独一无二的属性以免覆盖原有属性
    const key = Symbol()
    context[key] = this
    //通过隐式绑定的方式调用函数
    const result = context[key](...args)
    //删除添加的属性
    delete context[key]
    //返回函数调用的返回值
    return result
}
```
```js [bind]
Function.prototype.myBind = function(context) {
    //返回一个绑定this的函数，我们需要在此保存this
    let self = this
        // 可以支持柯里化传参，保存参数
    let arg = [...arguments].slice(1)
        // 返回一个函数
    return function() {
        //同样因为支持柯里化形式传参我们需要再次获取存储参数
        let newArg = [...arguments]
        console.log(newArg)
            // 返回函数绑定this，传入两次保存的参数
            //考虑返回函数有返回值做了return
        return self.apply(context, arg.concat(newArg))
    }
}
```

## 深拷贝

```js
function deepCopy(obj) {
  if (!obj && typeof obj !== 'object') {
    throw new Error('error arguments');
  }
  // const targetObj = obj.constructor === Array ? [] : {};
  const targetObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    
    //只对对象自有属性进行拷贝
    if (obj.hasOwnProperty(key)) { 
      if (obj[key] && typeof obj[key] === 'object') {
        targetObj[key] = deepCopy(obj[key]);
      } else {
        targetObj[key] = obj[key];
      }
    }
  }
  return targetObj;
}


```

## 数组去重
:::code-group 

```js [第一种]
function distinct(arr) {
    const finalArr=[]
    arr.forEach(item=>{
        if(finalArr.indexOf(item)===-1){
            finalArr.push(item)
        }
    })
    return finalArr
}
```
```js [第二种]
function distinct(arr) {
   return arr.filter((item,index)=>{
       return arr.indexOf(item)===index
   })
}
```
```js [第三种]
function distinct(arr) {
   return arr.reduce((pre,cur,index,array)=>{
       return pre.indexOf(cur)>-1?pre:[...pre,cur]
   },[])
}
console.log(distinct([2,2,3,5,7,9,7])) //[2, 3, 5, 7, 9]
```
:::

## Promise

```js
class MyPrmoise{
    constructor(executor) {
        this.status = 'pending'
        this.value = undefined
        this.reason = undefined
        this.onResCallBackList = []
        this.onRejCallBackList = []

        const resolve=(value)=>{
            if(this.status!=='pending') return
            this.status = 'resolved'
            this.value = value
            this.onResCallBackList.forEach(func=>func())
        }

        const reject=(reason)=>{
            if(this.status!=='pending') return
            this.status = 'rejected'
            this.reason = reason
            this.onRejCallBackList.forEach(func=>func())
        }

        try {
            executor(resolve,reject)
        }catch (e) {
            reject(e)
        }
    }
    then(onRes,onRej){
        if(this.status ==='resolved'){
            return new PromiseA((resolve,reject)=>{
                try{
                    const res = onRes(this.value)
                    resolve(res)
                }catch (e) {
                    reject(e)
                }
                
            })
        }
        if(this.status ==='rejected'){
            return new PromiseA((resolve,reject)=>{
                try{
                    const res = onRej(this.reason)
                    reject(res)
                }catch (e) {
                    reject(e)
                }

            })
        }
        if(this.status ==='pending'){
            this.onResCallBackList.push(()=>{
                onRes(this.value)
            })
            this.onRejCallBackList.push(()=>{
                onRej(this.reason)
            })
        }
    }

}
```
- Promise.all

```js
Promise.prototype.myAll=function(promiseList) {
    const len = promiseList.length
    const result = [];
    let count = 0;
    return new Promise((resolve, reject) => {
        for (let i = O;i < len;i++){
            promiseList[i]().then((res)=>{
                result [i] = res;
                count++;
                if (count === len) {
                    resolve(result);
                }
                },(err) => {
                return reject(err);
            })
        }
    })
}
```
