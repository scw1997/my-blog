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

- 数组的长度是固定的
```java
//写法1（动态初始化）
int[] arr = new int[5]; //定义一个长度为5的int数组，并未初始化值
// 默认初始化值根据类型确定，如int为0，double为0.0，boolean为false，char为'\u0000'（空字符）

//写法2（静态初始化）
int[] arr = {1,2,3,4,5}; //定义一个长度为5的int数组，并定义好各自的值
```

## 其他

- java内存分配：**堆内存**（new出来的对象，如数组和对象）；**栈内存**（基本数据类型和用于函数运行时）；**方法区**（存放可运行的class文件）
