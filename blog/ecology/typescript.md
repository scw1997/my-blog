# TypeScript

## 枚举

- **数字枚举**

```ts
enum Direction {
    Up,   // 值默认为 0
    Down, // 值默认为 1
    Left, // 值默认为 2
    Right // 值默认为 3
}

console.log(Direction.Up === 0); // true
console.log(Direction.Down === 1); // true
console.log(Direction.Left === 2); // true
console.log(Direction.Right === 3); // true

```
如果将第一个值进行赋值后，后面的值也会根据前一个值进行累加1：
```ts
enum Direction {
    Up = 10,
    Down,
    Left,
    Right
}

console.log(Direction.Up); // 10 
console.log( Direction.Down,);// 11 
console.log(Direction.Left);// 12 
console.log( Direction.Right); // 13 
```

- **字符串枚举**

```ts
enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

console.log(Direction['Right'], Direction.Up); // Right Up

```

> 注意：使用字符串枚举，必须给每个枚举项设置值，否则报错

- **应用场景**

枚举主要用来定义一些状态常量，在一定程度上和Symbol的使用场景类似。

但是枚举尤其适合**当我们和后端接口数据交互时，设置一些接口字段值的判断规则，帮助提升代码可读性**。

:::code-group 

```ts [状态码管理]
enum ApiErrorCodes {  
    Unauthorized = 401,  
    NotFound = 404,  
    InternalServerError = 500  
}

//假设response为接口的响应
switch (response.status){
    case ApiErrorCodes.Unauthorized:
        console.log('登录状态失效')
        break
    case ApiErrorCodes.NotFound:
        console.log('访问接口不存在')
        break
    //....     
}

```

```ts [权限控制]
// 假如后端定义的权限字段枚举值规则，0表示普通用户,1表示管理员，2表示超级管理员
enum PermissionLevel {  
    User,  
    Admin,  
    SuperAdmin  
}

//假设某段业务代码需要判断当前登录用户的权限
if(user.auth===PermissionLevel.User){
    console.log('当前为普通用户，暂无权限执行此操作')
}

```

```ts [业务接口枚举值]
// 假如后端返回的字段使用 0 - 6 标记对应的日期
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

// 设data为接口返回的数据

if(data.day===Days.Sun){
    console.log('接口字段day的值代表星期一')
}

```
:::

## 声明文件

| 类别      | 定义                             | 特点                                                               |
|---------|--------------------------------|------------------------------------------------------------------|
| 声明文件    | `.d.ts` 后缀的文件                  | 不允许有任何函数的实现<br/>顶层作用域里只能出现 declare，import，export，interface和三斜线指令 |
| 全局类声明文件 | 顶层作用域中没有 import && export的声明文件 | 如果全局类声明文件在 ts 处理范围内， 那么其中的declare 会在全局生效                         |
| 模块类声明文件 |       顶层作用域中有 import && export的声明文件                          |      里面的 declare 不会在全局生效，需要按模块的方式导出来才能生效                                                            |

## type & interface

### 共同点

- 都可用来定义**对象，函数**的类型

:::code-group
```ts [type]
type Type1 = {
    name: string
    age: number
}
type Type2 = (name:string,age:number) => void
```
```ts [interface]
interface Interface1 {
  name: string
  age: number
}
interface Interface2 {
  (name:string,age:number): void
}

```
:::
- 都支持**继承**，以及互相继承

:::code-group
```ts [type]
type Type1 = {
  name: string
}
interface Interface1 {
  name: string
}


type Type2 = Type1 & {
  age: number
}
type Type3 = Interface1 & {
  age: number
}

// 注意：type继承若包含重复属性，属性类型不一致会最终变成never
type Type4 = Type1 & { name: number }  //{name:never}                                           


```
```ts [interface]
type Type1 = {
  name: string
}
interface Interface1 {
  name: string
}

interface Interface2 extends Interface1 {
  age: number
}
interface Interface3 extends Type1 {
  age: number
}

// 注意：interface继承若包含重复属性，属性类型不一致会报错
interface Interface4 extends Interface1 {   // [!code error]
  name: number                              // [!code error]
}                                           // [!code error]
```
:::

### 不同点
- type可以定义**基本类型的别名**，interface不行。如 `type myString = string`。
- type可以声明**联合类型**，interface不行。如 `type unionType = myType1 | myType2`。
- type可以声明**元组类型**，interface不行。如 `type Type1 = [myType1, myType2]`。
- type可以通过**typeof**操作符来定义，interface不行。如 `type myType = typeof someObj`。
- interface可以`声明合并`，type不行：
:::code-group
```ts [interface]
interface Interface1 {
  name: string
  age: number
}
interface Interface1 {
  sex:0|1
}
// 则Interface1类型为:
// {
//   name: string
//   age: number
//   sex:0|1
// }

```

```ts [type]
type Type1 = {
  name: string
  age: number
}
// 重复声明会报错
type Type1 = { // [!code error]
  sex:0|1// [!code error]
}// [!code error]
```
:::

## any & unknown

### 相同点

任何类型的值都可以被赋值给any或unknown类型的变量。

```ts
const unknown1:unknown = 5
const unknown2:unknown = 'string'
const unknown3:unknown = true

const any1:any = 5
const any2:any = 'string'
const any3:any = true
```

### 不同点

- any类型的变量可以赋值给任何类型的变量（但这可能会导致类型污染）。unknown类型的变量只能赋值给any或unknown类型的变量（除非进行断言或类型判断）。
  :::code-group
    ```ts [any]
    const anyStr:any = '1'
    
    const str:string = anyStr
    const num:number = anyStr
    const bol:boolean = anyStr
    ```
    
    ```ts [unkown]
    const unknownStr:unknown = '1'
    
    // 下面会报ts类型错误
    const str:string = unknownStr  // [!code error]
    const num:number = unknownStr // [!code error]
    const bol:boolean = unknownStr // [!code error]
    ```
    :::
- any类型的变量可以随意访问属性和调用方法，而不受类型检查。而unknown你需要先通过类型断言或判断来确定其具体类型，才能使用该类型具有的属性或方法。

  :::code-group
    ```ts [any]
    const anyStr:any = '1'
    
     //调用了number类型的toFixed方法，但不会引起类型检查报错
    anyStr.toFixed() 
    ```

    ```ts [unkown]
    const unknownStr:unknown = '1'
    
    // 下面会报ts类型错误
    console.log(unknownStr.split(',')); // [!code error]
    
    //下面是正确做法
 
    //第一种：类型断言
    console.log((unknownStr as string).split(','));
  
    //第二种：主动检查类型
    if (typeof unknownStr === 'string') {
        console.log(unknownStr.split(','));
    }
    ```
  :::

## 函数重载

TS中的函数重载可以让一个函数可以实现**传不同的参数类型且返回对应的数据类型**。

### 重载签名 & 实现签名

函数重载由`重载签名`和`实现签名`两部分组成。

示例：实现一个获取用户数据的函数。传参为用户id时，返回这个用户的数据；传参为多个用户id组成的数组，则返回多个用户数据组成的数组。传参为空则返回null

```ts
// 下面这三个都称为目标函数的函数签名（可有多个），用于设计不同情况下的类型。不含函数体的具体实现
function getUserData(id:string):Record<string, any>

function getUserData(idList:string[]):Array<Record<string, any>>

function getUserData():null

// 下面为实现重载
function getUserData(
        id?: string | string[]
): Record<string, any> | Array<Record<string, any>> | null {
  switch (true) {
    case id instanceof Array:
      return [{ name: 'scw' },{name:'scw1'}];
    case typeof id === 'string':
      return { name: 'scw' };
    default:
      return null;
  }
}
```
:::warning 注意
- 你需要在实现重载中完全定义好函数签名中涉及到的所有类型，并且在函数体中非常明确的判断出不同类型的参数所对应的返回值。否则可能会TS报错。
- 不要通过`type`或`interface`模拟重载签名的写法，会使得TS无法正确进行类型推导。
  ```ts
  // 错误写法
  type GetUserData = {
    (id:string):Record<string, any>
    (idList:string[]):Array<Record<string, any>>
    ():null
  }
  
  
  const getUserData:GetUserData =(  id?: string | string[])=>{
  
    switch (true) {
      case id instanceof Array:
        return [{ name: 'scw' },{name:'scw1'}];
      case typeof id === 'string':
        return { name: 'scw' };
      default:
        return null;
    }
  }
  ```

:::

### class方法重载

```ts
class ArrayEN {
  constructor(public arr: object[]) {}

  get(Index: number) {
    return this.arr[Index];
  }
  delete(value: number): number;
  delete(value: object): object;
  delete(value: number | object): number | object {
    this.arr = this.arr.filter((item, index) => {
      if (typeof value === "number") {
        return value !== index;
      } else {
        return value !== item;
      }
    });
    return value;
  }
}

```

### class构造器重载

与方法重载语法类似，但是**不需要管理返回值**：
```ts
interface OJType{
  width?:number,
  height?:number
}
class Graph{
  public width:number;
  public height:number;

  constructor(width?:number,height?:number)
  constructor(side?:OJType)
  constructor(v1:any,v2?:any){
    if(typeof v1==='object'){
      this.width=v1.width;
      this.height=v1.height
    }else{
      this.width=v1;
      this.height=v2;
    }
  }

  getArea(){
    const {width,height}=this;
    return width*height
  }
}

const g=new Graph(10,10);
console.log(g.getArea())

```


## 泛型

### 绑定方式

:::code-group


```ts [显式绑定]
type Log<T,U> = {
   (code:T,msg:U):{code:T,msg:U}
}
//等价于
// type Log<T,U> = (code:T,msg:U)=>{code:T,msg:U}



//主动绑定需要在引用类型时显式地传递泛型类型
// 引用示例1
const log1: Log<number,string> = (code, msg) => {
  return { code, msg };
};
const res1 = log1(404,'Not Found')

// 引用示例2
const log2: Log<string,string[]> = (code, msg) => {
  return { code, msg };
};
const res2 = log2('error',['error_1','error_2'])



```

```ts [隐式绑定]
type Log = {
    <T,U>(code:T,msg:U):{code:T,msg:U}
}
//等价于
// type Log =  <T,U>(code:T,msg:U)=>{code:T,msg:U}


// 引用示例
const log: Log = (code, msg) => {
  return { code, msg };
};

//隐式绑定不用主动传递泛型类型，调用函数时通过实时传参进行了动态类型推导。
const res1 = log(404,'Not Found')

const res2 = log('error',['error_1','error_2'])
```
:::
### 泛型默认值

```ts
type Log<T,U=string> = {
   (code:T,msg:U):{code:T,msg:U}
}
type Log<T=number,U=string> = {
  (code:T,msg:U):{code:T,msg:U}
}
```

注意：对于有多个泛型参数的函数类型，**当第一个参数指定了默认类型，后续参数必须指定默认类型**，否则报错。
```ts
// 错误写法
type Log<T=number,U> = {  // [!code error]
    (code:T,msg:U):{code:T,msg:U} // [!code error]
} // [!code error]
```

### 泛型函数

上面函数例子我们需要先设置函数类型，再定义函数并调用。

也可以直接在函数声明上使用泛型并可直接调用:

```ts
function log<T, U>(code, msg): { code: T; msg: U } {
  return { code, msg };
}
log<number, string>(404,'Not Found'); //{code:404,msg:'Not Found'}

```

### 泛型接口

上面的函数`Log`类型也可以用泛型接口方式声明

```ts
interface Log<T,U> {
   (code:T,msg:U):{code:T,msg:U}
}
```

泛型接口的其他用法：

```ts
interface Obj<T> {
  value: T;
  name: string;
}

interface Obj<T=number> {
  value: T;
  name: string;
}
```



### 泛型类
```ts
// 我们将泛型放在类的后面这样就可以约束类的所有成员了
class Log<T> {
  run(value: T) {
    console.log(value);
    return value
  }
}

const log1 = new Log<number>()
log1.run(1234)

// 如果不指定泛型则可以使用任意类型
const log2 = new Log()
log2.run('12')
log2.run({ name: 'kylee' })

```

要注意的是类的泛型约束`不能作用于静态属性和方法`

```ts
class Greeter<T> {
  // 静态属性是只读属性，必须在初始化的时候赋值，因此无法使用泛型
  static cname: string = "Greeter";

  // 静态方法添加到类自身，不能获取到类实例内部的泛型参数
  // Parameter 'value' of public static method from exported class has or is using private name 'T'.
  static getClassName(value: T) {
    return value;
  }
}

```

## class

### 方法/属性可见性

- **public**（默认）：可在class的内部和外部被访问。
- **protected**：只能在当前类或子类的内部属性或方法中访问，不可通过当前类的实例或子类的实例访问。
- **private**：只能在当前类的内部属性或方法中访问，不可通过new实例或子类访问。
- **abstract** :abstract只能存在于abstract类（抽象类）中，可与上面三种类型搭配使用。

:::code-group
```ts [public]
class Test {
  public publicProperty = 'A Public Property'
  public func(){
      // 内部访问
      console.log(this.publicProperty)
  }
}

const p = new Test()
// 外部访问
console.log(p.publicProperty)

```
```ts [protected]
class Father {
  protected protectedProperty = 'A protected property';
  protected protectedFunc() {
    // 内部访问
    console.log(this.protectedProperty);
  }
}

class Child extends Father {
  protected func() {
    //子类访问
    console.log(this.protectedProperty);
    this.protectedFunc();
  }
}

const p1 = new Father();
console.log(p1.protectedProperty); // [!code error] Property protectedProperty is protected and only accessible within class Father and its subclasses.
const p2 = new Child();
console.log(p2.protectedProperty); // [!code error] Property protectedProperty is protected and only accessible within class Father and its subclasses. 
console.log(p2.func()); // [!code error] Property func is protected and only accessible within class Child and its subclasses. 
```
```ts [private]
class Father {
  private privateProperty = 'A private property';
  private privateFunc() {
    // 内部访问
    console.log(this.privateProperty);
  }
}

class Child extends Father {
  public func() {
    //子类访问
    console.log(this.privateProperty); // [!code error] 报错！无权访问
    this.privateFunc(); // [!code error] 报错！无权访问
  }
}

const p = new Father()
console.log(p.privateProperty); // [!code error] 报错！无权访问
```
:::

:::warning 注意
`private，protected`等关键字只是提供编译时的类型检查，如果忽略报错或者跳过类型检查，则不影响编译结果（即这些关键词失效）。
:::

### abstract

抽象类(abstract)表示`不可被实例化`，但abstract类中定义的abstract方法或属性，在其`子类中必须手动实现`。


```ts
abstract class Department {
  constructor(public name: string) {}

  //注意这里定义的是函数返回值的类型
  printName(): void {
    console.log('Department name: ' + this.name);
  }

  abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {
  constructor() {
    super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
  }

  printMeeting(): void {
    console.log('The Accounting Department meets each Monday at 10am.');
  }

  generateReports(): void {
    console.log('Generating accounting reports...');
  }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // [!code error] 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // [!code error] 错误: 方法在声明的抽象类中不存在
```


## 映射类型

- **只读类型`Readonly`**

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}

```

- **只读数组`ReadonlyArray`**
```ts
interface ReadonlyArray<T> {
    /** Iterator of values in the array. */
    [Symbol.iterator](): IterableIterator<T>;

    /**
     * Returns an iterable of key, value pairs for every entry in the array
     */
    entries(): IterableIterator<[number, T]>;

    /**
     * Returns an iterable of keys in the array
     */
    keys(): IterableIterator<number>;

    /**
     * Returns an iterable of values in the array
     */
    values(): IterableIterator<T>;
}

```
使用注意:
```ts
interface Person {
    name: string
}

//只能在数组初始化时为变量赋值，之后数组无法修改
const personList: ReadonlyArray<Person> = [{ name: 'Jack' }, { name: 'Rose' }]

// 会报错：Property 'push' does not exist on type 'readonly Person[]'
personList.push({ name: 'Lucy' }) // [!code error]

// 但是内部元素如果是引用类型，元素自身是可以进行修改的
personList[0].name = 'Lily'

```

- **可选类型`Partial`**
```ts
type Partial<T> = {
    [P in keyof T]?: T[P];
}
```

- **必选类型`Required`**
```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
}
```

- **提取属性`Pick`**
```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}
```

- **排除属性`Omit`**
```ts
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
```

- **摘取类型`Extract`**
```ts
type Extract<T, U> = T extends U ? T : never;
```
使用:
```ts
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T02 = Extract<string | number | (() => void), Function>;  // () => void

```
- **排除类型`Exclude`**
```ts
type Exclude<T, U> = T extends U ? never : T
```
用法:
```ts
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"

type T01 = Exclude<string | number | (() => void), Function>;  // string | number

```
- **属性映射`Record`**
```ts
type Record<K extends string | number | symbol, T> = {
  [P in K]: T;
}
```

- **不可为空类型`NonNullable`**
```ts
type NonNullable<T> = T extends null | undefined ? never : T
```
用于从 T 中剔除 null、undefined、never 类型，不会剔除 void、unknow 类型.

用法:
```ts

type T01 = NonNullable<string | number | undefined>;  // string | number

type T02 = NonNullable<(() => string) | string[] | null | undefined>;  // (() => string) | string[]

type T03 = NonNullable<{name?: string, age: number} | string[] | null | undefined>;  // {name?: string, age: number} | string[]

```
- **函数参数类型`Parameters`**
```ts
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```
用于获取函数的参数类型组成的`元组`

用法:
```ts
type FunctionType = (name: string, age: number) => boolean

type FunctionParamsType = Parameters<FunctionType>  // [name: string, age: number]

const params:  FunctionParamsType = ['Jack', 20]

```
- **函数返回值类型`ReturnType`**
```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

使用:

```ts
type FunctionType = (name: string, age: number) => boolean | string

type FunctionReturnType = ReturnType<FunctionType>  // boolean | string

```

## as const

as count是对字面值的断言,断言后变量只能为当前值，无法做任何的修改。

- **针对基本类型变量,as const 和const的作用相同**

```ts
const a = 'hello';
let b = 'hello' as const;

a = 'world'; // [!code error] 错误
b = 'world'; // [!code error] 错误
```

- **针对array,object等引用类型,as const 无法进行任何改动.但const可以修改对象内部数据的指针。**

```ts
// 数组
let arr1 = [10, 20] as const;
const arr2 = [10, 20];

arr1.push(30); // [!code error] 错误，此时已经断言字面量为[10, 20],数据无法做任何修改
arr2.push(30); //  通过



let obj1 = {
   name: 'zhangsan',
   age: 3
} as const;

const obj2 = {
   name: 'zhangsan',
   age: 3
};

obj1.name = 'lisi'; // [!code error] 错误，无法修改字段
obj2.name = 'lisi'; // 通过
```

- **as const断言会在类型推断时得知具体值和类型，同时能推断出length等属性.但const无此效果。**

```ts
const args = [10, 20] as const; // 断言args为[10, 20]
// const args: readonly [10, 20]
const angle = Math.atan2(...args); // 通过上面断言，得知args.length为2，函数接受两个参数，不会报错
console.log(angle);
```

```ts
// 会报错，此时只知道args是number数组，无法确定里面有多少个元素，所有atan2无法确定得到两个参数而报错
const args = [10, 20];
//上面相当于声明此类型 const args: number[]

const angle = Math.atan2(...args); // [!code error] Expected 2 arguments, but got 0 or more.
console.log(angle);
```

- **as const跟readonly相比,后者只是处理了字段无法再修改，不会断言出其他属性，例如length**：

```ts
let args: readonly number[];
args = [10, 20];
const angle = Math.atan2(...args); // [!code error] A spread argument must either have a tuple type or be passed to a rest parameter.(2556)
```

## extends

在ts中,extends关键字具有以下三种功能

### 继承
- **类继承类**：从父类继承所有的属性和方法实现一个新类。新类支持属性/方法的重写和新增。
- **接口继承接口**：从父接口继承所有的属性和方法实现一个新接口，新接口只能新增属性或方法。
- **接口继承类**：从父类继承所有的属性和方法（不含静态方法/属性）实现一个新接口。新接口只能新增属性或方法。

> 注意：extends不支持`类继承接口`

:::code-group
```ts [类继承类]
class TestClass {
  public state: Record<string, any> = { name: 'TestClass' };
  public func(value: string): void {
    console.log('TestClass');
  }
}


class MyClass extends TestClass {
  // 继承父类,可以重写属性和方法
  public state: Record<string, any> = { name: 'MyClass' };

  public func(value: string): void {
    console.log('MyClass');
  }
}
```
```ts [接口继承接口]
interface TestInterface {
  name: string;
  getAge: () => number;
}

interface MyInterface extends TestInterface {
  // 继承接口,不能重写属性和方法
  // name: number; // [!code error]
  // getAge: () => string; // [!code error]
  age: 27;
}
```
```ts [接口继承类]
class Animal {
    public name:string;
    constructor(name: string) {
        this.name = name;
    }
    eat(food: string) {
        console.log(`${this.name}正在吃${food}`);
    }
    static run() {
        console.log(`${this.name} is running`);
    }
    static kind: string;
}
interface ISheep extends Animal {
    //可新增属性或方法
    miemie: () => void;
}
let lanyangyang: ISheep = {
    name: '懒羊羊',
    eat(food: string) {
        console.log(`${this.name}正在吃${food}`);
    },
    miemie() {
        console.log('别看我只是一只羊，羊儿的聪明难以想象～');
    },
    run() { // [!code error] 报错：不继承静态方法
        //     
    }, 
    kind: 'xx' // [!code error] 报错：不继承静态属性
};
lanyangyang.eat('青草蛋糕');
// 懒羊羊正在吃青草蛋糕
lanyangyang.miemie();
//别看我只是一只羊，羊儿的聪明难以想象～
```
:::

### 三元表达式条件判断


```ts
type TypeRes = Type1 extends Type2 ? Type3 : Type4;
```

其中`Type1 extends Type2`可理解为`类型为Type1的值是否可被赋值给类型为Type2的变量`

:::code-group
```ts [同一类型]
type Type1 = string;
type Type2 = Type1;


type TypeRes = Type1 extends Type2? true: false;
// true

```

```ts [子类型]

//第一种：联合类型
type Type1 = string|number;
type Type2 = string;

type TypeRes = Type2 extends Type1? true: false;
//true


// 第二种：class继承
class Animal {
    //...     
}

class Sheep extends Animal {
    //...     
}

type TypeRes = Sheep extends Animal? true: false;
// true


```

```ts [兼容类型]
//第一种：对象类型
type Type1={
  name:string;
  age:number;
  gender:string;
}
type Type2={
  name:string;
  age:number;
}

type TypeRes = Type1 extends Type2 ? true: false;
// true


//第二种：函数类型
type Type1 = (a:number)=>void;
type Type2 = (a:number,b:string)=>void;


// 主要按顺序看Type1的每个参数都是否能在Type2里找到对应类型的参数
type TypeRes = Type1 extends Type2? true: false;
// true


```
:::

#### 带泛型的三元表达式条件判断

示例：
```ts
type Type1 = string|number;

type Type2 = string;

type Type3<T>=T extends Type2? true: false;

type TypeRes = Type3<Type1> // boolean


```

如上所示，原本`Type1 extends Type2`的返回类型应该是false，但这里为什么是boolean?

原因：**使用`泛型`时，若extends`左侧`的泛型具体取为一个`联合类型`时，就会把联合类型中的类型拆开，分别带入到条件判断式中进行判断，最后把结果再进行联合**。


上面`TypeRes`可以这么理解：

```ts
type TypeRes = (string extends Type2 ?true:false)|(number extends Type2 ? true:false)

// 最终type TypeRes =  true | false 即boolean

```

例如排除类型Exclude的实现：
```ts
type Exclude<T, U> = T extends U ? never : T
```
示例：
```ts
type TypeRes = Exclude<'a' | 'b' | 'c' | 'd', 'a'|'c'|'f'>  //'b'|'d'

//等价于

type TypeRes = ('a' extends 'a'|'c'|'f'?never:'a') | ('b' extends 'a'|'c'|'f'?never:'b') |
        ('c' extends 'a'|'c'|'f'?never:'c')  |('d' extends 'a'|'c'|'f'?never:'d')

// 即type TypeRes = never|'b'|never|'d' 即 'b'|'d'
```

那么如何让泛型三元表达式中extends条件判断规则和普通的extends规则相同呢？答案是使用`[T]`

```ts
type Type1 = string|number;

type Type2 = string;

type Type3<T>=[T] extends Type2? true: false;

type TypeRes = Type3<Type1> //false

```

### 泛型约束

使用extends可以对泛型进行约束，让泛型表示满足一定条件的类型。

泛型约束中的extends同样是表示**前者类型必须可以分配给后者类型**。

```ts
interface ISheep{
  name:string;
  eat:(food:string)=>void;
  miemie:()=>void;
}

// 对泛型T进行了约束，其必须至少要拥有ISheep的name属性及eat、miemie方法
function eatAndMiemie<T extends ISheep>(sheep:T):void{
    sheep.eat("青草蛋糕");
    sheep.miemie();
}


eatAndMiemie(
{
  name: "懒羊羊",
  eat(food:string){
    console.log(`${this.name}正在吃${food}`);
  },
  miemie() {
    console.log("别看我只是一只羊，羊儿的聪明难以想象～");
  }   
  run() {console.log(`${this.name}正在奔跑`)};
  }
)
// 懒羊羊正在吃青草蛋糕
//别看我只是一只羊，羊儿的聪明难以想象～

```
## implements


implements用于实现一个新的`类`，**从父类或者接口实现所有的属性和方法，同时可以重写属性和方法**，包含一些新的功能。

> implements 并`不涉及继承机制`，而是用于实现接口定义的契约。


```ts
class TestClass {
    public state: Record<string, any> = {name:'TestClass'};
    public func(value:string):void{
        console.log('TestClass')
    }
}

interface TestInterface {
    name: string;
    getAge:()=>number
}

class MyClass1 implements TestInterface {
  // 必须实现TestInterface里的方法和属性，因为不涉及继承
    name = 'xx';
    getAge(){
        return 27
    }
}
class MyClass2 implements TestClass {
    // 必须实现或者重写TestClass里的方法和属性，因为不涉及继承
    public state: Record<string, any> = {name:'MyClass2'};
    public func(value:string):void{
        console.log('MyClass2')
    }
}
```



## infer

infer 关键字只能在`条件类型`中使用，作为某未知类型的占位符.**通常与泛型和 extends 关键字一起使用**。

使用示例:

提取函数返回类型:
```ts 
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type ExampleFunction = (x: number, y: string) => boolean;
type ReturnTypeOfExampleFunction = GetReturnType<ExampleFunction>; // boolean

```
提取数组元素类型:
```ts 
type GetArrayElementType<T> = T extends (infer U)[] ? U : never;

type Moment = string[];
type Example1Array = Array<number>;

type ElementTypeOfExampleArray = GetArrayElementType<Moment>; // string
type ElementTypeOfExample1Array = GetArrayElementType<Example1Array>; //number

```
提取Promise值类型:
```ts
type GetPromiseValueType<T> = T extends Promise<infer U> ? U : never;

// 示例
type ExamplePromise = Promise<number>;
type ValueTypeOfExamplePromise = GetPromiseValueType<ExamplePromise>; // number

```
提取函数参数类型:
```ts
type GetParameters<T> = T extends (...args: infer P) => any ? P : never;

type ExampleFunction = (a: number, b: string) => void;
type Params = GetParameters<ExampleFunction>; // [number, string]


```

## namespace & module

`namespace`用于给类型设置独立的管理空间，可以理解为**给类型分门别类进行管理**，可以避免例如类型命名冲突的问题。


:::code-group
```ts [全局声明]
// global.d.ts
declare namespace Test1NameSpace {
  // 这里内部定义的类型不需要添加export，因为是全局声明文件
  type TestFunc = () => void;
  type TestVar = string|number
}
declare namespace Test2NameSpace {
  type TestFunc = () => string;
}

//在代码中使用
const func1:Test1NameSpace.TestFunc = ()=>{
    console.log('func1')
}
const age:Test1NameSpace.TestVar = 2

const func2:Test2NameSpace.TestFunc = ()=>{
    return 'func2'
}
```
```ts [模块导入]
// global.d.ts
export namespace TestNameSpace {
    type TestFunc = () => void;
}

////在代码中使用 
import { TestNameSpace } from '@/typings/global';

type Test = TestNameSpace.TestFunc;
```
:::

:::warning 注意
随着ES Module已经支持Ts类型的模块化后，已经不需要使用namespace进行类型导出。
:::

`module`关键字也同样被ES Module取代，不过在**全局模块类型声明**方面仍有一定的作用：

```ts
// global.d.ts
declare module "some-module" {  
    // 在这里声明模块的类型  
    export function doSomething(): void;  
    export class SomeClass {  
        constructor(options?: any);  
        doSomethingElse(): void;  
    }  
    // 可以继续声明更多的类型、接口、类等  
}  
  
// 现在你可以在TypeScript文件中这样使用它  
import { doSomething, SomeClass } from "some-module";  
  
doSomething();  
const myClass = new SomeClass();  
myClass.doSomethingElse();
```
综上，你可以对一些你在代码中引入的第三方包但不具备配套ts类型声明的时候使用`decalare module`，比如我引入了一个cdn链接的script全局脚本的第三方包，我需要在使用它时进行类型检查就需要declare module来定义其类型。

又或者我们在webpack+ts配置的项目中需要通过`ES Module方式`引入less/scss样式文件或者jpg/png等图片文件时，但TS默认不支持这些文件的模块类型，也需要declare module进行类型定义：

```ts
// global.d.ts
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.webp';
declare module '*.less';


//在代码中引入
import style from './style.module.less'
import icon from './icon.png'
```



## 零碎

- 如果想要限制某个组件的prop children必须是某个组件，可以定义该children类型为`ReactElement<ComponentProps<目标组件的props类型>>`

- Partial，Required等类型工具只对对象类型有用，**对基本类型无效**，此时会返回类型本身。

    ```ts
    type A = keyof string; //"toString" | "charAt" | "charCodeAt" | ...
    type B = Partial<string>; //string
    
    type C = keyof number; //"toString" | "toFixed" | "valueOf" | "toLocaleString"..有.
    type D = Partial<number>; //number
    
    type E = keyof boolean; //"valueOf".
    type F = Partial<boolean>; //boolean
    
    type G = keyof { a: string; b: number }; //"a"|"b"
    type H = Partial<{ a: string; b: number }>; //{a?: string, b?: number}
    
    ```

- type声明的类型别名也是一个**块级作用域**。
- **void**类型是函数没有显式返回任何值时（例如console.log返回值或者undefined）的返回类型。
- **never**类型是函数根本不返回，比如函数内部抛出异常，或者永久循环。
