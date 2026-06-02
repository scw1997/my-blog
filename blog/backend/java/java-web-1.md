# Java Web


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
2. 在maven项目的src/test/java/com/xxx/目录下，编写测试类与测试方法
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

Spring Boot是基于 Spring 框架的快速开发脚手架。

通过idea创建SpringBoot项目

基本请求处理示例：

:::code-group
```java [内置启动类]
//src/main/java/com/xxx/SpringbootTestApplication.java
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
//src/main/java/com/xxx/HelloController.java
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
- `@RestController`表示当前类是一个请求处理类，该类中所有方法返回的数据直接作为响应数据返回给调用方（`@ResponseBody`）。如果返回数据为对象，则将`对象转为JSON`数据返回给调用方。
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

    //表示处理GET请求，url为/users/{id} 
    //同理还有PostMapping，PutMapping，DeleteMapping...
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

### Controller获取请求参数

根据场景不同，共有以下几种方式可供选择

:::code-group
```java [@PathVariable]
//此种方式适合用于获取 RESTful 风格 URL 中 {} 占位符的值。
// GET /users/1001/orders/2024
@GetMapping("/users/{userId}/orders/{orderId}")
public Order getOrder(
        @PathVariable Long userId,
       // 属性名和接收参数名不一样时
       // @PathVariable("orderId") String orderid)
        @PathVariable String orderId) {
    // userId = 1001, orderId = "2024"
}
```
```java [@RequestParam]
//此种方式适合用于获取 GET 请求的 query 参数（?key=value）。
// GET /users?page=1&size=10&keyword=张三
@GetMapping("/users")
public List<User> listUsers(
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "10") Integer size,
        @RequestParam(required = false) String keyword) {
    // 支持默认值、是否必填等配置（不设置则默认为必填，前端请求没传参数会报错）
}

//注意：如果请求的参数名和@RequestParam中接收的形参名一致，则可省略@RequestParam
// GET /users?page=1&size=10&keyword=张三
@GetMapping("/users")
public List<User> listUsers(
       Integer page,
        Integer size,
       String keyword) {
  // 支持默认值、是否必填等配置（不设置则默认为必填，前端请求没传参数会报错）
}

// 如果参数过多，可以将参数封装成一个实体类
public class UserQuery {
  private Integer page =1;
  private Integer size = 10;
  private String keyword;
}

//...
@GetMapping("/users")
public List<User> listUsers(UserQuery query) {}
```
```java [@RequestBody]
// 这种方式适合用于获取 POST 请求的JSON格式 body 参数。
// POST /users  Body: {"name":"张三","age":25}
@PostMapping("/users")
// 注意：此方式要求body的字段名和User的属性名一致
public User createUser(@RequestBody User user ) {
  // user.name = 张三, user.age = 25
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

### 配置文件

`YAML` 和 `Properties` 是 Spring Boot 支持的两种核心配置格式。


:::code-group
```yaml
# 配置文件路径：src/main/resources/application.yml

# ✅ YAML：层级清晰，一目了然
# 场景：嵌套层级
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    hikari:
      maximum-pool-size: 20 # 注意：数值前面必须添加空格
      minimum-idle: 5 # 注意：数值前面必须添加空格


# 场景：列表/数组配置
app:
  upload:
    allowed-extensions:
      - jpg
      - png
      - pdf
    max-sizes:
      - 10MB
      - 50MB
      - 100MB
```
```properties
# 配置文件路径：src/main/resources/application.properties


# ❌ Properties：前缀重复冗长，阅读时需自行脑补层级
# 场景：嵌套层级
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5


# 场景：列表/数组配置
# ❌ Properties：索引语法繁琐，增删元素需手动调整序号
app.upload.allowed-extensions[0]=jpg
app.upload.allowed-extensions[1]=png
app.upload.allowed-extensions[2]=pdf
app.upload.max-sizes[0]=10MB
app.upload.max-sizes[1]=50MB
app.upload.max-sizes[2]=100MB
```
:::

:::warning 注意

- 新项目推荐使用`yml（yaml）格式`，yml格式比properties格式更简洁
- yml格式中的字段值前面必须添加`空格`，否则会识别报错
- yml格式中的字段值以`0开头`的数值会被识别为八进制值，请修改为字符串类型。

:::

### 对比Spring MVC

Spring MVC 是 Spring Framework 的一个模块，用于构建 Web 应用。

Spring Boot 并不是 Spring MVC 的替代品，而是：
- 内置了 Spring MVC（通过 spring-boot-starter-web）；
- 自动配置了 DispatcherServlet、ViewResolver、MessageConverters 等组件；
- 无需手动写 web.xml 或 spring-mvc.xml。
>依赖关系：Spring Boot →（自动集成）→ Spring MVC →（依赖）→ Spring Core


| 维度 | Spring MVC（传统方式） | Spring Boot |
|------|------------------------|-------------|
| 配置方式 | 需手动配置 XML（如 `web.xml`, `spring-mvc.xml`）或 Java Config | 零配置：自动配置 + `application.properties/yml` |
| 服务器部署 | 需部署到外部 Tomcat、Jetty 等 Servlet 容器 | 内嵌 Tomcat/Jetty/Undertow，直接 `java -jar` 运行 |
| 依赖管理 | 需手动添加所有 JAR 包（Spring Core、MVC、AOP 等） | 通过 Starter 依赖（如 `spring-boot-starter-web`）一键引入全套 Web 支持 |
| 开发效率 | 配置繁琐，启动慢 | 快速启动，约定优于配置 |
| 适用场景 | 老项目维护、需要精细控制配置 | 新项目开发、微服务、快速原型 |


## JDBC

JDBC（Java Database Connectivity）是 Java 官方提供的一套统一数据库访问接口（API）。

在实际的企业级开发中，我们通常会使用 MyBatis、JPA（Hibernate）等成熟的框架来操作数据库，但这些框架的底层依然是`基于 JDBC` 封装的。

基本示例：

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class JdbcDemo {
    public static void main(String[] args) {
        // 数据库连接信息（包含时区、字符集等关键配置）
        String url = "jdbc:mysql://localhost:3306/your_database?serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4&useSSL=false";
        String username = "root";
        String password = "your_password";
        //        
        String sql = "SELECT id, username, email FROM users WHERE id > ?";

        // 使用 try-with-resources 自动管理资源（Connection, PreparedStatement, ResultSet）
        try (Connection conn = DriverManager.getConnection(url, username, password);
             // 创建 PreparedStatement使用预编译SQL
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            // 设置占位符（?）参数（索引从 1 开始）
            pstmt.setInt(1, 0);

            // 执行查询并获取结果集
            try (ResultSet rs = pstmt.executeQuery()) {
                // 遍历结果集
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String name = rs.getString("username");
                    String email = rs.getString("email");
                    System.out.println("ID: " + id + ", Name: " + name + ", Email: " + email);
                }
            }
        } catch (SQLException e) {
            // 捕获并处理 SQL 异常
            e.printStackTrace();
        }
        // 代码块结束后，rs, pstmt, conn 会被自动按顺序关闭
    }
}
```

:::warning 注意
- `永远使用数据库连接池`：数据库链接的创建和释放开销非常大，使用数据库连接池可以有效解决这个问题。
- `永远使用PreparedStatement（预编译），杜绝 SQL 注入，并且支持缓存性能更高`
  :::code-group

  ```java [静态SQL]
  // ⚠️ 危险示范：仅用于理解原理，生产环境绝对禁止！
  String username = "admin' OR '1'='1"; // 模拟恶意用户输入
  String sql = "SELECT * FROM users WHERE username = '" + username + "'";
  
  try (Connection conn = DriverManager.getConnection(url, user, pwd);
  Statement stmt = conn.createStatement();
  ResultSet rs = stmt.executeQuery(sql)) { // 每次执行都重新编译
      while (rs.next()) {
          System.out.println(rs.getString("username"));
      }
  }
  // 最终执行的SQL变成了: SELECT * FROM users WHERE username = 'admin' OR '1'='1'
  // 数据库将其解析为可执行命令，导致所有用户数据被查出
  ```
  ```java [预编译SQL]
  // ✅ 安全示范：推荐的标准写法
  String username = "admin' OR '1'='1"; // 同样的恶意输入
  String sql = "SELECT * FROM users WHERE username = ?"; // SQL结构固定，?是占位符
  
  try (Connection conn = DriverManager.getConnection(url, user, pwd);
  PreparedStatement pstmt = conn.prepareStatement(sql)) { // 发送SQL到数据库预编译
  
      pstmt.setString(1, username); // 参数作为纯数据绑定，不参与SQL解析
      try (ResultSet rs = pstmt.executeQuery()) {
          while (rs.next()) {
              System.out.println(rs.getString("username"));
          }
      }
  }
  // 数据库将 'admin' OR '1'='1' 视为一个完整的字符串值去匹配
  // 不会解析为SQL命令，彻底杜绝注入；且相同结构的SQL可复用执行计划
  ```
  :::



## MyBatis

MyBatis 是一款优秀的`持久层（DAO层）`框架，它避免了几乎所有的 JDBC 代码和设置参数、获取结果集的过程。用于`简化JDBC`的开发

### 准备工作

1. 使用Idea创建SpringBoot项目，并勾选`Mybatis FrameWork`和`Mysql Driver`等依赖
2. 配置src/main/resources/application.properties文件,添加如下数据库配置内容：
```properties
# 配置数据库链接信息
spring.datasource.url=jdbc:mysql://localhost:3306/[数据库名称]
spring.datasource.username=root
spring.datasource.password=[密码]
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# 配置 MyBatis 的日志输出（可选）
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

### 基本使用

需求：查询数据库中所有的用户数据

:::code-group
```java [User实体类]
//src/main/java/com/xxx/user/User.java
package com.scw.user;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor

public class User {
  private Integer id;
  private String name;
  private String password;
  private String email;
  private Integer age;
  private Gender gender;
  private String created_at;
  private String updated_at;

}

```
```java [User Controller]
//src/main/java/com/xxx/controller/UserController.java
package com.scw.controller;

import com.scw.bean.RequestRes;
import com.scw.bean.User;
import com.scw.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//设置处理请求的url公共路径
@RequestMapping("/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public RequestRes getUserList() {
    List<User> data =  userService.getUserList();

    return RequestRes.success(data);
  }
  //表示处理url地址为/users/delete
  @PostMapping("/delete")
  public RequestRes deleteUser(@RequestBody User user) {
    //注意：如果前端传的id是字符串数字"1",这里就不会拦截报错，直接转换为int
    Integer id = user.getId();
    // 通过CollectionUtils.isEmpty()可以对字段进行空值校验（同时校验null和空集合）
    //等价于 xxx==null  || xxx.size()==0
    if(id==null){
      return RequestRes.error("id不能为空",-1);
    }
    userService.deleteUser(user.getId());
    return RequestRes.success();
  }
  @PostMapping("/add")
  public RequestRes addUser(@RequestBody User user) {
    int gender = user.getGender();
    if(gender!=0 && gender!=1){
      return RequestRes.error("性别错误",-1);
    }
    userService.addUser(user);
    return RequestRes.success();
  }
  @PostMapping("/update")
  public RequestRes updateUser(@RequestBody  User user) {
    //注意：如果前端传的id是字符串数字"1",这里就不会拦截报错，直接转换为Integer
    Integer id = user.getId();
    int gender = user.getGender();
    
    if(id==null){
      return RequestRes.error("id不能为空",-1);
    }
    if(gender!=0 && gender!=1){
      return RequestRes.error("性别错误",-1);
    }
    userService.updateUser(user);
    return RequestRes.success();

  }
  @GetMapping("/get")
  public RequestRes getUserByIdAndName(Integer id, String name) {
    User data =  userService.getUserByIdAndName(id,name);
    return RequestRes.success(data);
  }
}

```
```java [User Service]
//src/main/java/com/xxx/service/UserService.java
package com.scw.service;

import com.scw.bean.User;
import com.scw.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService  {
    private final UserMapper userMapper;
    //依赖注入
    public UserService(UserMapper userMapper){
        this.userMapper = userMapper;
    }

    public List<User> getUserList() {
        return  userMapper.finAllUser();
    }
    public void deleteUser(Integer id) {
        userMapper.deleteUserById(id);
    }
    public void addUser(User user) {
        userMapper.addUser(user);
    }
    public void updateUser(User user) {
        userMapper.updateUser(user);
    }
    public User getUserByIdAndName(Integer id, String name) {
        return  userMapper.findUserByIdAndName(id,name);
    }
}

```
```java [Mapper层查询数据库的接口类]
//src/main/java/com/xxx/mapper/UserMapper.java
package com.scw.mapper;

import com.scw.user.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

//程序运行时会自动创建UserMapper接口的实现类对象实例（代理对象），并自动注入到IOC容器中
@Mapper //
public interface UserMapper {
  @Select("select * from users")
  public List<User> finAllUser();

  @Delete("delete from users where id=#{id}")
  public void deleteUserById(Integer id);

  //这里的各个参数取的是传递过来的user对象的对应key的属性值
  //@Options用于告诉MyBatis，插入数据后，将主键值回填到user对象中（即作为方法的返回值），keyProperty指定回填的属性名
  @Options(useGeneratedKeys = true, keyProperty = "id")
  @Insert("insert into users(name,password,email,age,gender) values (#{name},#{password},#{email},#{age},#{gender})")
  public void addUser(User user);

  //这里的各个参数取的是传递过来的user对象的对应key的属性值
  @Update("update users set name=#{name},password=#{password},email=#{email},age=#{age},gender=#{gender} where id=#{id}")
  public void updateUser(User user);

  //通过id和name查询用户
  @Select("select * from users where id=#{id} and name=#{name}")
  //需要传递多个参数的情况下，这里通过@Param给参数命名用于匹配
  //public User findUserByIdAndName(@Param("id") Integer id, @Param("name") String name);
  
  //如果是基于SpringBoot官方骨架的项目，则不需要添加@Param,编译时会保留形参名
  public User findUserByIdAndName(Integer id, String name);
}


```

```java [全局JSON序列化异常捕捉类]
//src/main/java/com/xxx/controller/GlobalExceptionHandler.java
package com.scw.controller;

import com.scw.bean.RequestRes;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

//添加此注解则会自动全局生效，捕获Controller层的JSON序列化异常（捕捉后不会进入Controller层业务代码）
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public RequestRes handleJsonParseError(HttpMessageNotReadableException ex) {
//        String message = ex.getMessage();
    return RequestRes.error("请求参数格式错误: " + ex.getMostSpecificCause().getMessage(), -1);
  }
}


```
```java [测试类]
//src/test/java/com/xxx/mapper/xxxApplicationTests.java

package com.scw;

import com.scw.mapper.UserMapper;
import com.scw.user.Gender;
import com.scw.user.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class MybatisTestApplicationTests {
  private final UserMapper userMapper;
  //依赖注入
  @Autowired
  public MybatisTestApplicationTests(UserMapper userMapper) {
    this.userMapper = userMapper;
  }
  @Test
  public void testFindAllUser() {
    List<User> userList = userMapper.finAllUser();
    userList.forEach(System.out::println);
  }
  @Test
  public void testDeleteUser(Integer id) {
    userMapper.deleteUserById(id);
  }
  @Test
  public void addUser() {
    User user = new User(null,"scw3","123456","test@qq.com",18, Gender.FEMALE,null,null);
    userMapper.addUser(user);
  }
  @Test
  public void updateUser() {
    User user = new User(3,"scw3333","1234563333","test@qq.com",18, Gender.FEMALE,null,null);
    userMapper.updateUser(user);
  }
  @Test
  public void getUserByIdAndName() {
    User user = userMapper.findUserByIdAndName(3,"scw3333");
    System.out.println(user);
  }

}


```
:::


:::warning 注意
- MyBatis中DAO层文件夹名称建议使用`mapper`
- MyBatis中关于实体类Enum（如MALE/FEMALE）与数据库数据类型（0|1）的映射转换问题解决：
  ```properties
  # src/main/resources/application.properties
  
  # 例如实体类中某个字段类型为Gender（MALE,FEMALE），数据库中存储的是0|1
  # MyBatis 默认使用 EnumTypeHandler 来处理枚举映射，它的策略是 按枚举名称匹配（即数据库存的是 "MALE" → 匹配 Gender.MALE）就会匹配不上

  # 配置 MyBatis 枚举类型为按序号映射
  mybatis.configuration.default-enum-type-handler=org.apache.ibatis.type.EnumOrdinalTypeHandler
  ```
- `MyBatis中SQL参数永远使用#{...}而不是${...}`。前者的内容会被替换`?`并生成预编译SQL，而后者会直接拼接SQL，可能会导致SQL注入漏洞。  
- MyBatis中SQL中如果在`引号里（如like '%${name}%'）使用了#{}被替换成?`，那么直接变成了字符串形式的`?`则后续占位符参数无法匹配，此时需要使用`concat` 函数拼接字符串。
  ```sql
  -- 错误
  SELECT * FROM t_user WHERE name LIKE '%${name}%'
  -- 正确
  SELECT * FROM t_user WHERE name LIKE concat('%',#{name},'%')
  ```
- 当实体类字段（通常为驼峰命名 userName）与数据库列名（通常为下划线命名 user_name）不一致时，MyBatis 无法自动完成映射，导致查询结果中对应字段为 null，解决方案(任选一种)：

  :::code-group
  ```sql [1.sql使用as别名]
   SELECT user_name AS userName, 
             create_time AS createTime
      FROM t_user 
      WHERE id = #{id}
  ```
  ```java [2.使用@Results注解]
  @Select("SELECT u_nm, crt_tm FROM t_user WHERE id = #{id}")
  @Results({
      @Result(column = "u_nm", property = "userName"),
      @Result(column = "crt_tm", property = "createTime")
  })
  User selectUser(Long id);
  ```
  
  ```yml [3.开启自动映射]
  # application.yml (Spring Boot)
  # 注意：仅限于 user_name ↔ userName 这种标准的下划线转驼峰关系
  mybatis:
    configuration:
      map-underscore-to-camel-case: true
  ```
  :::


### 数据库连接池

数据库连接池是个负责分配，管理数据库链接的容器，基于标准`DataSource`接口。

> SpringBoot默认使用`Hikari`数据库连接池，无需配置

作用：

- 它允许应用程序重复使用一个现有的数据库链接，而不是新建一个，有效提升访问效率。
- 释放空闲时间超过最大空闲时间的链接，避免因为没有释放而引起的数据库链接遗漏


示例：在SpringBoot中配置`Druid`数据库连接池

:::code-group
```xml [添加依赖]
<!--pom.xml-->
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>druid-spring-boot-starter</artifactId>
  <version>1.1.21</version>
</dependency>
```
```properties [修改mybatis配置文件]
# 配置文件路径：src/main/resources/application.properties


# 切换数据库连接池
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
```
:::

### XML映射配置

MyBatis 的 XML 映射文件是其核心灵魂，它将`SQL 语句与 Java 方法解耦`，提供了比注解更强大的动态 SQL 能力和结果集映射灵活性。

XML文件规则：
:::tip 规则
- XML文件名称与Mapper接口名称一致，并且放置`相同包`下
- XML文件的`namespace`属性与Mapper接口的全限定名一致
- XML文件中的SQL语句的`id`与Mapper接口方法名以及返回类型一致
:::

示例：

:::code-group
```xml [XML映射配置文件]
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!--src/main/resources/com/scw/mapper/UserMapper.xml-->
<!--nampespace值为对应接口类的路径-->
<mapper namespace="com.scw.mapper.UserMapper">
    <select id="finAllUser" resultType="com.scw.user.User">
        select * from users
    </select>
    <delete id="deleteUserById">
        delete from users where id=#{id}
    </delete>
    <insert id="addUser">
        insert into users(name,password,email,age,gender) values (#{name},#{password},#{email},#{age},#{gender})
    </insert>
    <update id="updateUser">
        update users set name=#{name},password=#{password},email=#{email},age=#{age},gender=#{gender} where id=#{id}
    </update>
</mapper>
```
```java [Mapper接口]
//src/main/java/com/scw/mapper/UserMapper.java
package com.scw.mapper;

import com.scw.user.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

//程序运行时会自动创建UserMapper接口的实现类对象实例（代理对象），并自动注入到IOC容器中
@Mapper //
public interface UserMapper {
    //注释掉此注解，与XML映射文件只能二选一
    //@Select("select * from users")
    public List<User> finAllUser();

    //注释掉此注解，与XML映射文件只能二选一
    //@Delete("delete from users where id=#{id}")
    public void deleteUserById(Integer id);

    //注释掉此注解，与XML映射文件只能二选一
    //@Insert("insert into users(name,password,email,age,gender) values (#{name},#{password},#{email},#{age},#{gender})")
    public void addUser(User user);

    //注释掉此注解，与XML映射文件只能二选一
//    @Update("update users set name=#{name},password=#{password},email=#{email},age=#{age},gender=#{gender} where id=#{id}")
    public void updateUser(User user);

    //注释掉此注解，与XML映射文件只能二选一
    //@Select("select * from users where id=#{id} and name=#{name}")
    public User findUserByIdAndName(Integer id, String name);
}

```
:::

可通过修改SpringBoot配置来修改默认XML映射配置文件的路径（例如不想跟mapper接口在同一个包下，或者想把XML映射文件放在其他地方），示例如下：
```properties
# 配置文件路径：src/main/resources/application.properties

mybatis.mapper-locations=classpath:com/scw/mapper/*.xml
```

> 推荐IDEA插件：MyBatisX（用于XML映射文件和Mapper接口的快速跳转）


### 动态SQL
MyBatis 的动态 SQL 是其最强大的特性之一，它允许你根据传入参数的值，在`运行时动态拼接 SQL 语句`。这彻底解决了传统 JDBC 中手动拼接字符串带来的繁琐与安全风险。


:::code-group
```sql [if]
-- 用于按需拼接 WHERE 子句或 SET 字段。
<select id="searchUsers" resultType="User">
    SELECT * FROM users
    WHERE status = 'ACTIVE'
    <if test="name != null and name != ''">
        AND name LIKE CONCAT('%', #{name}, '%')
    </if>
    <if test="email != null">
        AND email = #{email}
    </if>
</select>
```
```sql [where]
-- 解决 <if> 拼接时多余的 AND/OR 问题。
-- 当内部有内容时才生成 WHERE 关键字，并自动去除开头的 AND/OR。
<select id="findOrders" resultType="Order">
    SELECT * FROM orders
    <where>
        <if test="userId != null">AND user_id = #{userId}</if>
        <if test="status != null">AND status = #{status}</if>
        <if test="startDate != null">AND created_at >= #{startDate}</if>
    </where>
</select>
```
```sql [set]
-- 用于 UPDATE 语句，自动处理末尾多余的逗号，且只更新非空字段。
<update id="updateUser">
    UPDATE users
    <set>
        <if test="name != null">name = #{name},</if>
        <if test="email != null">email = #{email},</if>
        <if test="phone != null">phone = #{phone},</if>
        updated_at = NOW()  <!-- 固定更新的字段放在最后，无需逗号 -->
    </set>
    WHERE id = #{id}
</update>
```
```sql [choose]
-- 等价于 Java 的 switch-case，只会命中一个分支。
<select id="sortBy" resultType="Product">
    SELECT * FROM products
    ORDER BY
    <choose>
        <when test="sortField == 'price'">price ASC</when>
        <when test="sortField == 'sales'">sales_count DESC</when>
        <otherwise>created_at DESC</otherwise>
    </choose>
</select>
```
```sql [foreach]
-- 常用于 IN 查询和批量插入/更新。
<!-- IN 查询 -->
<select id="findByIds" resultType="User">
    SELECT * FROM users
    WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>

<!-- 批量插入 -->
<insert id="batchInsert">
    INSERT INTO users (name, email) VALUES
    <foreach collection="list" item="user" separator=",">
        (#{user.name}, #{user.email})
    </foreach>
</insert>
```
```sql [bind]
-- 将 OGNL 表达式的结果绑定为变量，避免重复计算
<select id="fuzzySearch" resultType="User">
    <bind name="pattern" value="'%' + keyword + '%'" />
    SELECT * FROM users WHERE name LIKE #{pattern}
</select>

```
:::

:::warning 动态sql注意事项

-  对于数值类型（Integer/Long），判断空值只需判断 != null；对于 String 类型，则务必加上 `!= ''` 检查
  ```sql
  <!-- ❌ 危险：如果 name 是空字符串 ""，仍会拼入 SQL -->
  <if test="name != null">
  
  <!-- ✅ 安全：同时排除 null 和空字符串 -->
  <if test="name != null and name != ''">
  ```
- `<where>` 去除OR 开头的坑：
    ```sql
    <!-- ⚠️ 如果只有第二个 if 命中，生成: WHERE OR status = ? （语法错误）-->
    <where>
        <if test="name != null">name = #{name}</if>
        <if test="status != null">OR status = #{status}</if>
    </where>
    
    ```
:::




### 日志

#### Java内置日志系统（JUL）

日志信息级别从高到低为：**SEVERE > WARNING > INFO > CONFIG > FINE > FINER > FINEST**

:::code-group
```java [基本使用]

import java.util.logging.Logger;
import java.util.logging.Level;

public class Main {
    //创建一个日志记录器，命名可选择类名或包名
    private static final Logger logger = Logger.getLogger(Main.class.getName());//或com.xx.xxx

    public  static void main(String[] args) {
        logger.log(Level.SEVERE,"Starting operation...");
        try {
            // some logic
        } catch (Exception e) {
            //默认情况下，日志输出级别为INFO。所以SEVERE,WARNING，INFO才会输出信息，其他不会输出
            logger.warning("Operation failed");
            logger.severe("Operation failed");
            logger.info("Operation failed");
        }
    }
}
```
```java [调整日志级别]
import java.util.logging.*;

public class Main {
    public static void main(String[] args) {
        Logger logger = Logger.getLogger(Main.class.getName());

        // 获取控制台处理器（ConsoleHandler）
        ConsoleHandler handler = new ConsoleHandler();
        handler.setLevel(Level.FINE); // 设置处理器级别为 FINE

        // 设置 Logger 的级别
        logger.setLevel(Level.FINE);

        // 移除默认的 handler
        logger.setUseParentHandlers(false);
        logger.addHandler(handler);

        // 测试日志
        logger.info("INFO 日志");
        logger.fine("FINE 日志");     // 现在FINE级别消息也会打印了！
        logger.finer("FINER 日志");
    }
}
```
:::

:::tip 技巧
- 修改日志级别时，必须同时设置 Logger 和 Handler 的级别才能生效。
- 开发阶段可设置日志级别为`FINE`(替换System.out.print)，便于调试。生产环境则设置为`INFO` 或 `WARNING`。
  :::

#### SLF4J + Logback(主流推荐)

SLF4J + Logback 是 Java 生态中事实上的日志标准组合。理解它们的关系是正确使用的前提：

`SLF4J`：日志门面（Facade），只定义 API，不实现任何日志功能。

`Logback`：日志实现（Implementation），由 SLF4J 作者亲自开发，天生无缝对接。

日志级别从低到高：**TRACE < DEBUG < INFO < WARN < ERROR < FATAL**

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserService {
  //声明 Logger
  // ✅ 推荐：使用当前类作为 logger 名称
  private static final Logger log = LoggerFactory.getLogger(UserService.class);
  //Lombok 用户可直接用 @Slf4j 注解替代上面两行
  
  //日志级别与输出
  log.trace("方法入参: userId={}", userId);      // 最细粒度调试，使用较少
  log.debug("查询结果: {}", result);             // 开发调试
  log.info("用户创建成功: userId={}", userId);   // 关键业务流程
  log.warn("缓存未命中, 降级查库: key={}", key); // 潜在问题
  log.error("订单支付失败: orderId={}", orderId, e); // 异常+堆栈
}
```
:::warning 注意
- 核心原则：代码中永远只依赖 SLF4J API，绝不直接引用 Logback 类。这样未来切换实现（如换到 Log4j2）时，业务代码零修改。
- Spring Boot Starter Web 已内置 spring-boot-starter-logging（包含 SLF4J + Logback），无需额外添加
  :::

#### logback配置文件

Spring Boot 推荐使用`logback-spring.xml`（而非 logback.xml），以支持 `<springProfile>` 等扩展标签

配置模板示例（以Spring Boot项目为例）

```xml
<!--src/main/resources/logback-spring.xml-->
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <!-- 引用 Spring Boot 默认配置（包含 CONSOLE_LOG_PATTERN 等变量） -->
  <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

  <property name="LOG_PATH" value="./logs"/>
  <property name="APP_NAME" value="my-service"/>

  <!-- 设置日志通过控制台输出（开发环境） -->
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <!--设置日志输出的格式：%d表示时间，%thread表示线程名，%-5level表示日志级别（使用5位宽度），%logger{36}表示日志记录器的名称（最多显示36位，超过则自动简化），%msg表示日志消息，%n表示换行符 -->         -->
      <pattern> %d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
      <!--            <pattern>${CONSOLE_LOG_PATTERN}</pattern>-->
    </encoder>
  </appender>

  <!-- 设置日志通过文件输出 + 滚动策略 -->
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>${LOG_PATH}/${APP_NAME}.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
      <!-- 设置日志文件名格式，%d{yyyy-MM-dd}表示按天滚动，%i表示日志文件编号 -->
      <fileNamePattern>${LOG_PATH}/${APP_NAME}.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
      <maxFileSize>100MB</maxFileSize>      <!-- 单文件上限，超过则滚动到新文件 -->
      <maxHistory>30</maxHistory>           <!-- 保留天数 -->
      <totalSizeCap>10GB</totalSizeCap>     <!-- 总大小上限 -->
    </rollingPolicy>
    <encoder>
      <pattern>${FILE_LOG_PATTERN}</pattern>
    </encoder>
  </appender>

  <!-- 异步写入（生产必配，避免IO阻塞业务线程） -->
  <appender name="ASYNC_FILE" class="ch.qos.logback.classic.AsyncAppender">
    <queueSize>1024</queueSize>
    <discardingThreshold>0</discardingThreshold> <!-- 队列满时不丢弃 -->
    <neverBlock>true</neverBlock>                <!-- 永不阻塞调用线程 -->
    <appender-ref ref="FILE"/>
  </appender>

  <!-- 按环境区分日志配置 -->
  <!--  开发环境-->
  <springProfile name="dev">
    <!--  设置日志级别（大于等于此级别的日志才会被输出）    -->
    <root level="INFO">
      <appender-ref ref="STDOUT"/>
    </root>
  </springProfile>
  <!--  生产环境-->
  <springProfile name="prod">
    <!--  设置日志级别（大于等于此级别的日志才会被输出）    -->
    <root level="INFO">
      <!-- 引用上面的通过异步写入输出的配置         -->
      <appender-ref ref="ASYNC_FILE"/>
    </root>
    <!-- 降低框架噪音 -->
    <logger name="org.springframework" level="WARN"/>
    <logger name="com.zaxxer.hikari" level="WARN"/>
  </springProfile>
</configuration>
```
配置日志模板后还需在application.yml中`激活profile环境`
```yaml 
# src/main/resources/application.yml
spring :
  profiles:
    active: dev
```
:::warning 日志使用注意
- **禁止字符串拼接（应使用占位符代替）**，如：`log.info("用户创建成功: userId={}", userId);`）：使用了字符串则无论当前日志级别是否开启都会执行字符串拼接，导致性能下降
- **异常日志不要使用toString()**：此举会丢失堆栈信息，并且 异常对象必须作为最后一个独立参数（如：`log.error("订单支付失败: orderId={}", orderId, e);`）
- **生产环境必须用 `AsyncAppender`**
  :::
