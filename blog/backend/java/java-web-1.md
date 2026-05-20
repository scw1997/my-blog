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
    <groupId>com.example</groupId>          <!-- 组织/公司域名倒写 -->
    <artifactId>my-springboot-app</artifactId> <!-- 项目名称 -->
    <version>1.0.0</version>                <!-- 版本号 -->

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

- 依赖管理的scope属性值： `compile`（默认，编译、测试、运行都有效）， `test`（仅测试时有效（如 JUnit））， `runtime`：测试和运行时有效，编译不需要（如 JDBC 驱动）。 `provided`：编译和测试有效，但运行时由容器提供（如 Servlet API）。
- Maven会优先寻找`本地仓库`（仓库路径需要手动指定）中的依赖jar包，如果没有找到，再去`私服仓库`（公司团队搭建的私有仓库，可选的，没有设置路径则直接去中央仓库）寻找。如果私服也没有，再去`中央仓库`（由Maven维护的全球唯一仓库）寻找下载到私服仓库（如有）再下载到本地仓库中。
:::