# Java基础

## 入门
- java特点
  |特点|说明|
  |--|--|
  |面向对象|/|
  |多线程|同一时间可处理多个任务|
  |编译/解释混合性语言|先编译成class文件，再交给设备按行去解释|
  |跨平台|java代码是运行在虚拟机中而非操作系统，针对不同操作系统安装不同的虚拟机即可|
- java版本类别
  |版本|介绍|
  |--|--|
  |java SE|java标准版，提供基本服务和api，适用开发桌面程序，为java另外两个版本的基础。|
  |java EE|java企业版，提供企业级应用开发的完整解决方案，适用开发大型企业级应用或网站。|
  |java ME|java小型版，适用于嵌入式设备（如电视机，相机）和小型移动设备（如很早之前塞班系统的手机软件），该版本基本已被淘汰。|

- `java jdk`版本中`8`广泛应用于传统老项目，稳定性高。`17`适合使用新特性或微服务的新项目，是最新长期支持的版本。17版本安装后会自动配置环境变量。
- java代码文件都以`.java`为后缀（注意代码行都必须以`;`结尾）。通过调用`javac java文件名`来编译java文件为class文件，再通过调用`java class文件名（不含后缀）`来运行代码。
  > 注意：java文件名需要跟文件内部的public class名一致，否则运行会报错。
- JDK/JRE/JVM关系
  |名词|介绍|
  |--|--|
  |JDK|JDK是java开发工具包，包含了JVM虚拟机，核心类库和开发工具（java,javac等）。用于编写代码+运行程序。|
  |JRE|JRE是java运行环境。包含了JVM虚拟机，核心类库和运行工具。如果只需要运行class文件，则只需要JRE即可。|
  |JVM|JVM是虚拟机，为java程序真正运行的地方。|

## 数据类型/类型转换

### 基本类型

![数据类型.png](/java_data_type.png)

:::tip 拓展
- 一般来说，整数类型变量默认使用`int`（取值范围大且常用），小数类型默认使用`double`(比float取值范围更大，精度更高)
- char只能表示`单个字符`，如单个字母/符号/汉字，且值必须使用`单引号`。如`char name = 'a'`。
- 使用`String`来表示字符串且值必须使用`双引号`，如`String name="胡八一"`。
- 定义long类型变量时，值后面需要加一个`L`（可小写），如`long n = 9999999999L`。
- 定义float类型变量时，值后面需要加一个`F`（可小写），如`foat k = 343.545464F`。
- 数字取值范围从大到小：`dobule > float > long > int > short > byte`。
- 基本类型的数据值存储在自己空间中；而引用类型数据值存储在其他空间中，自己空间存储的是`地址值`。
:::  

### 类型转换

<br/>

#### 隐式转换

1. **取值范围小的类型值会在运算过程中的会被提升为取值范围大的**。
:::code-group
```java [示例1]
int a = 10;
double b = a; //注意这里是把int赋值给了double变量，只能把取值范围小的类型值赋值给取值范围大的。
System.out.println(b); //10.0
```
```java [示例2]
long a =1L;
int b=2;
double c=3.0;
double d=a+b+c; //这里类型必须为double
```
:::
2. **运算时存在byte，short,char这三种类型，会先提升对应类型为`int`类型**（此规则比第1条规则优先级更高）。

:::code-group
```java [示例1]
byte a=1;
byte b=2;
// byte c=a+b; //类型错误
int c=a+b; //类型正确  
```
```java [示例2]
byte a =1;
short b =2;
int c = a+b; //注意这里c是int类型，而不是根据取值范围大小排序判断为short类型
```
:::

3. **加法运算时存在**字符串**则会进行字符串拼接操作。如果是连续加法，则从左往右执行。**

```java 
System.out.println( "中" + "abc" + 1); //中abc1

System.out.println("中" + "abc" + true); //中abctrue

System.out.println(1 + 2 + "abc"+ 1 + 2); //3abc12
```
:::warning 注意
此项规则只适用于字符串，**不适用于单个字符**。
:::

4. **当字符和字符或数字进行加法运算时，会将字符转成对应的ASCII码的数字再进行计算（这条规则实际是第2条规则的补充）**

```java 
System.out.println('a'+1); //98（a的ascII码数字为97）

System.out.println('a'+"abc"); //aabc（因为存在字符串，所以应用第3条规则）  
```


#### 强制转换

用于把取值范围大的类型值赋值给取值范围小的类型变量.

:::code-group
```java [示例1]
byte a=1;
byte b=2;
byte c=(byte)(a+b); //a+b本身应该为int类型，需要强制转换才能变成byte类型  
```
:::

:::tip 补充

- 只含整数的运算，其结果必然是整数；存在小数的运算，其结果只能是小数。

  ```java
   System.out.println(5 / 2); //2
   System.out.println(6.0 / 2); //3.0
   System.out.println(6.0 / 2.0); //3.0
   System.out.println(6 / 2); //3
   System.out.println(5 / 2.5); //2.0
  ```
- `+=,-=，*=，/=`等赋值运算符会根据被赋值变量类型进行内部`强制转换`
  ```java
    short a = 1;
    a+=1; //这里等价于a = (short)(a+1)。虽然按以往规则a=a+1时a会被提升为int类型，但赋值运算符是特殊情况。
  ```
:::


## 数组

- **数组的长度在定义时就已确定**
```java
//写法1（动态初始化）
int[] arr = new int[5]; //定义一个长度为5的int数组，并未初始化值
// 默认初始化值根据类型确定，如int为0，double为0.0，boolean为false，char为'\u0000'（空字符）

//写法2（静态初始化）
int[] arr = {1,2,3,4,5}; //定义一个长度为5的int数组，并定义好各自的值

//注意下面
int[] arr = {}; //相当于定义一个长度为0的int数组（等价于int[] arr = new int[0]），所以后续不能再动态添加元素
```
- 打印数组输出的是其`地址值`
```java
int[] arr = {1,2,3,4,};

 System.out.println(arr); // [I@4eec7777
```

## 方法

基本示例：

```java
public class helloworld {
  public static void getSum(int a, int b){
    int c = a+b;
    System.out.println(c);
  }
  public static void main(String[] args){
    getSum(2,3);
  }
}

 
```
:::info
- 方法与方法之间是平级关系
- 方法参数传递时若为基本类型值，则是值传递。若为引用类型值，则是引用地址传递。
  :::

### 方法重载

定义：`同一个类中，方法名相同，参数不同，与返回值无关即构成重载关系`


```java
public class helloworld {
  public static void getSum(int a, int b){
    int c = a+b;
    System.out.println(c);
  }
  public static void getSum(float a,float b){
    float c = a+b;
    System.out.println(c);
  }
}
```

## 字符串

基本示例：

```java

  //字面量形式
  String a = "abcd";

  //new形式
  String b = new String("abcd");

  //字符数组形式（可应用于修改字符串场景）
  char[] charList = {'a', 'b', 'c'};
  String c = new String(charList);

  //字节数组形式
  byte[] byteList = {97, 98, 99};
  String d = new String(byteList);

```

### 字符串比较

```java
  String a = "abc";
  String b ="Abc";
  String c = new String("abc");

  // equals用于比较字符串值内容是否完全一致
  System.out.println(a.equals(b)); //false
  System.out.println(a.equals(c)); //true

  // equalsIgnoreCase用于比较字符串值内容是否一致，忽略大小写
  System.out.println(a.equalsIgnoreCase(b));//true
  System.out.println(a.equalsIgnoreCase(c)); //true

  // == 对于基本类型，比较的是值，对于引用类型，比较的是引用
  System.out.println(a==b);// false
  System.out.println(a==c); //false
```

### StringBuilder

`StringBuilder`是一个java内置类，用于高效**构建字符串**，适合频繁修改字符串场景（拼接，反转等）。
```java
    StringBuilder sb = new StringBuilder("abc");
    sb.append("hello");
    sb.append("world");
    //支持链式调用
    sb.append("my").append("name").append("is").append("zhangsan");
    System.out.println( sb); //abchelloworldmynameiszhangsan
    //注意此时sb不是string类型，需要转换
    String sbStr = sb.toString();
    System.out.println(sbStr);//abchelloworldmynameiszhangsan
```
### StringJoiner

`StringJoiner`是一个java内置类，基于StringBuilder实现，它更适合带分隔符、前缀和后缀的字符串拼接。
```java
import java.util.StringJoiner;

public class test {
  public static void main(String[] args) {
    StringJoiner sj1= new StringJoiner("--");
    sj1.add("1").add("2").add("3");
    System.out.println(sj1); //1--2--3

    StringJoiner sj2= new StringJoiner(",","[","]");
    sj2.add("1").add("2").add("3");
    System.out.println(sj2); //[1,2,3]
    System.out.println(sj2.length());//7
    System.out.println(sj2.toString()); //[1,2,3]
    System.out.println(sj2.toString().length());//7
  }

}

```
:::tip 扩展
- 字符串属于`引用类型`
- 使用**字面量**形式定义字符串时，系统会检查该字符串是否在串池中已存在。是则复用，否则新建。
- **str.charAt(index)**：获取指定索引位置的字符
- **str.length()**：获取字符串长度

  :::



## 面向对象

### javabean类

javabean类，用来描述某一事物的类，有特定的实现规范，例如

- 实例变量都转为私有变量，并提供相应的getter和setter方法
- 构造方法重载

基本示例：

:::code-group
```java [Test类]
public class Test {
  public static void main(String[] args) {
    Phone myPhone = new Phone();
    System.out.println(myPhone.getName());
    myPhone.setPrice(1000);
    myPhone.setPrice(-1);
    System.out.println(myPhone.getPrice());
  }
}



```
```java [Phone类]
public class Phone {
  //这种类的实现方式叫做javabean类
  
  //实例变量优化为私有属性，避免外部随意直接修改
  private String name = "Nokia";
  private int price = 1000;

  //构造方法重载，兼容两种情况：无参构造和有参构造
  public Phone(){}
  public Phone(String name, int price){
    this.name = name;
    this.price = price;
  }

  //封装获取实例变量和修改的方法提供给外部实例使用，保证安全的同时提供访问权限
  public int getPrice(){
    return this.price;
  }
  public void setPrice(int newPrice){
    if(newPrice<0){
      System.out.println("Invalid price");
    }else{
      this.price = newPrice;
    }

  }
  public String getName(){
    return this.name;
  }
  public void setName(String newName){
    this.name = newName;
  }
  public void sendMessage(){
    System.out.println("Sending message...");
  }
}


```
:::

:::warning 注意事项

- **封装**（面向对象的特性之一）：给对象封装对应的数据和提供数据对应的行为
- 虚拟机会**默认创建无参的构造方法**。执行new时虚拟机会自动调用构造方法，用于给实例初始化。且**构造方法可重载**。
- This的本质是**调用者的地址值**。
  :::

### 工具类

工具类的特点是：

- 使用 `final` 防止继承
- `构造函数私有化`并抛出异常防止实例化
- 方法均为静态方法，通过类名直接调用

基本实例：

```java
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;
 
/**
 * 通用工具类
 */
public final class UtilTools {
 
    // 私有构造方法防止实例化
    private UtilTools() {
        throw new AssertionError("Cannot instantiate utility class");
    }
 
    // ==================== 字符串相关 ====================
 
    /**
     * 检查字符串是否为空或null
     */
    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
 
    /**
     * 检查字符串是否不为空
     */
    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }
 
    /**
     * 生成指定长度的随机字符串（仅包含字母和数字）
     */
    public static String generateRandomString(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
 
    // ==================== 日期时间相关 ====================
 
    /**
     * 获取当前时间字符串（格式：yyyy-MM-dd HH:mm:ss）
     */
    public static String getCurrentDateTime() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }
}
 
```

### main方法
```java
public static void main(String[] args) {
  //
}
```


- 其中args是命令行参数，用于接收外部键盘参数（现在已不用，新版java已使用scanner替代）。pubic表示允许JVM调用。

- **不是所有类都需要定义main方法**，该方法一般只会在可执行程序（JVM 需要入口点），测试类（用于快速验证功能），命令行工具（接收输入参数）
  中需要定义。
- javabean类，工具方法类和一些框架组件通常不需要定义main方法。



### 访问修饰符

#### public

**无限制访问**，可修饰`类，类的方法和属性，接口`

```java
// File: com/example/PublicExample.java
package com.example;

public class PublicExample {
    public String publicField = "我是公共字段";
    
    public void publicMethod() {
        System.out.println("这是公共方法");
    }
}

//假设下面是其他包中的类
// 任何其他包中的类都可以访问
package com.other;
import com.example.PublicExample;

public class Test {
    public static void main(String[] args) {
        PublicExample example = new PublicExample();
        System.out.println(example.publicField);  // 可以访问
        example.publicMethod();                  // 可以访问
    }
}
```
#### protected

**只可被同包中的类或不同包的子类及其实例访问**。用于修饰`类中定义的方法或属性、内部类`，不可修饰外部类。

```java
// File: com/example/ProtectedExample.java
package com.example;

public class ProtectedExample {
    protected String protectedField = "我是受保护字段";
    
    protected void protectedMethod() {
        System.out.println("这是受保护方法");
    }
}

// 同包中的类可以访问
package com.example;
public class SamePackageClass {
    public void test() {
        ProtectedExample example = new ProtectedExample();
        System.out.println(example.protectedField);  // 可以访问
        example.protectedMethod();                  // 可以访问
    }
}

//下方为不同包的类
// 不同包的子类可以访问
package com.other;
import com.example.ProtectedExample;

public class ChildClass extends ProtectedExample {
    public void test() {
        System.out.println(this.protectedField);  // 可以访问（继承得到）
        this.protectedMethod();                  // 可以访问
    }
}

//下方为不同包的类
// 不同包的非子类不能访问
package com.other;
import com.example.ProtectedExample;

public class UnrelatedClass {
    public void test() {
        ProtectedExample example = new ProtectedExample();
        // System.out.println(example.protectedField);  // 编译错误
        // example.protectedMethod();                   // 编译错误
    }
}
```

#### private

**仅限类内部访问，实例不可访问**。用于修饰`类中定义的方法或属性、内部类`,不可修饰外部类。

```java
// File: com/example/PrivateExample.java
package com.example;

public class PrivateExample {
    private String privateField = "我是私有字段";
    
    private void privateMethod() {
        System.out.println("这是私有方法");
    }
    
    public void publicMethod() {
        // 类内部可以访问私有成员
        System.out.println(this.privateField);
        this.privateMethod();
    }
}

// 任何其他类都不能访问私有成员
package com.example;
public class Test {
    public static void main(String[] args) {
        PrivateExample example = new PrivateExample();
        example.publicMethod();  // 可以通过公有方法间接访问
        
        // System.out.println(example.privateField);  // 编译错误
        // example.privateMethod();                   // 编译错误
    }
}
```

#### default
为默认修饰符。**只有同包内的类及其实例可以访问**。用于修饰`类、者类中定义的方法或属性`

```java
// File: com/example/DefaultExample.java
package com.example;

class DefaultExample {  // 注意：这里没有修饰符
    String defaultField = "我是默认字段";
    
    void defaultMethod() {
        System.out.println("这是默认方法");
    }
}

// 同包中的类可以访问
package com.example;
public class SamePackageClass {
    public void test() {
        DefaultExample example = new DefaultExample();
        System.out.println(example.defaultField);  // 可以访问
        example.defaultMethod();                  // 可以访问
    }
}

// 不同包中的类不能访问
package com.other;
import com.example.DefaultExample;  // 编译错误：DefaultExample在com.example包中不可见

public class Test {
    public static void main(String[] args) {
        // DefaultExample example = new DefaultExample();  // 编译错误
    }
}
```

:::tip 最佳实践

- 实例属性：通常设为 private，通过 public 的 getter/setter 访问
- 方法：
   1. 工具方法设为 public

   2. 只在类内部使用的方法设为 private

   3. 需要子类重写的方法设为 protected
- 类：
只有当前包使用的类设为默认（包私有）
需要被其他包访问的类设为 public
- 常量：通常设为 public static final
:::

### final

- 修饰类时，表示该类不可被继承
- 修饰方法时，表示该方法不可被子类重写
- 修饰属性时，表示该属性需要显式声明值，且不可被修改（若为引用类型，可内部修改，引用不变即可）

### static

static表示类自己拥有的属性/方法，全局共享一份。

- 静态属性/方法可以被类本身静态调用，也可以**被实例化对象调用（不推荐，编译器会转为静态调用，增加解析成本）**
- 静态方法只能访问静态属性和静态方法
- 非静态方法可以访问非静态属性和非静态方法，也可以访问静态属性和静态方法（此时静态属性和方法也可通过this调用）
- 静态方法没有this关键字
- 可通过`static final`用于定义全局常量


### abstract
#### 抽象类

- 不能被实例化
- 可以包含抽象方法或具体实现的方法
- 子类必须实现父类的所有抽象方法或者子类是抽象类

#### 抽象方法

- 只有声明，没有实现
- 只能出现在抽象类中

```java
abstract class Shape {
    // 抽象方法 - 计算面积
    public abstract double calculateArea();
    
    // 抽象方法 - 计算周长
    public abstract double calculatePerimeter();
    
    // 具体方法
    public void display() {
        System.out.println("这是一个形状");
    }
}

class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double calculatePerimeter() {
        return 2 * Math.PI * radius;
    }
}

class Rectangle extends Shape {
    private double length;
    private double width;
    
    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }
    
    @Override
    public double calculateArea() {
        return length * width;
    }
    
    @Override
    public double calculatePerimeter() {
        return 2 * (length + width);
    }
}

public class AbstractMethodDemo {
    public static void main(String[] args) {
        Shape circle = new Circle(5.0);
        System.out.println("圆的面积: " + circle.calculateArea());
        System.out.println("圆的周长: " + circle.calculatePerimeter());
        circle.display();
        
        Shape rect = new Rectangle(4.0, 6.0);
        System.out.println("矩形的面积: " + rect.calculateArea());
        System.out.println("矩形的周长: " + rect.calculatePerimeter());
        rect.display();
    }
}
```

抽象类的应用场景：

- 模板方法模式：抽象类定义算法骨架，具体步骤由子类实现
- 框架设计：提供基础功能，强制子类实现特定方法
- 共享代码：多个类有共同行为时，可以提取到抽象类中
- 强制规范：要求子类必须实现某些关键方法

### 接口

:::code-group 
```java [基本示例]
// 定义多个接口
public interface Animal {
    // 常量（默认是public static final）   
    // 抽象方法（默认是public abstract）
    void eat();
    void sleep();
    
    // 默认方法（Java 8+）
    default void breathe() {
        System.out.println("呼吸空气");
    }
    
    // 静态方法（Java 8+）
    static boolean isAlive() {
        return true;
    }
}
interface Swimmable {
  void swim();
}

interface Flyable {
  void fly();
}


// 实现接口
public class Duck implements Animal,Swimmable, Flyable {
    @Override
    public void eat() {
      System.out.println("鸭子吃水草");
    }
  
    @Override
    public void sleep() {
      System.out.println("鸭子站着睡觉");
    }
  
    @Override
    public void swim() {
      System.out.println("鸭子划水游泳");
    }
  
    @Override
    public void fly() {
      System.out.println("鸭子短距离飞行");
    }
    
    // 可以选择不重写默认方法
}

public class Main {
  public static void main(String[] args) {
    Duck duck = new Duck();
    duck.eat();      // 鸭子吃水草
    duck.swim();     // 鸭子划水游泳
    duck.breathe();  // 呼吸空气（来自接口默认方法）

    System.out.println(Animal.isAlive()); // true（静态方法）
    System.out.println(Animal.TYPE);      // 生物（常量）
  }
}
```
```java [default多继承命名冲突]
interface A {
    default void show() {
        System.out.println("A的show");
    }
}

interface B {
    default void show() {
        System.out.println("B的show");
    }
}

class C implements A, B {
    @Override
    public void show() {
        A.super.show(); // 明确调用A的默认方法
        B.super.show(); // 明确调用B的默认方法
        System.out.println("C的show");
    }
}

```
:::code-group



与抽象类相比，接口同样可以实现抽象，但二者各有区别，并且侧重点不同：
|特性|抽象类|接口|
|--|--|--|
|实例化|不支持|不支持|
|方法实现|支持具体方法|只支持abstract方法（java8之后可支持static和private方法），默认修饰为**public abstract**|
|构造方法|支持|不支持|
|实例变量|支持|只能是常量，默认修饰为**public static final** |
|继承|单继承|支持多实现（一个类可实现多个接口）|
|设计目的|代码复用，部分实现|定义行为规范，多继承支持|

:::warning 注意
- 接口中默认的abstract方法必须在类中实现
- 接口与接口之间是继承关系，可以单继承，也可以多继承
- 接口中定义的default方法不是必须要在类中重写，只要当多继承情况下出现同名default方法才必须重写
- 接口中定义的static方法不需要（也不能）在类中重写，并且只能通过接口名去调用（例如Inter.staticMethod()）
- 接口中定义的private方法不需要（也不能）在类中重写，这类方法主要是为接口内部所用（例如用于抽取接口内部多个default方法中的公共逻辑），不被类或者外界所用。
- 当一个方法的参数类型为某个接口，则该参数可以传递该接口实现的所有对象，这叫做接口的多态。
:::


:::tip 接口还是抽象类？
抽象类适合代码服用，共享父类部分实现，需要继承实例属性的情况。例如模板设计。

接口适合定义**行为规范或者枚举变量规则**，并且支持多实现的情况。例如多个类拥有的共同行为方法可以封装成接口，插件实现，支持多种插件。
:::

#### 适配器模式

场景：某接口的抽象方法很多，但我只需要其中某个或某几个

解决思路：**新建一个抽象中间类（适配器）Adapt重写该接口的所有抽象方法，但方法体都是空。然后用真正的实现类去继承此中间类，需要用到哪个方法只需重写该方法即可**。

:::code-group
```java [实现类]
package MyPackage;

public class Javabean extends Adpat {
    public void method2(){
        super.method1();
        System.out.println("重写了method2");
    }
}

```
```java [Adpat中间类]
package MyPackage;

interface Inter{
    void method1();
    void method2();
    void method3();
    void method4();
    void method5();
    void method6();
    void method7();
//    ....
}

public class Adpat implements Inter {
    //全为空方法体
    @Override
    public void method1() {

    }

    @Override
    public void method2() {

    }

    @Override
    public void method3() {

    }

    @Override
    public void method4() {

    }

    @Override
    public void method5() {

    }

    @Override
    public void method6() {

    }

    @Override
    public void method7() {

    }
}

```
:::
### 继承


示例：

```java
class Parent {
    // 字段
    public String publicField = "Public Field";
    protected String protectedField = "Protected Field";
    String defaultField = "Default Field"; // 包私有
    private String privateField = "Private Field";

    // 方法
    public void publicMethod() {
        System.out.println("Public Method");
    }

    protected void protectedMethod() {
        System.out.println("Protected Method");
    }

    void defaultMethod() {
        System.out.println("Default Method");
    }

    private void privateMethod() {
        System.out.println("Private Method");
    }

    // Getter 用于间接访问 private 字段
    public String getPrivateField() {
        return privateField;
    }
}

class Child extends Parent {
    void accessParentMembers() {
        // 可直接访问的继承成员
        System.out.println(publicField);      // 继承 public 字段
        System.out.println(protectedField);   // 继承 protected 字段
        System.out.println(defaultField);    // 继承默认字段（同一包内）

        // 间接访问 private 字段
        System.out.println(getPrivateField()); // 通过父类方法访问

        // 调用继承的方法
        publicMethod();
        protectedMethod();
        defaultMethod();

        // 无法直接调用 privateMethod()
        // privateMethod(); // 编译错误！
    }
}

public class InheritanceTest {
    public static void main(String[] args) {
        Child child = new Child();
        child.accessParentMembers();
    }
}
```

#### 可继承

- public/protected属性或方法
- private属性或方法（子类不可直接访问或调用，可通过调用父类非private方法间接访问或调用）
- 默认（包私有）属性或方法（仅在同一包内的子类可继承调用）
#### 不可继承

- 构造方法（若父类定义了有参构造，子类构造方法必须通过 super() 调用父类构造方法）
- static属性或方法（但子类可以通过父类名直接访问） 


:::warning 注意
- java支持`单继承`（一个子类只能继承一个父类）和`多层继承`（A继承于B,B继承于C）,不支持多继承。
- java中所有的类都直接或间接继承于`Object类`，即一个类若没有显式继承其他类，则默认继承Object类。
- 若子类存在与父类同名属性，则会覆盖。
- 若子类存在与父类同名方法，则会**方法重写**（建议添加`@Override`注解进行语法校验）。此时子类方法权限需要大于父类，返回值类型需要小于父类。private/static方法不可被重写。
- 通过super访问父类方法或属性。
:::

### 多态

多态表示对象的多种形态，它的实现前提是**存在继承关系和方法重写且有父类引用指向子类对象**

多态的作用在于**当使用父类类型作为参数时，可以传递子类类型的对象**，其好处有：

- 新增子类不影响现有代码
- 通过父类接口统一处理不同子类对象
- 避免大量if-else或switch-case判断对象类型

```java
// 父类：动物
class Animal {
    // 父类方法
    public void makeSound() {
        System.out.println("动物发出声音");
    }
    
    // 父类特有的方法
    public void eat() {
        System.out.println("动物在吃东西");
    }
}

// 子类1：狗
class Dog extends Animal {
    // 重写父类方法
    @Override
    public void makeSound() {
        System.out.println("汪汪汪！");
    }
    
    // 子类特有的方法
    public void fetch() {
        System.out.println("狗在捡球");
    }
}

// 子类2：猫
class Cat extends Animal {
    // 重写父类方法
    @Override
    public void makeSound() {
        System.out.println("喵喵喵！");
    }
    
    // 子类特有的方法
    public void purr() {
        System.out.println("猫在打呼噜");
    }
}

// 多态测试类
public class PolymorphismExample {
    public static void main(String[] args) {
        // 多态示例1：父类引用指向子类对象
        Animal myAnimal;  // 父类引用
        
        myAnimal = new Dog();  // 指向Dog对象
        myAnimal.makeSound();  // 调用Dog类的makeSound()方法
        myAnimal.eat();       // 调用父类的eat()方法
        // myAnimal.fetch();  // 编译错误！无法访问子类特有方法
        
        System.out.println("------------------");
        
        myAnimal = new Cat();  // 现在指向Cat对象
        myAnimal.makeSound();  // 调用Cat类的makeSound()方法
        myAnimal.eat();       // 仍然调用父类的eat()方法
        // myAnimal.purr();   // 编译错误！无法访问子类特有方法
        
        System.out.println("------------------");
        
        // 多态示例2：使用方法参数实现多态
        animalSound(new Dog());
        animalSound(new Cat());
        
        System.out.println("------------------");
        
        // 多态示例3：数组中的多态
        Animal[] animals = {new Dog(), new Cat(), new Animal()};
        for (Animal animal : animals) {
            animal.makeSound();  // 根据实际对象类型调用相应方法
        }
    }
    
    // 方法参数为父类类型，可以接受任何子类对象
    public static void animalSound(Animal animal) {
        animal.makeSound();
        
        // 如果需要调用子类特有方法，需要向下转型
        if (animal instanceof Dog) {
            Dog dog = (Dog) animal;
            dog.fetch();
        } else if (animal instanceof Cat) {
            Cat cat = (Cat) animal;
            cat.purr();
        }
    }
}
```
:::warning  多态缺陷

多态的缺陷是`不能使用子类独有的功能`，但是可以通过**显式类型转换**转成子类类型，从而调用子类独有方法
```java
Person p = new Person();
Student s = (Student) p;
```
:::
### 包
Java 包（Package）是一种组织和管理 Java 类及相关资源的机制，主要作用包括：

- 命名空间管理：避免类名冲突（不同包中可以有相同类名）
- 访问控制：配合访问修饰符实现更细粒度的封装
- 模块化开发：将相关功能类组织在一起，便于维护
- 可读性和可维护性：清晰的包结构使项目更易于理解

#### 内置包
- java.lang（基础类，如 String、System，Runtime,Math，Object）
- java.util（工具类，ArrayList、日期时间等）
- java.io（输入输出）
- java.net（网络编程）
#### 创建包

包的命名规范

- 使用反向域名约定（如 com.example.myapp）
- 全小写字母，避免特殊字符
- 短而有意义（如 util 而非 utilities）

```java
// 文件：com/example/myapp/User.java
package com.example.myapp;  // 包声明必须第一行

public class User {
    private String name;
    
    public User(String name) {
        this.name = name;
    }
    
    public void greet() {
        System.out.println("Hello, " + name);
    }
}
```
:::warning
- 包名必须与文件系统的目录结构完全匹配

:::

#### 导入包中的类

```java
// 导入单个类
import com.example.myapp.User;

// 导入整个包（不推荐，可能引起命名冲突）
import com.example.myapp.*;

public class Main {
    public static void main(String[] args) {
        User user = new User("Alice");  // 使用导入的类
        user.greet();
    }
}
```

:::warning
- 使用同一个包内或者java.lang的类，不需要导包。否则当用到其他包的类时都需要导包
- 如果同时使用两个包中的同名类，则需要全类名（例如com.example.myapp.User）
:::

### 代码块

#### 局部代码块

通常定义在方法或语句中，**限制代码块中变量的作用域**，执行完后就内存释放掉了。

#### 构造代码块

在类中顶层位置定义，**每次对象实例化时会执行并且在构造方法调用之前执行**

#### 静态代码块

在构造代码块基础之上添加了static关键字，**当类加载时执行且只执行一次**。主要用于关于类的静态数据的初始化



:::code-group
```java [局部代码块]
public class NormalBlock {
    public static void main(String[] args) {
        // 局部代码块1
        {
            int x = 10;
            System.out.println("局部代码块1中的x: " + x);
        }
        
        // 这里不能访问x，因为x的作用域仅限于上面的代码块
        // System.out.println(x); // 编译错误
        
        // 局部代码块2
        {
            String message = "Hello";
            System.out.println("局部代码块2中的message: " + message);
        }
    }
}
```
```java [构造代码块]
public class InstanceBlock {
    // 构造代码块1
    {
        System.out.println("构造代码块1执行");
    }
    
    public InstanceBlock() {
        System.out.println("无参构造函数执行");
    }
    
    public InstanceBlock(String param) {
        System.out.println("有参构造函数执行，参数: " + param);
    }
    
    // 构造代码块2
    {
        System.out.println("构造代码块2执行");
    }
    
    public static void main(String[] args) {
        new InstanceBlock();
        System.out.println("--------");
        new InstanceBlock("Test");
    }
}
```
```java [静态代码块]
import java.util.ArrayList;
 class StaticBlock {
 
  static ArrayList list = new ArrayList();
  static {
    //初始化list数据， 只执行一次
    list.add("Hello");
    list.add("World");
  }

  public static void main(String[] args) {
    System.out.println("第一次创建对象:");
    new StaticBlock();

    System.out.println("--------");
    System.out.println("第二次创建对象:");
    new StaticBlock();
  }
}
```

### 内部类

内部类指在某个类A内部定义的类，此时A叫外部类。

`外部类要想访问内部类，必须创建外部类的对象，然后才能创建内部类对象去访问`。


#### 成员内部类

- 特性与外部类的成员类似，同样可以被public, private, protected，默认等修饰符修饰（但用static修饰时则变为了静态内部类，需要特殊区分）。
- JDK16之前不能定义静态变量，之后版本可以。
- 若外部类和内部类存在重名变量或方法，可通过`外部类名.this.成员属性/方法`访问外部类的成员属性或方法。

#### 静态内部类
- 只能直接访问外部类的static属性/方法
- 可以独立于外部类实例存在

#### 局部内部类
- 定义在方法内的类，类似于方法里面的局部变量
- 可以访问外部类的所有成员和方法内的局部变量
- 局部内部类只能被该方法在方法体中创建对象去调用

#### 匿名内部类（重要）

- 没有类名的内部类
- 通常用于**实现接口或继承类并创建实例**（可以写在成员位置或局部位置），一般是只使用一次的对象（避免需要先创建类）
- 
:::code-group
```java [成员内部类]
public class Test {
  //外部类的成员数据
  private String outerField = "Outer field";

  // 默认-成员内部类
  class InnerClass {
    void display() {
      System.out.println("Accessing outer field: " + outerField);
    }
  }
  //私有-成员内部类
  //不可被不属于当前外部类的其他类访问
  private class PrivateInnerClass {
    void display() {
      System.out.println("Accessing outer field: " + outerField);
    }
  }

  //在外部类内部封装获取内部类实例的方法
  PrivateInnerClass getInnerPrivateClass() {
    return new PrivateInnerClass();
  }


  public static void main(String[] args) {
    Test outer = new Test();
    //第一种:直接通过外部类对象调用成员属性的方式创建内部类对象
    Test.InnerClass inner = outer.new InnerClass();
    inner.display(); // 输出: Accessing outer field: Outer field
    //第二种:调用外部类对象的成员方法getInnerClass()创建私有内部类对象
    Test.PrivateInnerClass inner2 = outer.getInnerPrivateClass();
    inner2.display(); // 输出: Accessing outer field: Outer field
  }
}
```
```java [静态内部类]
public class OuterClass {
    private static String staticField = "Static field";
    private String instanceField = "Instance field";
    
    // 静态内部类
    static class StaticNestedClass {
        void display() {
            System.out.println("Accessing static field: " + staticField);
            // 无法访问instanceField
        }
    }
    
    public static void main(String[] args) {
        OuterClass.StaticNestedClass nested = new OuterClass.StaticNestedClass();
        nested.display(); // 输出: Accessing static field: Static field
    }
}
```
```java [局部内部类]
public class OuterClass {
    private String outerField = "Outer field";
    
    void method() {
        final String localVar = "Local variable";
        
        // 局部内部类
        class LocalInnerClass {
            void display() {
                System.out.println("Accessing outer field: " + outerField);
                System.out.println("Accessing local variable: " + localVar);
            }
        }
        
        LocalInnerClass local = new LocalInnerClass();
        local.display();
    }
    
    public static void main(String[] args) {
        OuterClass outer = new OuterClass();
        outer.method();
    }
}
```
```java [匿名内部类]
public class AnonymousClassDemo {
    interface Greeting {
        void greet();
    }
    
    public static void main(String[] args) {
        // 匿名内部类实现Greeting接口
        Greeting greeting = new Greeting() {
            @Override
            public void greet() {
                System.out.println("Hello from anonymous class!");
            }
        };
        
        greeting.greet(); // 输出: Hello from anonymous class!
        
        // 匿名内部类创建Thread
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("Thread running from anonymous class");
            }
        }).start();
    }
}
```
:::

## Object

**Java 中的所有类（包括数组）都是 Object 类的直接或间接子类。**

常用方法：

- equals()：用于比较两个对象之间的地址值是否一致，类似于==。如果想要比较对象的属性值则需重写。
- toString()：返回对象的字符串表示（默认输出 类名@地址值）。如果不想打印地址值则需重写。
- clone():创建并返回当前对象的**浅拷贝**（**一般需要重写，因为Object的clone方法为protected，不可直接调用**）。
```java
//clonable表示当前类的对象可被克隆，做类型检查用
class Person implements Cloneable {
    String name;
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone(); // 调用 Object 的 clone() 方法
    }
}
```

:::tip
- 想要实现深克隆，一般要重写clone方法或调用第三方工具类如gson
:::

## BigInteger
BigInteger是Java中用于表示任意精度整数的类,位于java.math包中。它解决了基本整数类型（如int、long）的范围限制问题，可以表示任意大小的整数（仅受内存限制）。

- 如果要表示的数字没有超出long的范围，则使用静态方法如：`BigInteger.valueOf(1234567890L)`
- 如果要表示的数字超出了long的范围，则使用构造方法如：`new BigInteger("12356565")`
- **不可变性**：相关计算操作均返回新对象

## BigDecima

它特别适用于较大的小数以及需要精确计算的场景，如财务计算、货币运算等，可以**避免浮点数运算中的精度问题**。
```java
// 从字符串构造（推荐方式，避免精度丢失）
BigDecimal bd1 = new BigDecimal("123.456");

// 从整数构造
BigDecimal bd2 = new BigDecimal(123);

// 从double构造（不推荐，可能有精度问题）
BigDecimal bd3 = new BigDecimal(123.456); // 可能得到意外值

// 使用valueOf静态方法，适用于不超过double取值范围的小数（内部实际调用String构造）
BigDecimal bd4 = BigDecimal.valueOf(123.456);
```  
## 正则表达式

示例：
```java
import java.util.regex.*;

public class EmailValidator {
    public static boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
    
    public static void main(String[] args) {
        String[] emails = {
            "user@example.com",
            "firstname.lastname@example.com",
            "user+tag@example.co.uk",
            "invalid.email@.com",
            "@no-local-part.com"
        };
        
        for (String email : emails) {
            System.out.println(email + " : " + (isValidEmail(email) ? "有效" : "无效"));
        }
    }
}
// 输出:
// user@example.com : 有效
// firstname.lastname@example.com : 有效
// user+tag@example.co.uk : 有效
// invalid.email@.com : 无效
// @no-local-part.com : 无效
```
## 时间API

从早期的 java.util.Date 和 java.util.Calendar，到 Java 8 引入的全新日期时间 API (java.time 包)
:::code-group
```java [旧版]
import java.util.Date;

public class OldDateExample {
    public static void main(String[] args) {
        Date now = new Date(); // 当前时间
        System.out.println("当前时间: " + now);
        
        // 格式化输出（需要 SimpleDateFormat）
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println("格式化后: " + sdf.format(now));
    }
}
```
```java [新版]
import java.time.*;

public class Main {
    public static void main(String[] args) {
        // 当前日期
        LocalDate today = LocalDate.now();
        System.out.println("今天日期: " + today); //今天日期: 2025-07-31

        // 当前时间
        LocalTime now = LocalTime.now();
        System.out.println("当前时间: " + now); //当前时间: 21:26:42.401004600

        // 当前日期时间
        LocalDateTime current = LocalDateTime.now();
        System.out.println("当前日期时间: " + current);//当前日期时间: 2025-07-31T21:26:42.401004600

        // 带时区的日期时间
        ZonedDateTime zonedDateTime = ZonedDateTime.now();
        System.out.println("带时区的日期时间: " + zonedDateTime);//带时区的日期时间: 2025-07-31T21:26:42.402002300+08:00[Asia/Shanghai]
        
    }
}
```

:::tip 最佳实践
- `新项目优先使用 Java 8 时间 AI：java.time` 包提供了更清晰、更强大的日期时间处理能力。

- 旧版API存在可读性较差（月份从0开始），线程不安全（Data可变）以及时区易错等问题。

- **避免使用 SimpleDateFormat**：使用 DateTimeFormatter 替代，它是线程安全的
:::

## 包装类

Java为基本数据类型提供了对应的包装类（Wrapper Classes），这些类位于java.lang包中，用于将基本数据类型封装为对象。包装类的主要作用包括：

- 将基本数据类型转换为对象
- 提供操作基本数据类型的方法
- 在集合ArrayList中使用（集合只能存储对象）

:::code-group

```java [创建包装类对象]
// 使用构造函数（已废弃，推荐使用valueOf）
Integer intObj1 = new Integer(10); // 不推荐

// 推荐使用valueOf方法
Integer intObj2 = Integer.valueOf(10);

// 自动装箱（Java 5+）
Integer intObj3 = 20;
```

```java [拆箱操作]
Integer intObj = Integer.valueOf(30);

// 手动拆箱
int primitiveInt = intObj.intValue();

// 自动拆箱（Java 5+）
int autoUnboxed = intObj;
```
:::

完整示例：

```java
public class WrapperExample {
    public static void main(String[] args) {
        // 自动装箱
        Integer age = 25;
        Double price = 99.99;
        
        // 自动拆箱
        int a = age;
        double p = price;
        
        // 字符串转换
        int num = Integer.parseInt("12345");
        String str = Integer.toString(num);
        
        // 比较
        Integer x = 1000;
        Integer y = 1000;
        System.out.println(x == y); // false
        System.out.println(x.equals(y)); // true
        
        // 缓存示例
        Integer m = 127;
        Integer n = 127;
        System.out.println(m == n); // true（使用缓存）
        
        // 注意事项：空指针
        try {
            Integer z = null;
            int value = z; // 抛出NullPointerException
        } catch (NullPointerException e) {
            System.out.println("不能对null拆箱");
        }
    }
}
```
:::warning 注意
- 缓存机制：Integer类缓存了-128到127之间的值，所以这个范围包装对象值都是相等的。超出缓存范围的比较应使用equals()而非==

- 频繁装箱拆箱会影响性能，在性能敏感场景应优先使用基本类型
:::
## Java GUI 

Java GUI（图形用户界面）主要包含 `AWT` 和 `Swing` 两大核心库，提供组件、容器、布局管理器及事件处理机制，支持开发者构建交互式**桌面应用程序**。

其中：

- **AWT（Abstract Window Toolkit）**：Java 最早的 GUI 库，依赖本地系统方法实现功能，与操作系统关联紧密，属于重量级控件。其组件类根类为 Component，容器类根类为 Container。

- **Swing**：基于 AWT 架构构建的轻量级 GUI 库，完全由 Java 实现，增强了代码移植性。其组件类根类为 JComponent，提供了更丰富的组件和更灵活的布局管理器。Swing 组件类名均以 "J" 开头，如 JButton、JFrame 等。

### API分类

#### 顶层容器
   JFrame：主窗口，包含标题栏、菜单栏等。

   JDialog：对话框，用于临时交互。
#### 中间容器
   JPanel：通用面板，用于分组组件。

   JScrollPane：带滚动条的面板，用于显示长内容。
#### 基本组件
   JButton：按钮。

   JLabel：标签（显示文本或图标）。

   JTextField：单行文本输入框。

   JTextArea：多行文本区域。

   JCheckBox：复选框。

   JRadioButton：单选按钮（需配合 ButtonGroup 使用）。

   JComboBox：下拉列表框。

   JTable：表格（显示二维数据）。 
#### 布局管理器
   FlowLayout：流式布局（从左到右排列）。

   BorderLayout：边框布局（东、南、西、北、中）。

   GridLayout：网格布局（行×列）。

   BoxLayout：垂直或水平排列。
####  事件监听器
   ActionListener：响应按钮点击、菜单选择等。

   MouseListener：响应鼠标事件（点击、移动等）。

   KeyListener：响应键盘事件。

基本示例：

```java
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class SimpleSwingExample {
    public static void main(String[] args) {
        // 1. 创建顶层窗口（JFrame）
        JFrame frame = new JFrame("Swing 示例");
        frame.setSize(400, 200); // 设置窗口大小
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); // 点击关闭按钮退出程序

        // 2. 创建中间容器（JPanel）并设置布局
        JPanel panel = new JPanel();
        panel.setLayout(new FlowLayout()); // 使用流式布局

        // 3. 创建组件
        JLabel label = new JLabel("请输入内容：");
        JTextField textField = new JTextField(15); // 宽度为15列
        JButton button = new JButton("点击显示");

        // 4. 添加组件到面板
        panel.add(label);
        panel.add(textField);
        panel.add(button);

        // 5. 为按钮添加事件监听器
        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String inputText = textField.getText(); // 获取文本框内容
                JOptionPane.showMessageDialog(frame, "你输入的内容是：" + inputText); // 弹出对话框显示内容
            }
        });

        // 6. 将面板添加到窗口
        frame.add(panel);

        // 7. 显示窗口
        frame.setVisible(true);
    }
}
```

:::warning 注意细节

- 绝对路径是从盘符（如C:\）开始，相对路径则相对的是当前项目
- 对于组件来说，先add的在上层显示，后add的在下层显示（有点反直觉）


:::
## 其他

- java内存分配：

  **堆内存**（new出来的对象，如数组和对象）；

  **栈内存**（基本数据类型和用于**函数运行时**（先入后出））；

  **方法区**（存放可运行的class文件）
