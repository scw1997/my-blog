# Java Web （上）


## Maven

Maven是一个**Java项目构建工具（类似npm）**，可以自动管理依赖关系，统一项目结构（规定哪些文件放在哪里），自动化构建，生成文档，生成测试报告等等。


### 安装

1. 下载Maven安装包：https://maven.apache.org/download.cgi    ，选择Binary zip archive中的zip版本
2. （可选）配置本地仓库路径：修改Maven安装目录下的`conf/settings.xml`文件中的`<localRepository>`标签的值为自定义的仓库路径（绝对路径）。
```xml
<localRepository>C:\Program Files\apache-maven-3.9.16\local_lib</localRepository>
```
3. （可选）配置私服仓库路径：修改Maven安装目录下的`conf/settings.xml`文件中的`<mirrors>`标签的配置项。
```xml
<mirrors>
  <mirror>
    <id>alimaven</id>
    <name>Internal Nexus Repository</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf> <!-- 所有仓库请求都走这里 -->
  </mirror>
</mirrors>
```
4. 配置环境变量： 新建windows系统变量`MAVEN_HOME`，值为Maven安装目录。并且将`%MAVEN_HOME%\bin`添加到PATH环境变量中去。
5. 测试安装成功：在任意目录命令行下执行`mvn -v`命令，如果安装成功，会打印Maven的版本信息。



### 配置文件
`pom.xml`是Maven的配置文件（类似前端项目中的package.json）

```xml [pom.xml]
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <!-- 1. POM 模型版本（固定为 4.0.0） -->
    <modelVersion>4.0.0</modelVersion>

    <!-- 2. 项目坐标（GAV：唯一标识一个项目） -->
    <groupId>com.example</groupId>          <!-- 当前maven项目隶属组织/公司域名倒写（如com.scw） -->
    <artifactId>my-springboot-app</artifactId> <!-- 当前maven项目名称(maven项目的模块名) -->
    <version>1.0.0</version>                <!-- 当前maven项目版本号 -->
<!--<version>1.0.0-SNAPSHOT</version>-->    <!-- SNAPSHOT表示开发版本，功能不稳定；RELEASE表示用于发布的版本，功能稳定 -->
    <!-- 3. 打包方式 -->
    <packaging>jar</packaging>              <!-- jar（默认）、war、pom（多模块） -->

    <!-- 4. 项目基本信息（可选） -->
    <name>My Spring Boot Application</name>
    <description>A demo project for learning Maven</description>
    <url>https://example.com</url>

    <!-- 5. 继承父 POM（Spring Boot 项目常用） -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/> <!-- 默认从 Maven 仓库查找父 POM -->
    </parent>

    <!-- 6. 全局属性定义（用于统一管理版本、编码等） -->
    <properties>
        <java.version>17</java.version>     <!-- 指定 JDK 版本 -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <!-- 7. 依赖管理（核心！） -->
    <dependencies>
        <!-- Spring Boot Web Starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <!-- 注意：因为继承了 spring-boot-starter-parent，所以这里可以省略 version -->
        </dependency>

        <!-- spring-context -->
        <dependency>
            <!--依赖隶属组织/公司域名倒写-->
            <groupId>org.springframework</groupId>
            <!--依赖名称-->
            <artifactId>spring-context</artifactId>
            <!--依赖版本-->
            <version>6.1.20</version>
            <scope>compile</scope>  <!--编译、测试、运行都需要-->
            <!-- 可选择排除该依赖项下属的某个依赖项-->
            <exclusions>
                <exclusion>
                    <artifactId>spring-aop</artifactId>
                    <groupId>org.springframework</groupId>
                </exclusion>
            </exclusions>
        </dependency>

        <!-- MySQL 数据库驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope> <!-- 只在运行时需要 -->
        </dependency>

        <!-- 单元测试 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope> <!-- 仅测试时使用 -->
        </dependency>
    </dependencies>

    <!-- 8. 构建配置（插件、资源过滤等） -->
    <build>
        <plugins>
            <!-- Spring Boot Maven 插件：用于打包可执行 JAR -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>

            <!-- 编译插件（通常由父 POM 提供，这里可省略） -->
            <!--
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
            -->
        </plugins>
    </build>

</project>
```
:::tip 说明

- 依赖管理的scope属性值： `compile`（默认，编译、测试、运行都有效）， `test`（仅测试时有效（如 JUnit））， `runtime`（测试和运行时有效，编译不需要（如 JDBC 驱动））， `provided`（编译和测试有效，但运行时由容器提供（如 Servlet API））。
- Maven会优先寻找`本地仓库`（仓库路径需要手动指定）中的依赖jar包，如果没有找到，再去`私服仓库`（公司团队搭建的私有仓库，可选的，没有设置路径则直接去中央仓库）寻找。如果私服也没有，再去`中央仓库`（由Maven维护的全球唯一仓库）寻找下载到私服仓库（如有）再下载到本地仓库中。
- Maven全球唯一仓库地址：https://mvnrepository.com/
:::

### 生命周期

Maven 将整个构建流程抽象为三套相互独立的生命周期，每套生命周期由多个有序阶段（Phase）组成。

#### 1. Clean 生命周期

用于清理项目，删除上一次构建生成的文件（如 target/ 目录）。
主要阶段：
- pre-clean：执行清理前需要完成的工作
- `clean`：`删除 target/ 目录（最常用）（终端命令：mvn clean）`
- post-clean：执行清理后需要完成的工作

#### 2. Default 生命周期

这是 Maven 最核心、最常用的生命周期，负责项目的编译、测试、打包、部署等全过程。

| 阶段                | 作用                                                          |
|-------------------|-------------------------------------------------------------|
| validate          | 验证项目是否正确，所有必要信息是否可用                                         |
| initialize        | 初始化构建状态，例如设置属性或创建目录                                         |
| generate-sources  | 生成编译所需的源代码（如自动生成的代码）                                        |
| process-sources   | 处理源代码（如过滤资源文件）                                              |
| generate-resources | 生成打包所需的资源文件                                                 |
| process-resources | 复制并处理资源文件到输出目录                                              |
| `compile`         | `编译主源代码（如 src/main/java）输出class 文件（（终端命令：mvn compile）`      |
| process-classes   | 对编译后的字节码进行后处理（如字节码增强）                                       |
| generate-test-sources | 生成测试源代码                                                     |
| process-test-sources | 处理测试源代码                                                     |
| generate-test-resources | 生成测试资源                                                      |
| process-test-resources | 处理测试资源                                                      |
| test-compile      | 编译测试代码（如 src/test/java）                                     |
| `test`            | `运行单元测试（终端命令：mvn test）`                                     |
| `package`         | `将编译后的代码打包成jar包（终端命令：mvn package）`                          |
| verify            | 对包进行验证，确保质量达标                                               |
| `install`         | `将包安装到本地 Maven 仓库（通常默认为~/.m2/repository）（终端命令：mvn install）` |
| deploy            | 将包部署到远程仓库（如公司 Nexus）                                        


#### 3. Site 生命周期
用于生成项目文档和站点（如 API 文档、报告等）。
主要阶段：
- pre-site
- site：生成项目站点文档
- post-site
- site-deploy：将站点部署到服务器
> 使用较少，除非项目需要自动生成技术文档。

:::warning 注意
- 同一套生命周期内的任意阶段执行时，都会运行前面的阶段。如运行Default生命周期的`compile`阶段，会按顺序先运行`validate`、`initialize`、`generate-sources`、`process-sources`一直到`compile`
- 不同套的生命周期是互相独立的，互不影响的。如运行Default生命周期的`compile`阶段，则不会执行Clean生命周期的任意阶段
:::

### 单元测试

单元测试是测试软件中的最小可测试单元，主要用于测试方法、函数、类等。

#### 测试方法

- 白盒测试：清楚软件内部结构和代码逻辑，用于验证代码逻辑正确性。
- 黑盒测试：不清楚软件内部结构和代码逻辑，只验证软件的功能是否正常。
- 灰盒测试：结合了白盒和黑盒测试，同时验证软件功能和代码逻辑。

软件测试阶段：
```text
单元测试（白盒） > 集成测试（灰盒） > 系统测试（黑盒） > 验收测试（黑盒）
```

#### Junit

JUnit 是 Java 中最广泛使用的单元测试框架，用于对代码中的最小可测试单元（通常是方法）进行自动化验证。

1. 在 Maven 项目中，通常在 pom.xml 中添加如下依赖（以 JUnit 5 为例）：
```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
```
2. 在maven项目的src/test/java/com.xxx/目录下，编写测试类与测试方法
```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    @Test
    void testAdd() {
        Calculator calc = new Calculator();
        //junit提供的断言方法，断言实际结果与预期结果是否相等
        assertEquals(5, calc.add(2, 3));
    }
}
```
| 注解 | 说明 |
|------|------|
| `@Test` | 标记一个测试方法 |
| `@BeforeEach` | 每个测试方法执行前运行（类似 setUp） |
| `@AfterEach` | 每个测试方法执行后运行（类似 tearDown） |
| `@BeforeAll` | 所有测试方法执行前运行一次（静态方法） |
| `@AfterAll` | 所有测试方法执行后运行一次（静态方法） |


:::tip 测试方法要求
- 使用 `@Test` 注解标记；
- 方法必须是 `public void`，且无参数；
- 方法名应具有描述性，如 testAdditionWithPositiveNumbers()。
- 避免在测试中包含业务逻辑
:::

### 常见问题

#### 1. 依赖报红报错

原因：网络原因导致依赖中途下载失败或不完整

解决：通过执行名利`del /s *.lastUpdated` 批量递归删除本地缓存，重新下载依赖


## SpringBoot

通过idea创建SpringBoot项目

基本请求处理示例：

:::code-group
```java [内置启动类]
//src/main/java/com.xxx/SpringbootTestApplication.java
package com.scwmaven.springboottest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringbootTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootTestApplication.class, args);
    }

}

```
```java [自定义的请求处理类]
//src/main/java/com.xxx/HelloController.java
package com.scwmaven.springboottest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController //表示当前类是一个请求处理类
public class HelloController {
    @RequestMapping("/hello") //表示该方法处理url为/hello的请求
    public String hello(String name) {  // 参数name表示请求query参数
        System.out.println("hello world："+name);
        return "hello world："+name;
    }
    @RequestMapping("/request") //表示该方法处理url为/request的请求
    public String request(HttpServletRequest request) {     // 参数request表示请求数据的对象
        //获取请求方式
        String method = request.getMethod();
        //获取请求url
        String url = request.getRequestURL().toString();
        //获取请求参数
        String nameQuery = request.getParameter("name");
        //获取请求协议
        String protocol = request.getProtocol();
        return method + " " + url + " " + nameQuery+protocol;

    }
    @RequestMapping("/response") //表示该方法处理url为/response的请求
    public void response1(HttpServletResponse response) throws IOException {
        //设置响应状态码
        response.setStatus(HttpServletResponse.SC_OK);
        //设置响应头
        response.setHeader("name", "scw");
        //设置响应体
        response.getWriter().write("<h1>hello</h1>");
    }
    @RequestMapping("/response1") //表示该方法处理url为/response1的请求
    //ResponseEntity为SpringBoot内部提供的类型和API,支持链式调用
    public ResponseEntity<String> response1(){
        return ResponseEntity.status(200).header("name","scw").body("<h1>hello1</h1>");
    }
}
//调用启动类的main方法启动SpringBoot项目
//然后浏览器输入对应url调试，如http://localhost:8080/hello?name=scw
```
:::
:::tip 说明
- `@RestController`表示当前类是一个请求处理类，该类中所有方法返回的数据直接作为响应数据返回给调用方（如果返回数据为对象，则将`对象转为JSON`数据返回给调用方）
:::

### 三层架构

- **Controller**：控制层。用于接收请求，调用Service处理业务逻辑，并返回响应数据。
- **Service**：业务逻辑层。用于处理业务逻辑，调用DAO层获取数据
- **DAO**：数据访问层，也叫持久层。用于访问数据库（增删改查），获取数据

示例：根据用户ID获取用户信息

:::code-group
```java [Controller]
//获取用户信息并返回
@RestController
@RequestMapping("/users")
public class UserController {

    // 通过依赖注入获取业务层（Service层）对象实例
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        // 获取用户信息的具体业务逻辑交给Service曾去处理
        return userService.getUserById(id);
    }
}
```
```java [Service层]
@Service
public class UserService {

    // 注入数据访问层（DAO层）对象实例
    @Autowired
    private UserMapper userMapper;

    public User getUserById(Long id) {
        // 开始处理业务逻辑
        // 比如：这里可以加入一些业务判断，如果ID小于0则抛出异常等
        if (id <= 0) {
            throw new IllegalArgumentException("用户ID不合法");
        }
        // 数据库的相关操作交给DAO层
        return userMapper.findById(id);
    }
}
```
```java [DAO层]
@Mapper // 如果是 MyBatis 框架
public interface UserMapper {
    //具体的 SQL 可以在 XML 中写，或者用注解
    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(Long id);
}

```
:::

### 控制反转和依赖注入

在传统的 Java 开发中，如果 A 对象需要用到 B 对象，我们通常会在 A 的代码里手动 new B()。这意味**你主动去创建和管理所有对象，对象之间高度耦合**

`控制反转 (IOC)`：将对象的创建权和控制权，从程序员手中“反转”交给 Spring 容器（IoC 容器）来管理。

`依赖注入（DI）`：对象都交给 Spring 容器管理后，当一个对象（比如 Controller）需要用到另一个对象（比如 Service）时，Spring 容器就会自动把 Service 对象“传递”或“注入”给 Controller。


:::code-group
```java [传统方式]
@RestController
public class UserController {
    // 缺点：直接在代码里 new 对象，Controller 和 UserServiceImpl 强绑定
    // 如果想换成另一个 UserService 实现，必须修改这里的源码
    private UserService userService = new UserServiceImpl(); 

    @GetMapping("/user")
    public String getUser() {
        return userService.getUser();
    }
}
```
```java [IOC+DI方式]
// 1. 定义业务接口
public interface UserService {
    String getUser();
}

// 2. 业务实现类：加上 @Service 注解，告诉 Spring 这是一个需要管理的 Bean
@Service
public class UserServiceImpl implements UserService {
    @Override
    public String getUser() {
        return "张三";
    }
}

// 3. 控制层：加上 @RestController 注解，交给 Spring 管理
@RestController
public class UserController {
    // 依赖注入：不再手动 new，而是让 Spring 自动把 UserServiceImpl 的实例注入进来
    private final UserService userService;

    // 构造器注入（Spring 官方最推荐的方式）
    // Spring 4.3+ 版本后，如果类中只有一个构造器，@Autowired 可以省略
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public String getUser() {
        return userService.getUser();
    }
}
```
:::
SpringBoot中声明Bean类（即表示交给IOC容器管理）的注解：

- `@Controller`：只能用于Controller层
- `@Service`：只能用于Service层
- `@Repository`：只能用于DAO层
- `@Component`：可用于Service，Dao以及非三层架构的类，不可用于Controller层

> 给bean类设置名字，可通过`@Service("userService")`这样格式。没设置则默认为类名首字母小写


### 依赖注入的方式

#### 1. 构造器注入（推荐）
```java
@Service
public class OrderService {
    // 使用 final 关键字，保证依赖一旦注入就不可被修改
    private final UserService userService;
    private final PaymentService paymentService;

    // Spring 4.3 之后，如果类中只有一个构造器，@Autowired 可以省略
    //@AutoWired
    //构造函数
    public OrderService(UserService userService, PaymentService paymentService) {
        this.userService = userService;
        this.paymentService = paymentService;
    }
}
```

优点：

- **保证不可变性和线程和安全依赖**：依赖字段可以用 final 修饰
- **强制依赖明确**：对象在实例化时就必须提供所有必需的依赖
- **防止循环依赖**：如果是构造器注入的循环依赖（A依赖B，B依赖A），Spring 在启动时会直接报错
- **方便单元测试**

#### 2. Setter 注入（适用于可选依赖）

```java
@Service
public class OrderService {
    private EmailService emailService; // 可选依赖

    @Autowired(required = false) // 标注为可选，即使容器里没有这个 Bean 也不会报错
    //setter函数
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```
特点：它赋予了依赖在运行时被重新配置或替换的灵活性，但无法保证依赖的不可变性。


#### 3. 字段注入（不推荐）

```java
@Service
public class OrderService {
    @Autowired // 反模式！
    private UserService userService;
}
```

此种方式虽然写起来省事，但是它存在**隐藏了类之间依赖关系（没有构造函数，不清楚依赖哪些类），无法使用 final 修饰和单元测试极其困难**等缺陷。


:::warning 注意
- 声明Bean类的四大注解要想生效必须要被组件扫描注解`@ComponentScan`注解，不过SpringBoot的启动类注解`@SpringBootApplication`已包含了该注解。所以启动类文件不可被移动到其他路径，必须是service/controller/dao架构的父级路径（父包）
- 如果一个接口有多个实现类，Spring 不知道该注入哪一个时会报错。此时可以配合以下注解：

  `@Qualifier("beanName")`：指定具体的 Bean 名称进行精确注入。

  `@Primary`：在某个实现类上标注，将其设为默认首选。

  `@Resource(name=beanName)`：指定具体的 Bean 名称进行精确注入。
:::

