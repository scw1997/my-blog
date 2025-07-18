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

## 类

### javabean类

javabean类，用来描述某一事物的类，有特定的实现规范，例如

- 实例变量都转为私有变量，并提供相应的getter和setter方法
- 构造方法重载

基本示例：

:::code-group
```java [Test类]
public class Test {
  public static void main(String[] args) {
    Phone myPhone = new Phone();x
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

- `private`表示私有属性或方法，只能在类内部访问，不能被实例化对象访问
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



### static（静态变量和静态方法）

- 静态方法可以被类本身静态调用，也可以**被实例化对象调用（不推荐，编译器会转为静态调用，增加解析成本）**
- 静态方法只能访问静态属性和静态方法
- 非静态方法可以访问非静态属性和非静态方法，也可以访问静态属性和静态方法（此时静态属性和方法也可通过this调用）
- 静态方法没有this关键字


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

- 构造方法（子类构造方法必须通过 super() 调用父类构造方法）
- static属性或方法（但子类可以通过父类名直接访问） 


:::warning 注意
- java支持`单继承`（一个子类只能继承一个父类）和`多层继承`（A继承于B,B继承于C）,不支持多继承。
- java中所有的类都直接或间接继承于`Object类`，即一个类若没有显式继承其他类，则默认继承Object类。
- 若子类存在与父类同名属性/方法，则会**重写覆盖**。通过super访问父类方法或属性
:::

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

## 集合

集合相比于数组，它的**长度是不固定**的。添加删除元素，则其长度也会随之变化

基本示例：

```java
import java.util.ArrayList;

public class helloworld {
  public  static void main(String[] args) {
      ArrayList list = new ArrayList();
      //添加元素
      list.add("Hello");
      list.add("World");
      list.add(new int[]{1, 2, 3, 4});
      System.out.println(list); // [Hello, World, [I@4eec7777]

      //删除元素（元素/索引）
      boolean isDel = list.remove("Hello");
      System.out.println(isDel); //true
      Object deleteItem = list.remove(0);
      System.out.println(deleteItem); // World


      //获取元素
      Object item = list.get(0);
      System.out.println(item); // [I@4eec7777

      //修改元素
      list.set(0,"WWE");
      System.out.println(list); //[WWE]

      //获取长度
      System.out.println(list.size()); //1

  }
}
```

集合的元素**默认只能是引用类型（字符串，对象，数组）**，若要使用基本类型，则需要用**基本类型对应的包装类**：

```java
import java.util.ArrayList;

public class helloworld {
  public  static void main(String[] args) {
    //int的包装类为Integer
    ArrayList<Integer> list1 = new ArrayList<>();
    list1.add(1);

    // boolean的包装类为Boolean
    ArrayList<Boolean> list2 = new ArrayList<>();
    list2.add(true);

    //char的包装类为Char
    ArrayList<Character> list3 = new ArrayList<>();
    list3.add('a');
    //double的包装类为Double
    ArrayList<Double> list4 = new ArrayList<>();
    list4.add(1.0);

    //short的包装类为Short
    ArrayList<Short> list5 = new ArrayList<>();
    short a = 1;
    list5.add(a);


  }
}
```

## 其他

- java内存分配：

  **堆内存**（new出来的对象，如数组和对象）；

  **栈内存**（基本数据类型和用于**函数运行时**（先入后出））；

  **方法区**（存放可运行的class文件）
- 
