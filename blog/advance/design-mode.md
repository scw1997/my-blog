# 设计模式

## 面向对象

面向对象编程 —— Object Oriented Programming，简称 OOP ，是一种编程开发思想。它强调将现实世界的事物抽象为对象，并使用类和对象来组织代码。

- 封装

  `隐藏对象的属性和实现细节，仅对外公开部分接口（方法）`的一种机制。即隐藏对象内部的复杂性，只对外公开简单的接口。便于外界调用。通俗的说，把该隐藏的隐藏起来，该暴露的暴露岀来，这就是封装性的设计思想。

    通过封装，我们可以控制对对象内部状态的访问，从而保护数据的完整性和安全性。

  ```js
  class Person {  
      constructor(name, age) {  
      // 私有属性（在ES6中并没有原生的私有属性，但可以通过闭包或约定来模拟）  
      this._name = name; // 使用下划线前缀作为约定俗成的私有属性标识  
      this._age = age;  
     }
      // 公有方法  
      setName(name) {  
          this._name = name;  
      }
      getName() {  
          return this._name;  
      }
      // ... 可能还有其他方法  
  }
  // 使用  
  const person = new Person('Alice', 30);  
  console.log(person.getName()); // Alice  
  person.setName('Bob');  
  console.log(person.getName()); // Bob
  ```
- 继承  

  通过继承，我们可以实现`代码的重用和扩展`。并为`多态性`的使用提供了前提。

  ```js
  class Animal {  
      constructor(name) {  
          this.name = name;  
      }  
    
      speak() {  
          console.log(`${this.name} speaks.`);  
      }  
  }  
    
  class Dog extends Animal {  
      constructor(name, breed) {  
          super(name); // 调用父类的构造函数  
          this.breed = breed;  
      }  
    
      bark() {  
          console.log(`${this.name} barks.`);  
      }  
  }  
    
  // 使用  
  const myDog = new Dog('Buddy', 'Golden Retriever');  
  myDog.speak(); // Buddy speaks.  
  myDog.bark(); // Buddy barks.
  
  ```

- 多态

  多态是指同一操作作用于不同的对象，可以有不同的执行结果。通常通过`函数重载和子类重写父类的方法`来实现。


  ```js
  class Animal {  
      speak() {  
          console.log('The animal speaks.');  
      }  
  }
  class Dog extends Animal {  
      speak() {  
          super.speak(); // 调用父类的speak方法（可选）  
          console.log('The dog barks.');  
      }  
  }  
  
  class Cat extends Animal {  
      speak() {  
          console.log('The cat meows.');  
      }  
  }
  // 使用  
  const dog = new Dog();  
  const cat = new Cat();  
    
  let animalArray = [dog, cat];  
  animalArray.forEach(animal => animal.speak());  
  // 输出:  
  // The animal speaks.  
  // The dog barks.  
  // The cat meows.
  ```
## 设计模式

设计模式则是在面向对象编程实践中，经过反复验证和提炼的解决方案，用于解决特定上下文中的常见设计问题。

下面是一些常见设计模式的介绍：

### 工厂模式

工厂模式`封装了创建对象的内部逻辑，通过统一的接口对外提供对象`。

```js
class Product {  
    constructor(name) {  
        this.name = name;  
    }
    use() {  
        console.log(`Using a ${this.name}`);  
    }  
}  

// 假设的ProductA类，实际中你可能需要定义它  
class ProductA extends Product {  
    constructor(name) {  
        super(name);  
        this.type = 'A';  
    }  
  
    specialUse() {  
        console.log(`Using special feature of ${this.name}`);  
    }  
}  
  
// 假设的ProductB类，实际中你可能需要定义它  
class ProductB extends Product {  
    constructor(name) {  
        super(name);  
        this.type = 'B';  
    }  
  
    anotherSpecialUse() {  
        console.log(`Using another special feature of ${this.name}`);  
    }  
}

// 工厂函数  
function createProduct(type, name) {
  if (type === 'ProductA') {
    return new ProductA(name); // 假设有一个ProductA类继承自Product  
  } else if (type === 'ProductB') {
    return new ProductB(name); // 假设有一个ProductB类继承自Product  
  } else {
    return new Product(name); // 默认返回Product实例  
  }
}

// 使用工厂函数创建对象  
const productA = createProduct('ProductA', 'Product A Instance');  
const productB = createProduct('ProductB', 'Product B Instance');  
const defaultProduct = createProduct('Default', 'Default Product Instance');  
  
// 使用对象  
productA.use(); // 使用ProductA  
// 如果需要，可以调用ProductA的特有方法  
// productA.specialUse();  
  
productB.use(); // 使用ProductB  
// 如果需要，可以调用ProductB的特有方法  
// productB.anotherSpecialUse();  
  
defaultProduct.use(); // 使用默认Product
```

工厂模式应用场景：

- 当对象的创建逻辑复杂时
- 隐藏类的实现细节
- 当需要创建不同种类的对象时
- 需要延迟创建对象时

例如JQuery的`$`，`Vue.component()`方法，`React.createElement()`方法。

### 单例模式

单例模式`确保一个类只有一个实例，并提供一个全局访问点来访问这个实例`。

:::code-group 

```js [构造函数写法]
// 创建一个单例构造函数  
function Singleton() {  
    // 私有静态变量，用于存储单例实例  
    if (typeof Singleton.instance === 'object') {  
        return Singleton.instance;  
    }  
  
    // 这里是构造函数的实际代码，但由于我们只想有一个实例，所以通常这里不会放太多东西  
    this.someProperty = 'I am the only instance!';  
  
    // 将实例存储在静态变量中  
    Singleton.instance = this;  
  
    // 如果有需要，可以在这里添加更多的属性和方法  
  
    // 为了防止通过 new Singleton() 创建新的实例，我们可以将构造函数设置为null  
    // 但这通常不是必要的，因为我们已经有检查机制来防止这种情况了  
    // this.constructor = null;  
}  
  
// 测试单例模式  
var instance1 = new Singleton();  
var instance2 = new Singleton();  
  
console.log(instance1 === instance2); // 输出: true，说明两个变量引用的是同一个实例  
console.log(instance1.someProperty); // 输出: "I am the only instance!"

```
```js [class写法]
class Singleton {  
    // 静态变量，存储单例实例  
    static instance = null;  
  
    // 私有构造函数，防止外部通过 new Singleton() 创建实例  
    constructor() {  
        if (Singleton.instance) {  
            throw new Error("Error: Cannot instantiate more than one Singleton instance.");  
        }  
  
        Singleton.instance = this;  
  
        // 类的其他初始化代码...  
        this.someProperty = 'I am the Singleton instance!';  
    }  
  
    // 公开方法  
    getSomeProperty() {  
        return this.someProperty;  
    }  
  
    // 获取单例实例的方法  
    static getInstance() {  
        if (!Singleton.instance) {  
            Singleton.instance = new Singleton();  
        }  
        return Singleton.instance;  
    }  
}  
  
// 测试单例模式  
const instance1 = Singleton.getInstance();  
const instance2 = Singleton.getInstance();  
  
console.log(instance1 === instance2); // 输出: true，说明两个变量引用的是同一个实例  
console.log(instance1.getSomeProperty()); // 输出: "I am the Singleton instance!"  
  
// 尝试通过 new Singleton() 创建实例将会抛出错误  
// const instance3 = new Singleton(); // 将会抛出错误
```
:::
单例模式应用场景：

- `全局状态管理工具`：如react的redux，vue的vuex。
- `模态框（遮罩弹窗）组件`：避免多次使用会创建多个实例。
- `工具类`：例如日期格式化工具、HTTP请求服务等。
- 其他的一些全局配置。

### 观察者模式

观察者模式允许对象（观察者）订阅另一个对象（主题）的状态，并在该状态发生变化时自动收到通知。

```js
// 主题类  
class Subject {  
    constructor() {  
        this.observers = [];  
    }  
  
    // 订阅  
    subscribe(observer) {  
        if (!this.observers.includes(observer)) {  
            this.observers.push(observer);  
        }  
    }  
  
    // 取消订阅  
    unsubscribe(observer) {  
        this.observers = this.observers.filter(obs => obs !== observer);  
    }  
  
    // 通知所有观察者  
    notify(data) {  
        this.observers.forEach(observer => {  
            observer.update(data);  
        });  
    }  
  
    // 状态发生变化，触发通知  
    setState(state) {  
        // 这里可以添加一些处理状态的逻辑  
        console.log(`主题状态改变为: ${state}`);  
        this.notify({ state });  
    }  
}  
  
// 观察者类  
class Observer {  
    constructor(name) {  
        this.name = name;  
    }  
  
    // 当收到通知时调用的方法  
    update(data) {  
        console.log(`${this.name} 收到通知: ${data.state}`);  
    }  
}  
  
// 使用  
const subject = new Subject();  
const observer1 = new Observer('Observer 1');  
const observer2 = new Observer('Observer 2');  
  
subject.subscribe(observer1);  
subject.subscribe(observer2);  
  
subject.setState('New State'); // 输出: 主题状态改变为: New State, Observer 1 收到通知: New State, Observer 2 收到通知: New State  
  
subject.unsubscribe(observer1);  
subject.setState('Another New State'); // 输出: 主题状态改变为: Another New State, Observer 2 收到通知: Another New State

```
观察者模式应用场景：

- `DOM事件监听`：浏览器会在事件发生时通知你注册的事件处理函数。
- `React/Vue数据绑定`：当数据发生变化时，视图需要自动更新。这可以通过观察者模式实现，数据是主题，视图是观察者。
- `中间件和插件系统`：第三方代码（中间件或插件）监听和响应你的系统中的某些事件。
- `实时通知的功能`：如聊天应用、实时股票行情等，当有新数据到达时，能即通知所有的用户。

:::info 观察者模式与发布/订阅模式的区别

![发布/订阅模式](/observer_mode.png)


`两种设计模式思路是⼀样的，最大区别就是发布-订阅模式有一个调度中心。`

从两者结构图可以看到，观察者模式是由具体目标调度的，而发布-订阅模式是统一由调度中心调的，所以观察者模式的订阅者与发布者之间是存在依赖的，而发布-订阅模式则不会，这就实现了解耦。

:::

### 迭代器模式

迭代器模式允许我们`顺序地访问一个集合对象的各个元素，而又不需要暴露该对象的内部表示`。

ES6之后，JS的有序对象，都内置迭代器`Iterator`：

-  字符串
-  数组
-  NodeList 等 DOM 集合
-  Map
-  Set

含迭代器`Iterator`的有序对象都能使用`for of`循环。

示例：实现含Iterator的数据结构

```js
class MyCollection {  
    constructor(items) {  
        this.items = items;  
    }  
  
    // 实现迭代器  
    [Symbol.iterator]() {  
        let index = 0;  
        const items = this.items;  
        return {  
            next: function() {  
                if (index < items.length) {  
                    return { value: items[index++], done: false };  
                } else {  
                    return { value: undefined, done: true };  
                }  
            }  
        };  
    }  
}  
  
// 使用示例  
const collection = new MyCollection([1, 2, 3, 4, 5]);  
  
// 使用for...of循环遍历集合  
for (const item of collection) {  
    console.log(item); // 输出：1, 2, 3, 4, 5  
}  
  
// 也可以使用扩展运算符(...)将集合转换为数组  
const arrayFromCollection = [...collection];  
console.log(arrayFromCollection); // 输出：[1, 2, 3, 4, 5]
```

### 装饰器模式

装饰器（Decorators）指的是一种在类声明、方法、属性或参数上`添加额外行为`的模式。

:::warning 注意
目前，JavaScript并没有内置的装饰器语法，但在TypeScript等语言中得到了更广泛的支持。
:::

示例：
:::code-group 
```js [js高阶函数模拟装饰器模式]
// 定义一个基础的"饮料"类  
class Beverage {  
  cost() {  
    return 1; // 假设基础价格为1元  
  }  
  
  getDescription() {  
    return "Unknown Beverage";  
  }  
}  
  
// 定义一个装饰器工厂函数，它接收一个Beverage类的实例作为参数，并返回一个新的类  
function MilkshakeDecorator(beverage) {  
  return class extends Beverage {  
    cost() {  
      return beverage.cost() + 2; // 假设添加奶昔装饰增加了2元  
    }  
  
    getDescription() {  
      return beverage.getDescription() + ", Milkshake"; // 添加奶昔装饰的描述  
    }  
  };  
}  
  
// 使用装饰器工厂来创建一个带有奶昔装饰的饮料  

const decoratedBeverage = new (MilkshakeDecorator(new Beverage()));  
  
console.log(decoratedBeverage.cost()); // 输出: 3  
console.log(decoratedBeverage.getDescription()); // 输出: "Unknown Beverage, Milkshake"
```

```ts [ts装饰器写法]
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {  
  const originalMethod = descriptor.value;  
  descriptor.value = function (...args: any[]) {  
    console.log(`Calling ${propertyKey} with`, args);  
    const result = originalMethod.apply(this, args);  
    console.log(`Result of ${propertyKey}: ${result}`);  
    return result;  
  };  
}  
  
class MyClass {  
  @log  
  myMethod(x: number, y: number) {  
    return x + y;  
  }  
}  
  
const obj = new MyClass();  
obj.myMethod(1, 2); // 输出调用和结果信息
```
:::
装饰器模式应用场景：

- React高阶组件
- 封装插件


### 代理模式

代理模式允许你为某个对象提供一个代理，以`控制对这个对象的访问`。ES6已有原生Proxy特性。


示例：使用代理模式来记录对一个对象属性的访问：

```js
const user = {
  name: '张三'
}
const proxy = new Proxy(user, {
  get(target, key) {
    console.log('get...')
    return Reflect.get(target, key)
  },
  set(target, key, val) {
    console.log('set...', val)
    return Reflect.set(target, key, val)
  }
})

proxy.name = '李四'  //输出：set... 李四
console.log(proxy.name) //输出：get... 和 李四

```

代理模式应用场景：

- DOM事件委托代理
- ES6 Proxy语法
- webpack devServer代理
- nginx服务器反向代理

### 适配器模式

适配器模式允许将一个类的`接口转换成所期望的另一个接口形式`，使得原本不兼容的接口能够协同工作。

示例：
```js

class Adaptee {
  specificRequest() {
    return "适配者中的业务代码被调用";
  }
}

class Target {
  constructor() {
    this.adaptee = new Adaptee();
  }

  request() {
    let info = this.adaptee.specificRequest();
    return `${info} - 转换器 - 适配器代码被调用`;
  }
}

// 使用示例
let target = new Target();
target.request(); // "适配者中的业务代码被调用 - 转换器 - 适配器代码被调用"

```

适配器模式应用场景

- `计算属性`：如Vue的computed特性，react-mobx的computed。
- `接口标准化`：将多个具有不同接口的类集成到一个系统中，并希望这些类具有统一的接口。
- `第三方库集成`：集成一个接口与你的项目接口不匹配的第三方库到你的项目中。
