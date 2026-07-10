# MySQL

SQL 是操作数据库的“语言”，MySQL 是实现这种语言的“数据库系统”之一。

## 常见数据库分类

#### 关系型数据库

- 特点：数据以`“表（Table）”形式存储，行（记录）与列（字段）结构清晰`，支持 SQL 查询，强调 ACID 事务。
- 代表系统：
    - MySQL、PostgreSQL（开源）
    - Oracle（大型）、Microsoft SQL Server、IBM Db2（商业）
    - SQLite（嵌入式）
- 适用场景：金融交易、ERP、CRM、需要强一致性和复杂查询的业务。

- 优势：成熟、稳定、支持复杂 JOIN 和事务  
- 劣势：水平扩展难，不适合非结构化数据

---

#### 非关系型数据库

为应对高并发、海量数据、灵活 schema 等需求而兴起，进一步细分为四类：

##### （1）文档型数据库
- 数据模型：以 `JSON/BSON` 格式存储“文档”，类似嵌套对象。
- 代表：`MongoDB`、Couchbase、Firebase
- 适用：内容管理、用户画像、日志分析

##### （2） 键值型数据库
- 数据模型：简单的` key → value 映射`，value 可为任意类型（字符串、二进制等）。
- 代表：`Redis（内存）`、DynamoDB（云）、Riak
- 适用：缓存、会话存储、购物车、计数器




## 下载安装

- 社区v8.0版（免费）下载地址：[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
- 添加环境变量： 在系统变量中添加：`MYSQL_HOME`（mysql安装目录），然后在环境变量：`Path`中新建地址：`%MYSQL_HOME%\bin`
- 测试安装成功：进入任意目录下执行：`mysql -v`，如果不是提示mysql非命令错误，则表示安装成功。
- mysql初始化：以管理员身份进入任意目录下执行：`mysqld --initialize-insecure`，
- 注册mysql服务：接上一步继续执行：`mysqld -install`，
- 启动mysql服务：接上一步继续执行：`net start mysql`，
- 修改mysql默认账号密码：接上一步继续执行：`mysqladmin -u root password [你的密码]  `
- 登录mysql：`mysql -u[用户名] -p （-h[ip地址] -P[端口号]）`，然后输入密码即可。
- 退出mysql：`exit`，

:::tip 说明

- 管理员身份打开cmd：开始菜单 > windows系统 > 命令提示符 > 右击（以管理员身份运行）
- 停止mysql服务：`net stop mysql`，
- 登录mysql时，`-h`和`-P`为可选项，不填则默认连接本地的`3306`端口
:::

## SQL语句分类


| 类别 | 作用                                 | 主要语句 | 特点       |  
|------|------------------------------------|--------|----------|
| DDL | 定义或修改数据库的结构，如创建/删除数据库/表/字段、索引、视图等。 | `CREATE`, `ALTER`, `DROP` | 自动提交（执行后立即生效，不能回滚）。 | 
| DML | 对表中的数据进行增删改。                       | `INSERT`, `UPDATE`, `DELETE`, `SELECT` | 可回滚（在事务中），需手动 COMMIT 提交。 |
| DQL | 对表中的数据进行查询。                        | `SELECT` | —        | 
| DCL | 控制数据库访问权限和安全，管理用户角色与权限。            | `GRANT`, `REVOKE` | —  | 
| TCL | 管理事务，确保数据一致性（ACID 特性）。             | `COMMIT`, `ROLLBACK`, `SAVEPOINT` | —        | 


## DDL（数据库操作）

数据库相关操作常用命令：

- `USE [database_name];`：选择切换当前数据库
- `SHOW databases;`：查看所有数据库
- `SHOW tables;`：查看当前数据库的所有表
- `DESCRIBE [table_name];`：查看表结构（数据）
- `CREATE DATABASE [database_name];`：创建数据库
- `DROP DATABASE [database_name];`：删除数据库

表相关操作：

- `CREATE TABLE [table_name] (column_name column_type [column_constraint]);`：创建表
- `DROP TABLE [table_name];`：删除表
- `ALTER TABLE [table_name] [ADD | MODIFY | DROP] [column_name column_type [column_constraint]];`：修改表结构
- `DESC [table_name];` ：查看表结构（数据）

示例：创建用户表

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password_hash CHAR(60) NOT NULL,        -- bcrypt 输出固定 60 字符
    age TINYINT UNSIGNED,                   -- 0～255 足够
    balance DECIMAL(12,2) DEFAULT 0.00,     -- 金额，最大 999亿
    status TINYINT(1) DEFAULT 1,            -- 1=active, 0=disabled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    profile JSON
) COMMENT [描述];
```

### 数据类型

#### （1）整数


| 类型 | 范围（有符号） | 存储空间 | 说明                       |
|------|----------------|--------|--------------------------|
| `TINYINT` | -128 ～ 127 | 1 字节 | 常用于`状态标志（0/1），年龄`等，占用空间小 |
| SMALLINT | -32,768 ～ 32,767 | 2 字节 | —                        |
| MEDIUMINT | -8,388,608 ～ 8,388,607 | 3 字节 | MySQL 特有                 |
| `INT` / `INTEGER` | -2³¹ ～ 2³¹-1（约 ±21 亿） | 4 字节 | `最常用整数类型`                |
| BIGINT | -2⁶³ ～ 2⁶³-1（约 ±9e18） | 8 字节 | 用于 ID、计数器等大数。**避免过度使用**  |

#### （2）小数

| 类型 | 说明 | 精度问题                    | 适用场景 |
|------|------|-------------------------|--------|
| FLOAT | 单精度浮点 | ❌ 有舍入误差（约 6～9 位十进制有效数字） | 科学计算、近似值 |
| DOUBL` | 双精度浮点 | ❌ 有舍入误差（约 15～17 位十进制有效数字）               | 同上 |
| `DECIMAL(M,D)` | 定点数（精确） | ✅ 无误差                   | 金额、财务数据 |

> DECIMAL(10,2) 表示：总共 10 位数字，小数占 2 位（如 12345678.99）

:::tip 单精度 vs 双精度

假设要存储数字：123456789.123456789

| 类型 | 存储结果（近似值） | 丢失精度 |
|------|----------------|--------|
| 单精度 (float) | 123456792.0 | 后几位完全错误 |
| 双精度 (double) | 123456789.12345679 | 保留前 15～16 位 |
:::


#### （3）字符串

| 类型 | 最大长度 | 存储特点                   | 适用场景                |
|-----|--------|------------------------|---------------------|
| `CHAR(n)` | 255 字符 | `固定长度`，不足补空格             | 短且长度固定（如国家代码 `'CN'`） |
| `VARCHAR(n)` | 65,535 字节 | `可变长度`，节省空间，n表示最多占用的字符空间 | 最常用（用户名、标题等）        |
| `TINYTEXT` | 255 字节 | —                      |          —           |
| `TEXT` | 65,535 字节（≈64KB） | —                      |  博客正文、评论                   |
| MEDIUMTEXT | 16MB | —                      | —                   |
| LONGTEXT | 4GB | —                      | 小说、日志等超大文本          |
| ENUM | — | —                      | 枚举值，可指定 |
| SET | — | —                      | 枚举值，可指定多个 |
| BINARY(n) | 255 字节 | 固定长度，非 ASCII 字符用十六进制表示 | 二进制数据 |
| VARBINARY(n)| 255 字节 | 可变长度，非 ASCII 字符用十六进制表示 | 二进制数据 |
| BLOB | 65,535 字节 | —                      | 二进制数据 |

> TEXT 类型不能有默认值，且排序时只用前若干字节。

#### （4）日期和时间

| 类型 | 格式 | 范围                                                | 精度 | 说明             |
|------|------|---------------------------------------------------|------|----------------|
| `DATE` | YYYY-MM-DD | 1000-01-01 ～ 9999-12-31                           | 天 | 仅日期            |
| TIME | HH:MM:SS | -838:59:59 ～ 838:59:59                            | 秒 | 仅时间（可表示时长）     |
| `DATETIME` | YYYY-MM-DD HH:MM:SS | 1000-01-01 00:00:00 ～ 9999-12-31 23:59:59         | 秒（支持微秒） | 常用，与时区无关       |
| `TIMESTAMP` | YYYY-MM-DD HH:MM:SS | `1970-01-01 00:00:01 UTC ～ 2038-01-19 03:14:07 UTC` | 秒（支持微秒） | 自动转时区，受系统时区影响） |

:::warning 注意
- `系统审计字段首选 TIMESTAMP`
  created_at、updated_at、login_time 等记录"事件发生时刻"的字段，几乎总是应该用 TIMESTAMP。它们天然需要时区感知，且不会超出2038年。
- `业务日期字段首选 DATETIME`
  生日、纪念日、节假日、每日统计快照日期等"日历概念"，与时区无关，用 DATETIME（或纯 DATE）。
:::

常见约束字段：

| 约束类型 | 关键字            | 核心作用 | 备注 |
| :--- |:---------------| :--- | :--- |
| 主键约束 | `PRIMARY KEY`    | 唯一标识，非空且唯一 | 一张表只能有一个 |
| 自增约束 | `AUTO_INCREMENT` | 自动生成递增数值 | 必须配合键约束使用 |
| 非空约束 | `NOT NULL`       | 字段值不能为空 | 保证关键数据必有值 |
| 唯一约束 | `UNIQUE`         | 字段值不能重复 | 允许有多个 NULL |
| 外键约束 | `FOREIGN KEY`    | 维护表间引用关系 | 保证数据关联的正确性 |
| 默认值约束 | `DEFAULT`        | 未赋值时使用默认值 | 简化插入操作 |

:::warning 注意
- 每个字段可以设置多个约束，用空格分割。
- 设置`AUTO_INCREMENT`的字段每次插入新数据时不会出现之前已删数据的值（即每次添加数据该字段都一定是当前最大值）
:::


:::tip 最佳实践
- 主键 ID 通常用 `BIGINT UNSIGNED`,其余整数场景通常用 `INT`
- 浮点数精确存储（如货币金额）统一用`DECIMAL`。
- 普通字符串优先用`VARCHAR`，除非长度绝对固定则用`CHAR`（如国家代码CHN）。
- 大文本用`TEXT`，超大文本用`LONGTEXT`
- 事件发生时间（如订单创建时间）用`DATETIME`
- 数据变更时间（如 created_at, updated_at）用`TIMESTAMP`（因其支持自动更新）
- 布尔值用`TINYINT(1)`，0/1表示 false/true（SQL中没有内置的布尔类型）
- 不建议使用二进制相关类型（如 `BINARY`, `VARBINARY`, `BLOB`）来存文件，建议用`VARCHAR`存文件路径或 URL。
- 枚举类型`ENUM`不建议使用，因修改选项需 ALTER TABLE，难以扩展。推荐用 VARCHAR + 应用层校验，或单独建“状态字典表”。
- 尽量设 `NOT NULL + 默认值`，避免 NULL 滥用导致查询时的额外判断而引起的复杂度提升。
:::

### 主键PRIMARY KEY

:::code-group
```sql [单列主键]
CREATE TABLE users (
    id INT PRIMARY KEY,          -- 方式1：列级定义
    name VARCHAR(50)
);

-- 或
CREATE TABLE users (
    id INT,
    name VARCHAR(50),
    PRIMARY KEY (id)             -- 方式2：表级定义
);
```
```sql [多列主键]
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)  -- 两列组合唯一
);

```

:::

主键的作用：

- **唯一标识记录**：快速定位某一行（如用户 ID = 1001 的信息）。
- **加速查询**：数据库自动为主键创建索引（通常是聚簇索引），使 WHERE id = ? 查询极快。
- **建立表间关系**： 作为外键（FOREIGN KEY） 的引用目标，实现数据关联（如订单表引用用户表主键）。
- **防止重复数据**：插入重复主键值会报错，避免脏数据。

| 特性 | 说明 |
|------|------|
| 唯一性（Uniqueness） | 主键值在整张表中不能重复 |
| 非空性（NOT NULL） | 主键列不允许为 `NULL`（自动隐含 `NOT NULL` 约束） |
| 单表唯一 | 一张表只能有一个主键（但可由多列组成，称“复合主键”） |

:::warning 注意
- 主键优先使用自增整数（简单高效）,分布式系统考虑 UUID（全局唯一，适合分库分表）
- 避免使用自然主键（如用“身份证号”、“邮箱”作主键），因为这些数据长度大且可能会修改。
- 避免主键进行更新，因为会导致`索引重建和外键级联更新（可能锁表）`。
  :::
### 外键Foreign Key

外键（Foreign Key）又称`物理外键`。 是一种用于维护**表与表之间引用完整性**的约束机制。它通过建立两个表之间的“父子关系（`一对多`）”，确保子表中的数据必须引用父表中已存在的有效数据，从而防止孤立记录和数据不一致,**保证数据一致性与完整性**。


:::tip 外键要求
- 主表（父表）：包含主键（Primary Key）或唯一键（Unique Key）的表。
- 从表（子表）：包含外键的表，其外键值必须在主表中存在（或为 NULL，若允许）。
- 外键列：从表中的一列（或一组列），其值必须匹配主表的主键（或唯一键）值。
  :::

创建表时定义外键：

```sql
-- 主表：部门表
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50)
);

-- 从表：员工表（含外键）
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(50),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);
```
在已有表上添加外键：

```sql
ALTER TABLE employees
ADD CONSTRAINT fk_dept --外键名称
FOREIGN KEY (dept_id) REFERENCES departments(id);
```

删除外键：
```sql
ALTER TABLE employees
DROP FOREIGN KEY fk_dept;
```

#### 行为控制

外键可以定义**当主表记录被删除或更新时，从表如何响应**：

| 选项 | 说明 |
|------|------|
| `CASCADE` | 级联操作：主表删/改，从表自动删/改对应记录 |
| `SET NULL` | 主表记录被删/改，从表外键设为 NULL（要求外键列允许 NULL） |
| `RESTRICT` / `NO ACTION` | 拒绝操作：如果从表有相关记录，禁止删除或更新主表记录（`默认行为`） |
| `SET DEFAULT` | 设为默认值（MySQL 不支持，但某些数据库如 PostgreSQL 支持） |

示例：

```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(50),
    dept_id INT,
    FOREIGN KEY (dept_id) 
        REFERENCES departments(dept_id)
        ON DELETE CASCADE --删除一个部门 → 该部门所有员工自动删除；
        ON UPDATE CASCADE --修改部门 ID → 员工的 dept_id 自动同步更新。
);
```

:::warning 注意事项
- 外键列与主键列的数据类型、长度、符号性需一致
- 在外键列上创建索引可大幅提升 JOIN 和 DELETE/UPDATE 性能。
- 避免 A 表外键引用 B 表，B 表又外键引用 A 表（可能导致插入失败）
:::

:::tip `用逻辑外键代替物理外键`

虽然物理外键（Foreign Key）可以**保证数据完整一致性和级联操作，避免了脏数据的出现**。

但在`高并发`场景下，物理外键存在以下缺点：

- **性能开销大**：每次 INSERT/UPDATE/DELETE 都需要检查约束，且容易导致锁表（A表和B表互相外键引用）。
- **分库分表障碍**：拆分数据库，必须先删除所有外键，迁移成本极高。
- **耦合度过高**：当业务规则变更（例如允许软删除、历史数据归档）时，物理外键的刚性约束反而成为阻碍。
- **调试困难**：报错信息通常是通用的 Cannot add or update a child row: a foreign key constraint fails，难以定位具体是哪个业务环节出了问题。

使用`逻辑外键`方案：

即在表中保留 user_id 等关联字段，建立普通索引以加速查询，但不定义 FOREIGN KEY 约束。每次数据库表操作时，在代码层面（Service/DAO 层）实现完整性检查。

如插入子表前先查父表是否存在；删除父表前先查子表是否有关联（建议通过封装统一的方法实现）。
:::

### 多表关系

#### 1. 一对一关系

特点：A表中的每一行与B表中的某一行相关联

场景：用户基本信息与用户隐私信息分离，订单与订单详情，公民与身份证

实现方式：`在任一方表中添加另一方的主键作为外键并添加UNIQUE约束`。

示例：

```sql
-- 用户表
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50)
);

-- 用户资料表
CREATE TABLE user_profiles (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,  -- UNIQUE 保证一对一
    bio TEXT,
    avatar_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 2. 一对多关系

特点：A表中的每一行与B表中的多行相关联

场景：用户与角色，班级与学生，部门与员工

实现方式：`在从表（如员工）中添加主表（如部门）的主键作为外键`。

示例见：[外键Foreign Key](/backend/database/mysql.html#外键foreign-key)

#### 3. 多对多关系

特点：A表中的每一行与B表中的多行相关联

场景：学生与课程，文章与标签，老师和学生

实现方式：`创建一个中间表，将两个表的主键作为外键关联起来`。

示例：

```sql
-- 学生表
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);
-- 课程表 
CREATE TABLE courses (
    id INT PRIMARY KEY,
    course_name VARCHAR(100)
);

-- 中间表（总体的学生课程表）
CREATE TABLE student_courses (
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),  -- 联合主键防重复
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

```
## DML（表数据更新）


### 插入数据

添加数据可以通过`INSERT INTO`语句实现,其基本语法如下：

```sql
-- 方式1：指定列名（推荐）
INSERT INTO table_name (col1, col2, col3)
VALUES (val1, val2, val3);

-- 方式2：不指定列名（必须提供所有列的值，按表定义顺序）
INSERT INTO table_name
VALUES (val1, val2, val3);
```

示例：

:::code-group
```sql [单条插入]
-- 向 users 表插入一条记录
INSERT INTO users (id, name, email, created_at)
VALUES (1, 'Alice', 'alice@example.com', NOW());
```
```sql [多条插入]
INSERT INTO users (name, email) VALUES
('Bob', 'bob@example.com'),
('Carol', 'carol@example.com');
```
```sql [从其他表插入]
INSERT INTO active_users (user_id, name)
SELECT id, name FROM users WHERE status = 'active';
```
:::

### 修改数据

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;  -- ⚠️ 强烈建议加上！
```

> `必须加 WHERE 条件`。如果省略 WHERE，会更新整张表的所有行，极易造成生产事故！


### 删除数据

```sql
DELETE FROM table_name
WHERE condition;  -- ⚠️ 强烈建议加上！
```

> `必须加 WHERE 条件`。如果省略 WHERE会删除整张表数据，但表结构保留。


:::tip
- 插入/删除/修改数据操作都`可支持回滚`。
  :::


## DQL（表数据查询）

查询数据通过`SELECT`语句实现,其基本语法如下：

```sql
SELECT column1, column2, ...
FROM table_name
WHERE ...          -- 可选
GROUP BY ...       -- 可选
HAVING ...         -- 可选
ORDER BY 
    column_name [ASC | DESC],
    expression [ASC | DESC],
    position [ASC | DESC];
LIMIT ...          -- 可选
```

示例：
```sql [SELECT]
SELECT * FROM users;
SELECT id, name FROM users;
SELECT id as user_id, name FROM users; -- as用于设置别名（可省略）
```

### DISTINCT

DISTINCT 是一个用于`去除查询结果中重复行`的关键字。它通常用在 **SELECT** 语句中

基本语法：

```sql
SELECT DISTINCT column1, column2, ...
FROM table_name;
```

| id | name   | department |
|----|--------|------------|
| 1  | Alice  | HR         |
| 2  | Bob    | IT         |
| 3  | Carol  | HR         |
| 4  | David  | IT         |
| 5  | Eve    | HR         |

- **如果只指定一个列，DISTINCT 会去除该列中的重复值。**

```sql
SELECT DISTINCT department FROM employees;
```

结果只保留1列(department)2行(HR 和 IT 两个部门)

- **如果指定多个列，DISTINCT 会基于这些列的组合值去重（即只有当所有指定列的值都相同时，才视为重复）。**

```sql
SELECT DISTINCT name, department FROM employees;
```
由于每行 (name, department) 组合本来就是唯一的，**结果和原表一样**

### 条件查询（WHERE） 

基本语法：

```sql
SELECT column1, column2 from table_name where [条件列表]
```

常用条件运算符：

| 运算符/关键字 | 含义 | 示例 |
| :--- | :--- | :--- |
| `=`, `>`, `<`, `>=`, `<=` | 基础比较 | `WHERE age >= 18` |
| `<>` 或 `!=` | 不等于 | `WHERE status != 0` |
| `AND`, `OR`, `NOT` | 逻辑运算（与、或、非） | `WHERE age > 18 AND status = 1` |
| `BETWEEN ... AND ...` | 闭区间范围查询（包含边界值） | `WHERE price BETWEEN 100 AND 500` |
| `IN (...)` | 匹配多个离散值 | `WHERE id IN (1, 3, 5)` |
| `LIKE` | 模糊查询（`%`匹配任意多字符，`_`匹配单个字符） | `WHERE name LIKE '张%'` |
| `IS NULL` / `IS NOT NULL` | 判断字段是否为空 | `WHERE email IS NULL` |

示例：

```sql
-- 1. 基础比较与逻辑运算：查询价格大于1000且状态为上架的手机或电脑
SELECT * FROM products 
WHERE price > 1000 
  AND status = 1 
  AND (category = '手机' OR category = '电脑');

-- 2. 范围与集合查询：查询1月份创建的订单，且状态不是已取消(3)或已完成(4)
SELECT * FROM orders 
WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31'
  AND status NOT IN (3, 4);

-- 3. 模糊查询：查询名字中包含“科技”二字的公司
SELECT * FROM companies WHERE name LIKE '%科技%';

-- 4. 空值查询：查询还没有填写收货地址的用户
SELECT * FROM users WHERE address IS NULL;
```
:::tip 扩展
- `%`（任意长度含0字符，但不匹配NULL）和`_`（匹配一个字符）**必须配合 LIKE 或 NOT LIKE 使用**，
- `AND 的优先级高于 OR`。如果你混合使用它们，一定要用括号 `()` 明确逻辑分组
- 必须使用 `IS NULL` 或 `IS NOT NULL`，绝对不能用 = NULL 或 != NULL（任何值与 NULL 进行 = 比较的结果都是 `UNKNOWN`而不是预期的TRUE/FALSE，导致查不到任何数据）
:::

### 分组查询（GROUP BY）

MySQL 的聚合函数（Aggregate Functions） 用于对一组值执行计算，并返回单个汇总结果。它们通常与` GROUP BY` 子句配合使用，是数据分析、报表统计的核心工具。

假设有一张销售表 sales：

```sql
CREATE TABLE sales (
    id INT,
    product VARCHAR(50),
    amount DECIMAL(10,2),
    region VARCHAR(20)
);

INSERT INTO sales VALUES
(1, 'Laptop', 5000.00, 'North'),
(2, 'Mouse', 50.00, 'North'),
(3, 'Keyboard', 150.00, 'South'),
(4, 'Monitor', NULL, 'East');  -- 注意：amount 为 NULL
```

常用聚合函数：
- `COUNT(*)`：统计所有行数（包括 NULL 和重复值）
- `COUNT(column)`：统计指定列非 NULL 的行数
- `SUM(column)`：对数值列求和，忽略 NULL。如果所有值都是 NULL，返回 NULL（不是 0）
- `AVG(column)`：对数值列求平均值，忽略 NULL。如果所有值都是 NULL，返回 NULL（不是 0）。AVG(column) = SUM(column) / COUNT(column)
>注意：如果只是为了统计总记录数，`优先使用 COUNT(*)`。因为它忽略了 NULL，减少了取值判断的步骤，性能更好。
:::code-group
```sql [COUNT]
SELECT 
    COUNT(*) AS total_rows,        -- 4（含 NULL 行）
    COUNT(amount) AS non_null_amounts  -- 3（忽略 amount=NULL 的行）
FROM sales; 

-- 统计商品种类（使用DISTINCT将product列去重）
SELECT COUNT(DISTINCT product) FROM sales;

```
```sql [SUM]
SELECT SUM(amount) FROM sales;  -- 结果: 5200.00 (5000+50+150)
```
```sql [AVG]
SELECT AVG(amount) FROM sales;  
-- 结果: 1733.3333 (5200 / 3)，不是 5200/4！
```
```sql [MIN/MAX]
SELECT 
    MIN(amount),   -- 50.00
    MAX(amount),   -- 5000.00
    MIN(product),  -- 'Keyboard'（字母序最小）
    MAX(region)    -- 'South'
FROM sales;
```
:::



#### 与GROUP BY（分组）配合使用

```sql
SELECT 
    region,
    COUNT(*) AS order_count,
    SUM(amount) AS total_sales,
    AVG(amount) AS avg_order_value
FROM sales
GROUP BY region;
```
则执行结果如下：

| region | order_count | total_sales | avg_order_value |
|--------|-------------|-------------|-----------------|
| North  | 2           | 5050.00     | 2525.00         |
| South  | 1           | 150.00      | 150.00          |
| East   | 1           | NULL        | NULL            |
>East 区的 amount 为 NULL，所以 SUM 和 AVG 返回 NULL

:::warning 注意
- 使用了`GROUP BY`的语句，其SELECT查询的字段通常`只能是聚合函数或者分组字段`，如果为其他字段则毫无意义。
- `WHERE 不能用聚合函数`。如WHERE AVG(amount) > 100会报错，可改用 HAVING AVG(amount) > 100来进行过滤操作
- 所有非聚合字段必须出现在 GROUP BY 中。例如`SELECT name, COUNT(*) FROM t（若 name 未 GROUP BY）`会报错
:::

#### HAVING vs WHERE

| 特性 | `WHERE` | `HAVING` |
|------|--------|---------|
| 作用阶段 | 在分组前过滤原始行 | 在分组后过滤聚合结果 |
| 能否用聚合函数 | ❌ 不能（如 `COUNT()`, `SUM()`） | ✅ 可以 |
| 性能 | 更快（减少参与分组的数据量） | 较慢（需先分组再过滤） |
| 必须配合 GROUP BY 吗？ | 否 | 通常需要（除非用聚合函数但不分组） |


示例：

有如下表结构：

```sql
CREATE TABLE orders (
    id INT,
    customer_id INT,
    amount DECIMAL(10,2)
);

INSERT INTO orders VALUES
(1, 101, 100.00),
(2, 101, 200.00),
(3, 102, 50.00),
(4, 103, 300.00),
(5, 103, 150.00);
```

```sql
-- 找出“单笔订单 ≥ 100 元”的客户中，总消费 > 200 的
SELECT 
    customer_id,
    COUNT(*) AS order_count,
    SUM(amount) AS total
FROM orders
WHERE amount >= 100          -- 先过滤掉小额订单
GROUP BY customer_id
HAVING SUM(amount) > 200;    -- 再过滤总消费
```

:::tip
- 总结：`WHERE 过滤“行”，HAVING 过滤“组”`
- 最佳实践：先用 WHERE 减少数据量，再用 GROUP BY 分组，最后用 HAVING 过滤聚合结果。
:::

### 排序查询（ORDER BY）

排序是通过`ORDER BY`子句实现的，用于控制查询结果的`行`返回顺序。


示例：

:::code-group
```sql [单列排序]
-- 按价格升序（默认）
SELECT * FROM products ORDER BY price;

-- 按销量降序
SELECT * FROM products ORDER BY sales_count DESC;
```
```sql [多列排序]
-- 先按部门升序，同部门内按工资降序
SELECT name, dept, salary
FROM employees
ORDER BY dept ASC, salary DESC;
```
```sql [多种排序依据]
-- 按姓名长度排序
ORDER BY LENGTH(name)

-- 按年份排序
ORDER BY YEAR(created_at)
```
:::

> ASC为升序（默认），DESC为降序

:::warning 注意

- NULL在排序中被视为最小值
- 先 WHERE 过滤，再 ORDER BY，减少排序数据量
- ORDER BY 可能导致`全表排序`，影响性能。建议为常用排序字段添加索引
    ```sql
    -- 为常用排序字段建索引
    CREATE INDEX idx_products_price ON products(price);
    
    -- 复合排序？建联合索引
    CREATE INDEX idx_emp_dept_sal ON employees(dept, salary);
    ```
:::

### 分页查询（LIMIT）

分页查询主要通过 LIMIT 子句来实现，它的核心作用是从海量数据中截取出一部分记录

核心规则：
- 起始位置（偏移量）：`从 0 开始计数。0 代表第一条记录`，1 代表第二条记录，以此类推。
- 每页条数：你希望返回的记录数量。

```sql
-- 1. 查询前 10 条记录（等价于 LIMIT 0, 10）
SELECT * FROM users LIMIT 10;

-- 2. 查询第 2 页的数据（每页 10 条，即第 11-20 条）
SELECT * FROM users ORDER BY id ASC LIMIT 10, 10;
-- 或者使用 OFFSET 写法
SELECT * FROM users ORDER BY id ASC LIMIT 10 OFFSET 10;

-- 3. 带条件和排序的分页：查询价格大于100的商品，按价格降序，取第3页（每页20条）
SELECT * FROM products 
WHERE price > 100 
ORDER BY price DESC 
LIMIT 40, 20; 

```
::: warning 注意
- 分页查询必须带 `ORDER BY`
- 分页计算公式：`LIMIT (当前所需页码-1) * 每页记录数，每页记录数`
:::

#### 深度分页查询优化

问题场景：查询limit 2000000,10，此时需要MySQL排序前2000010记录，仅仅返回2000000-2000010
的记录，其他记录丢弃，查询排序的代价非常大。

解决方案：命中覆盖索引 + 子查询

```sql
-- 要求查询tb_sku这个表在limit 2000000,10这个区间的数据
-- 低端做法：直接查询2000000-2000010的数据
select * from tb_sku order by id limit 2000000,10;

-- 优化做法：通过id的主键索引查询获取指定区间的id列表再查询这些id的数据
select s.* from tb sku as s,(select id from tb_sku order by id limit 9000000, 10) as a where s.id = a.id;

```





### 表的加减法

#### 加法（合并多个表数据）

| 操作 | 含义 | 是否去重 |
|------|------|--------|
| `UNION` | 合并结果并自动去重 | ✅ 是 |
| `UNION ALL` | 合并结果保留所有行（包括重复） | ❌ 否 |

示例：
```sql
-- 查询 2025 年 12 月和 2026 年 1 月的所有订单（假设分表）
SELECT order_id, user_id, amount FROM orders_202512
UNION ALL
SELECT order_id, user_id, amount FROM orders_202601;
```
:::tip 要求
- 列数相同
- 对应列类型兼容
- 列名以第一个 SELECT 为准
  :::

#### 减法

找出在一个表中有、另一个表中没有的记录

示例：找出“注册了但从未下单的用户”

:::code-group
```sql [方法1：NOT EXISTS]
SELECT * FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```
```sql [方法2：LEFT JOIN]

-- 合并后保留两张表的各自的字段，若o.user_id此字段为null，则表示这条此条user数据没有在order表中有匹配，即此user没有下过单，
SELECT u.* 
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.user_id IS NULL;
```
:::

### JOIN（多表连接查询）

现实中的数据通常分散在多张表中（如用户信息、订单、商品），要回答“用户买了什么商品？”这类问题，必须把相关表连接起来。

联结（JOIN） 是用于将多个表的数据按关联条件组合在一起，按照某种规则把两张表“拼”成一张宽表

基本语法：

```sql
SELECT columns
FROM table1
[INNER | LEFT | RIGHT | CROSS] JOIN table2
ON table1.column = table2.column; --指定如何匹配两表的行即匹配规则
```

#### JOIN类型

- `INNER JOIN`（内联结）：只保留两表都匹配的行。最常用、性能最好
- `LEFT JOIN`（左外联结）：保留左表（FROM 表）所有行。右表无匹配时，字段为 NULL
- `RIGHT JOIN`（右外联结）：保留右表（TO 表）所有行。左表无匹配时，字段为 NULL
- `CROSS JOIN`（叉联结）：将两表所有行都匹配，结果集为两表行数乘积即笛卡儿积（**慎用**）

```sql
-- 查询有订单的用户及其订单（内联结）
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 查询有订单的用户及其订单（隐式内联结，与上面等价）
SELECT u.name, o.amount
FROM users u, orders o
       WHERE u.id = o.user_id;

-- 查询所有用户，包括未下单的
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- 查询所有订单，包括用户已删除的（user_id 无效）
SELECT u.name, o.amount
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- 生成所有用户和所有商品的组合（用于推荐系统初始化？）
SELECT u.name, p.name
FROM users u
CROSS JOIN products p;
```
:::tip 最佳实践
- 外联结场景：主表 + 附属信息（如用户 + 订单，文章 + 评论）
- 尽量用 `LEFT JOIN` 替代 `RIGHT JOIN`（通过调整表顺序），可读性更好。
- **不要忘记写ON条件**，否则会变成`CROSS JOIN（笛卡儿积）`
- 不要LEFT JOIN 后在 WHERE 中过滤右表。否则会变成 INNER JOIN
```sql
-- ❌ 错误：NULL 行被过滤掉
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.amount > 100;  -- 这里直接移除了 o.amount IS NULL 的行，变成了 INNER JOIN效果

-- ✅ 正确：把条件移到 ON 中（保证了左表的所有行都返回，避免了 NULL 行被过滤掉）
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.amount > 100;
```
:::

### 子查询
子查询（Subquery） 是指嵌套在另一个 SQL 语句中的 SELECT 查询。外层的语句可以是 SELECT、INSERT、UPDATE 或 DELETE，因此子查询也被称为“`嵌套查询`”。

:::tip 子查询特点
- 必须用 括号 () 括起来
- 可以出现在：
  - SELECT 列表中（标量子查询）
  - FROM 子句中（派生表）
  - WHERE / HAVING 条件中（常用）
  - INSERT / UPDATE / DELETE 的值或条件中
- 执行顺序：先执行子查询，再执行外层查询
  :::

示例：

:::code-group
```sql [标量子查询]
-- 返回单行单列（单个值）
-- 可用于 SELECT、WHERE、ORDER BY 等任何需要单个值的地方
-- 查询工资高于公司平均工资的员工（先查平均工资，再查员工）
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```
```sql [列子查询]
-- 返回单列多行。通常配合 IN、ANY、ALL、SOME 使用。

-- 查询所有有订单的客户的姓名（先查有订单的客户ID列表，再查匹配的客户姓名）
SELECT name
FROM customers
WHERE id IN (SELECT DISTINCT customer_id FROM orders);


--找出薪资高于“研发部”中所有员工的员工（等价于salary > 研发部最高薪资）
SELECT name, salary 
FROM employees 
WHERE salary > ALL (
    SELECT salary FROM employees WHERE department_id = (SELECT id FROM departments WHERE name = '研发部')
);


-- 找出薪资高于“研发部”中任意一名员工的员工（等价于salary > 研发部最低薪资）。
SELECT name, salary 
FROM employees 
WHERE salary > ANY (
    SELECT salary FROM employees WHERE department_id = (SELECT id FROM departments WHERE name = '研发部')
);
```
```sql [行子查询]
-- 返回单行多列
-- 查询与"张三"同部门且同职位的员工（先查张三的信息（只需部门和职位），再匹配部门、职位相同的员工））
SELECT *
FROM employees
WHERE (dept_id, job_title) = (
  SELECT dept_id, job_title
  FROM employees
  WHERE name = '张三'
);
```
```sql [表子查询]
-- 返回多行多列
-- 常用于 IN、EXISTS、FROM 等场景
-- 查询每个部门工资最高的员工信息（先查员工表根据部门分组查出各部门最高工资，再根据部门，最高工资匹配对应的员工信息）
SELECT e.name, e.salary, d.dept_name
FROM employees e
       JOIN departments d ON e.dept_id = d.id
WHERE (e.dept_id, e.salary) IN (
  SELECT dept_id, MAX(salary)
  FROM employees
  GROUP BY dept_id
);
```
:::

#### 子查询 vs JOIN

示例：获取“用户姓名及其订单数”

:::code-group
```sql [标量子查询]
SELECT 
    name,
    (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS order_count
FROM users;
```
```sql [LEFT JOIN + GROUP BY]
SELECT 
    u.name,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
```
:::


#### CTE（MySQL 8新增）

CTE为替代传统子查询的优雅方案，CTE可以定义为临时表，然后引用多次。

```sql
-- 用 CTE 重写派生表
WITH user_orders AS (
    SELECT user_id, COUNT(*) AS cnt
    FROM orders
    GROUP BY user_id
)
SELECT * FROM user_orders WHERE cnt > 5;
```


### IN 和 EXISTS

示例：查找下过订单的用户

:::code-group
```sql [IN + 子查询]
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders);
```
```sql [EXISTS + 子查询]
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```
:::

:::warning NOT IN与NULL的冲突

**在 `NOT IN` 前应确保子查询无 NULL**

因为`id NOT IN (x, NULL)`等价于`id != x AND id != NULL`，NULL使用了!=判断则此时整体返回UNKNOWN

```sql
-- ❌ 可能报错（若user_id值可能为NULL的情况下）
SELECT name FROM users  WHERE id NOT IN (SELECT user_id FROM ordered_user_ids);

-- ✅ 正确
SELECT name
FROM users
WHERE id NOT IN (
SELECT user_id
FROM ordered_user_ids
WHERE user_id IS NOT NULL   -- 👈 关键！过滤掉 NULL
);
```
> 如果是`IN`,则`WHERE id IN(x,NULL)`等价于`WHERE id = x OR id = NULL`，此时id=NULL也会被忽略

:::

使用EXISTS比IN更快的原因:

- 如果连接列(id)上建立了索引，那么查询Class_B时不用查实际的表，只需查索引就可以了。

- 如果使用EXISTS，那么只要查到一行数据满足条件就会终止查询，不用像使用IN时一样扫描全表。在这一点上，NOT EXISTS也一样。


:::tip 最佳实践
- 小结果用标量，大集合用 IN/EXISTS
- `用 EXISTS 替代 IN`（尤其涉及 NOT 时），永远不要用 NOT IN，改用 NOT EXISTS。
- 能用 `JOIN` 就不用子查询，复杂逻辑用`CTE`
  :::

### 常用函数

- 字符串：CONCAT, SUBSTRING, LOWER,UPPER，TRIM，LENGTH
- 数值：ROUND, ABS, CEIL，FLOOR
- 日期：NOW, CURDATE, DATE_ADD
- 逻辑：IF, CASE, IFNULL
- 聚合：COUNT, SUM, AVG,MAX, MIN


示例：

:::code-group
```sql [字符串]
-- 将名和姓拼接成一个完整的名字
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employees;

-- 提取手机号的前3位（通常用于判断运营商）
SELECT SUBSTRING(phone_number, 1, 3) AS operator_code FROM users;

-- 将邮箱全部转换为小写，防止大小写敏感导致匹配失败
SELECT LOWER(email) FROM users;

-- 筛选出密码长度小于8位的不安全账号
SELECT username FROM users WHERE LENGTH(password) < 8;

-- 清理用户输入时不小心带入的前后空格
SELECT TRIM(user_input) AS cleaned_text FROM logs;
```
```sql [数值]
-- 显示2位小数的价格。四舍五入（保留小数）
SELECT name, ROUND(price, 2) AS price FROM products;

-- 计算需要多少个箱子才能装下所有商品（向上取整）
SELECT CEIL(total_items / 10.0) AS boxes_needed FROM orders;

-- 计算账户余额与目标余额的绝对差值
SELECT ABS(current_balance - target_balance) AS diff FROM accounts;
```
```sql [日期]
-- 插入数据时自动记录当前操作时间
INSERT INTO logs (message, created_at) VALUES ('系统启动', NOW());

-- 只获取今天的日期来查询今日订单
SELECT * FROM orders WHERE DATE(order_time) = CURDATE();

-- 统计2024年注册的总人数
SELECT COUNT(*) FROM users WHERE YEAR(register_date) = 2024;

-- 计算订单的预计最晚发货时间（下单后3天内）
SELECT order_id, DATE_ADD(order_time, INTERVAL 3 DAY) AS deadline FROM orders;
```
```sql [逻辑]
-- 根据库存状态打标签
SELECT product_name, IF(stock > 0, '有货', '缺货') AS status FROM products;

-- 如果用户没有填写备注，则显示“无”
SELECT username, IFNULL(remark, '无') AS remark FROM users;

-- 根据分数划分成绩等级
SELECT 
    student_name, 
    score,
    CASE 
        WHEN score >= 90 THEN '优秀'
        WHEN score >= 80 THEN '良好'
        WHEN score >= 60 THEN '及格'
        ELSE '不及格'
    END AS grade_level
FROM exam_results;
```
```sql [聚合]
-- 总用户数
SELECT COUNT(*) FROM users;

-- 有填写手机号的用户数
SELECT COUNT(phone) FROM users;  -- 自动忽略 NULL

-- 计算每个用户的总消费金额
SELECT user_id, SUM(amount) AS total_spent FROM orders GROUP BY user_id;

-- 平均订单金额（只算有效订单）
SELECT AVG(amount) FROM orders WHERE amount > 0;

-- 统计每个部门的员工人数
SELECT department_id, COUNT(*) AS emp_count FROM employees GROUP BY department_id;

-- 查找每个部门薪资最高和最低的员工
SELECT department_id, MAX(salary) AS max_sal, MIN(salary) AS min_sal FROM employees GROUP BY department_id;
```
:::


:::warning 注意

- 避免在 `WHERE` 中对字段使用函数（会导致索引失效）
    ```sql
    -- 错误
    WHERE YEAR(create_time) = 2026
    
    -- 正确
    WHERE create_time BETWEEN '2026-01-01' AND '2026-12-31'
    ```

- 日期计算优先用 `DATE_ADD/INTERVAL`，而非字符串拼接
- 用 `COALESCE` 处理 NULL
    ```sql
    SELECT COALESCE(phone, '未填写') FROM users;
    ```
:::





## 书写规范

- 语句以分号`;` 结尾
- 字符串用单引号 ' '，别名（用`AS声明`，AS可省略）/标识符用反引号 ````  （MySQL）或双引号 "（标准 SQL / PostgreSQL）
    ```sql
    -- 正确：字符串值
    SELECT 'Hello', name FROM users WHERE email = 'user@example.com';
    
    -- MySQL 中避免关键字冲突（如字段名是 reserve word）
    SELECT `order`, `group` FROM sales;
    ```
- 关键字大写（虽然SQL语句不区分大小写）
    ```sql
    SELECT user_id, username
    FROM users
    WHERE status = 'active'
    AND created_at > '2025-01-01';
    ```
- 数据库、表和列的名称只能包含**英文字母、数字、下划线**且必须英文字母开头，不可以使用连字符`-`或特殊符号。通常使用**小写字母+下划线**的命名方式。例如：`users`、`user_id`、`created_at`


## 事务

用于`将一组数据库操作打包成一个逻辑工作单元`，确保这些操作要么全部成功执行，要么全部不执行，从而保证数据的一致性和可靠性。

事务的特性：

- **原子性**：事务中的所有操作是一个不可分割的整体：要么全成功，要么全失败。
- **一致性**：事务完成时，相关涉及的数据库必须保持一致状态。
- **隔离性**： 多个并发事务之间互不干扰，每个事务都感觉不到其他事务的存在。
- **持久性**：一旦事务提交（`COMMIT`），其对数据库的改变结果将永久保存，即使系统崩溃也不会丢失。

事务的基本控制语句：

| 语句 | 作用 |
|------|------|
| `BEGIN` 或 `START TRANSACTION` | 显式开启一个事务 |
| `COMMIT` | 提交事务，使所有更改永久生效 |
| `ROLLBACK` | 回滚事务，撤销自 `BEGIN` 以来的所有更改 |
| `SAVEPOINT name` | 在事务中设置保存点 |
| `ROLLBACK TO SAVEPOINT name` | 回滚到指定保存点（保留之后的操作） |

示例：

:::code-group
```sql [事务基本用法]
-- 开启事务
START TRANSACTION;

-- 1. 扣减 A 的余额
UPDATE accounts SET balance = balance - 100 WHERE user_id = 'A';

-- 2. 增加 B 的余额
UPDATE accounts SET balance = balance + 100 WHERE user_id = 'B';

-- 检查是否出错（如 A 余额不足）
-- 如果一切正常：
COMMIT;

-- 如果中途出错（如网络中断、余额不足）：
-- ROLLBACK;
```
```sql [保存点用法]
START TRANSACTION;

INSERT INTO logs VALUES ('step1');
SAVEPOINT sp1;

INSERT INTO logs VALUES ('step2');
SAVEPOINT sp2;

-- 出错了，只回滚到最后一个保存点
ROLLBACK TO sp2;

-- 继续执行
INSERT INTO logs VALUES ('step3');

COMMIT;
```
:::
> 如果不用事务：<br/>
> 步骤1成功（A 扣了100），但步骤2失败（B 没收到）→ 钱凭空消失！<br/>
> 事务确保：要么两人账都对，要么都不变。

### 事务隔离

假如有以下场景：

你和你的配偶共用一个银行账户，余额 1000 元。

- 你（事务 A）：在 ATM 机上查询余额 → 准备取 500 元
- 配偶（事务 B）：同时在手机银行转账 600 元给朋友

两个操作几乎同时发生（多个事务同时执行即**并发事务**），可能引发以下问题：

| 问题        | 描述                                                   | 场景示例                                                             |
|-----------|------------------------------------------------------|------------------------------------------------------------------|
| **脏读**    | 当前事务读到另一个事务未提交的数据                                    | 事务 B 执行后（未commit），事务A此时读到了余额400，以为钱少了。而后B因为网络异常rollback恢复为1000元。 |
| **不可重复读** | 同一事务内，两次读取同一条记录，结果不同（因被其他事务修改并提交）                    | 事务 A 第一次查询余额为1000，而后事务B执行完，A再次查询余额为400,前后不一致。                    |                                  |
| **幻读**    | 同一事务内，初始查询某一记录时没有数据，后续再插入该数据发现已存在（因其他事务插入/删除了符合条件的行） | 事务A查询了最近的交易数量，事务B执行完交易流程后，A再次查询则数量+1，前后不一致。                      |

四种隔离级别对比：

| 隔离级别 | 脏读 | 不可重复读 | 幻读 | 实现机制 | 适用场景 |
|--------|------|-----------|------|--------|--------|
| READ UNCOMMITTED | ✅ 允许 | ✅ 允许 | ✅ 允许 | 无锁 | 日志分析等容忍脏数据的场景 |
| READ COMMITTED | ❌ 禁止 | ✅ 允许 | ✅ 允许 | 行级锁 + 快照读 | 一般 Web 应用（如 Oracle 默认） |
| REPEATABLE READ（MySQL 默认） | ❌ | ❌ | ❌（InnoDB 特有） | MVCC + 间隙锁 | 大多数业务系统（保证一致性） |
| SERIALIZABLE | ❌ | ❌ | ❌ | 强制串行 | 金融核心系统（如对账） |



设置隔离级别：

```sql
-- 查看当前隔离级别
SELECT @@transaction_isolation;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

:::tip 最佳实践

- 事务越短越好,长事务会占用资源、阻塞其他操作、增加死锁风险。
- 避免在事务中处理业务逻辑（如调用外部 API、发送邮件）
- 异常时必须回滚
- 不要在事务中读用户输入
- 合理选择隔离级别：一般业务使用`READ COMMITTED` 或 `REPEATABLE READ`，金融核心系统考虑用`SERIALIZABLE`

:::




## 性能优化

### 存储引擎

MySQL 的核心设计理念是`分层架构与插件式存储引擎`。这种设计将 **SQL 语句的处理逻辑与数据的物理存储分离**，使其能够根据不同的业务场景灵活调整。

MySQL 的整体架构自上而下主要分为三大核心层：

- **连接层**：主要为客户端和连接服务，负责连接处理和授权认证等工作。
- **服务层**：主要是核心功能。负责 SQL接口，缓存管理，SQL优化等
- **存储引擎层**：负责数据的物理存储、提取、索引管理和事务处理。

常见存储引擎：

| 对比维度 | InnoDB (**MySQL 5.5+ 默认**) | MyISAM           | MEMORY           | ARCHIVE |
| :--- |:---------------------------|:-----------------|:-----------------| :--- |
| 事务支持 | ✅ 支持（ACID）                 | ❌ 不支持            | ❌ 不支持            | ❌ 不支持 |
| 锁机制 | 行级锁（高并发友好）                 | 表级锁（写操作易阻塞）      | 表级锁              | 行级锁 |
| 外键约束 | ✅ 支持                       | ❌ 不支持            | ❌ 不支持            | ❌ 不支持 |
| 崩溃恢复 | ✅ 支持（依赖 Redo/Undo Log）     | ❌ 不支持（宕机易损坏）     | ❌ 不支持（重启数据丢失）    | ✅ 支持 |
| 存储介质 | 磁盘                         | 磁盘               | 内存               | 磁盘（高压缩比） |
| 适用场景 | **核心业务、高并发、金融交易**          | **纯读、低并发、非核心统计** | **临时数据、缓存、中间结果** | 历史数据归档、日志记录 |







### 索引

索引(index)是**帮助MySQL高效获取数据的数据结构(有序)**。

在数据之外，数据库系统还维护着满足特定查找算法的数据结构，这些数据结构以某种方式引用(指向)数据，这样就可以在这些数据结构上实现高级查找算法，这种数据结构就是索引。

#### 索引意义
无索引时：数据库执行 SELECT 或 WHERE 查询需逐行扫描整张表（全表扫描），数据量越大越慢。

有索引时：数据库可快速定位到目标数据位置，大幅减少 I/O 操作和比较次数。

#### 索引原理

以 MySQL `InnoDB`（存储引擎） 为例，`默认使用 B+ 树（B+ Tree）`作为索引结构：

B树结构：
![b树](/b_tree.png)

:::tip B树特点
- 所有节点（包括非叶子节点和叶子节点）`都存储了索引键值和对应的真实数据`。
- 叶子节点之间是`相互独立`的，没有直接的指针连接。
- 因为每个节点都存了真实数据,节点占用空间大,一个磁盘页（Page）能容纳的节点数变少。树会变得“高瘦”。查询时需要的磁盘 I/O 次数较多。
  :::

B+树结构：
![b+树](/b+_tree.png)

:::tip B+树特点
- `所有数据都只存储在叶子节点，非叶子节点(即根节点和内部节点)只存索引键值和指向子节点的指针`。
- 叶子节点之间用`双向链表`连接，便于范围查询
- 非叶子节点不存数据，只存索引，一个节点可以容纳极多的索引键值，树变得非常“矮胖”。通常 3 到 4 层的 B+ 树就能存储上千万条数据，每次查询最多只需 3 到 4 次磁盘 I/O，效率极高。
  :::
  :::warning 数据库索引结构为什么不使用哈希索引和二叉树索引结构？
- **哈希索引结构**：

  哈希索引就是采用一定的hash算法，将键值换算成新的hash值，映射到对应的槽位上，然后存储在hash表中。

  哈希索引只适合等值查询（如=，in），不适合范围查询（如between,>,like），且数据量较大时，索引效率会下降。

  如果两个(或多个)键值，映射到一个相同的槽位上，他们就产生了hash冲突(也称为hash碰撞)，可以通过链表来解决。但是链表遍历会导致额外的磁盘读取，性能急剧下降。

- **二叉树索引结构**：

  二叉树每个节点最多只有 2 个子节点。如果查询量过大则树高度可能过高，磁盘I/O负担太重。

  如果插入的数据是有序的（如 1, 2, 3, 4...），普通的二叉搜索树会退化成一条单链表，查询性能极差。

  虽然使用红黑树等平衡二叉树可以解决单链表问题，但它们是“二叉”的，依然无法解决树高过高和磁盘 I/O 频繁的问题
  :::


#### 常见索引类型

:::code-group
```sql [innodb中按索引存储形式划分]
-- 1.聚集索引
-- 通常直接通过关键字PRIMARY自动创建，隐式包含 NOT NULL（不能为空） 和 UNIQUE（不能重复） 约束，一张表只能有一个主键。
-- 聚集索引（b+树）下的叶子节点通常存储的是数据表中某一行的数据，所以通常比使用了二级索引的SQL查询快

id INT PRIMARY KEY AUTO_INCREMENT


-- 2.二级索引
-- 二级索引的叶子节点存储的是索引列的值 + 主键值（即所属那行数据的主键ID）。查询时通常需要“回表查询”（拿到主键后再去聚簇索引查完整的行数据），比使用了聚集索引的SQL查询慢。
-- 适用查询：SELECT * FROM users WHERE email = 'test@example.com';
-- 执行流程：先在 idx_email 找到对应的主键 id，再回表查完整数据。
-- 适合高频查询的字段（如 WHERE city = '北京'）建普通索引。
-- 避免给低区分度字段建索引（比如“性别”只有男/女，建了也快不了多少）。

CREATE INDEX idx_email ON users(email);

```


```sql [按逻辑功能划分]
-- 1.主键索引
--唯一且非空，相当于InnoDB 中聚集索引。

id INT PRIMARY KEY AUTO_INCREMENT


-- 2.唯一索引
-- 通常直接通过关键字UNIQUE自动创建。要求该列的值不允许出现重复，如邮箱、手机号。
-- 一张表可以有多个唯一索引，且可以为 NULL。

CREATE UNIQUE INDEX idx_email ON users(email);

-- 3.联合索引
-- 对多个列组合创建索引，顺序很重要！
-- 最左前缀原则：查询条件必须从索引的最左列开始，且连续使用。
-- WHERE name = 'Alice'（索引生效）
-- WHERE name = 'Alice' AND age = 25（索引生效）
-- WHERE age = 25（索引失效！最左前缀原则）
-- 使用ORDER BY/GROUP BY多字段排序/分组时也尽量使用最左前缀原则。


CREATE INDEX idx_name_age ON users(name, age);


-- 4.全文索引
-- 只能对 CHAR、VARCHAR、TEXT 类型的列创建全文索引。
-- 建议只用于大段文本的模糊搜索（如博客、评论），需要搜索特定单词、短语或进行相关性排序的场景。
-- 不要用 LIKE '%xxx%' 做全文搜索（性能极差），改用全文索引。
-- 中文分词需额外处理（MySQL 默认按空格/标点分词，对中文不友好，可配合 Elasticsearch）。
-- 对单个字段建全文索引
CREATE FULLTEXT INDEX idx_content ON articles (content);

-- 对多个字段建联合全文索引
CREATE FULLTEXT INDEX idx_title_content ON articles (title, content);




-- 5.前缀索引
-- 适用于字段值很长（如 URL、长邮箱），且前几个字符就具有极高区分度（选择性高），主要用于精确匹配或前缀匹配的场景。
-- 对用户表的 email 字段，只取前 10 个字符建立索引
CREATE INDEX idx_email_prefix ON users(email(10));
-- 缺点：无法实现覆盖索引（必然回表）：因为索引树中只存了前缀字符，没有完整的字符串。当你的 SELECT 或 WHERE 需要用到完整字段时，必须拿着主键回聚簇索引校验完整数据。
```

:::


:::tip 索引操作
- 创建索引：`CREATE [UNIQUE | FULLTEXT] INDEX index_name ON table_name (column_name);`
- 删除索引：`DROP INDEX index_name ON table_name;`
- 查看索引：`SHOW INDEX FROM table_name;`
:::

#### 索引失效的情况

**1.对索引列进行数学计算或调用函数**
```sql
-- 对索引列使用DATE函数，索引失效
WHERE DATE(create_time) = '2026-06-30'

-- 优化：将函数或计算移到等号的右边，改为范围查询或等值查询。
WHERE create_time >= '2026-06-30 00:00:00' AND create_time < '2026-07-01 00:00:00'
```

**2. 使用联合索引违反最左前缀原则** 
```sql
-- 假设：创建了联合索引 (a, b, c)：

-- 完全不走索引（跳过了 a）
WHERE b = 2
-- 仅 a 走索引，c 无法走索引（跳过了 b）
WHERE a = 1 AND c = 3
-- 优化方案：确保查询从最左列开始且不跳过中间列
WHERE a = 1 AND b = 2 AND c = 3
```

**3.LIKE 以通配符 % 开头**
```sql
-- 索引失效
WHERE name LIKE '%张%'

-- 优化：通配符%放在尾部
WHERE name LIKE '张%'
```

**4.OR 条件中包含非索引字段**
```sql
-- 用 OR 连接多个条件时，只要其中任意一个字段没有索引就会整体索引失效
-- 假设name 字段有索引，age 字段没有索引
WHERE name = '张三' OR age > 18

-- 优化：为 name 字段补充索引或者将 OR 改为 UNION ALL
SELECT * FROM users WHERE name = '张三' UNION ALL SELECT * FROM users WHERE age > 18
```

**5.发生了隐式类型转换**
```sql
-- 假设 user_id 字段是 VARCHAR 类型
SELECT * FROM user WHERE user_id = 123; 
-- MySQL 内部会将其转为：CAST(user_id AS SIGNED) = 123，导致索引失效
-- 优化：保持数据类型严格一致
```

#### 索引控制提示

假设某个字段A既存在于单列索引中，也存在于联合索引中，如果某个查询SQL同时触发了两种索引的条件，那么MySQL会优先使用最合适的索引，也可以人为指定使用哪种索引。

```sql
-- USE INDEX（建议使用指定索引）
-- 告诉 MySQL 在查询时建议使用指定的索引，但 MySQL 内部仍会根据成本评估，如果不合适它可能依然不用。
SELECT * FROM tb_user USE INDEX(idx_user_pro) WHERE profession = '软件工程';

-- FORCE INDEX（强制使用指定索引）
-- 比 USE INDEX 更强硬，强制 MySQL 必须使用指定的索引（除非该索引根本无法用于此查询）。
SELECT * FROM tb_user FORCE INDEX(idx_user_pro) WHERE profession = '软件工程';


-- IGNORE INDEX（忽略指定索引）
-- 强制 MySQL 在查询时不要使用某个索引。通常用于某个索引统计信息过期，导致优化器错误地选择了它。
SELECT * FROM tb_user IGNORE INDEX(idx_user_pro) WHERE profession = '软件工程';



```


#### 索引优缺点

优点：

- **加快查询速度**：尤其对 WHERE、JOIN、ORDER BY、GROUP BY 等操作效果显著。
- **保证数据唯一性**：唯一索引（UNIQUE）可防止重复数据插入。
- **优化排序和分组**：避免临时表和文件排序（Using filesort）。
- **提升连接性能**：JOIN 操作中，被驱动表若有索引可大幅减少匹配次数。

缺点：
- **占用存储空间**：每个索引都需要额外磁盘空间。
- **降低写入性能**：
  INSERT、UPDATE、DELETE 时需同步维护索引结构（B+树的插入/删除/分裂）。
  索引越多，写操作越慢。
- **维护成本高**：过多索引增加数据库复杂度，需定期分析和优化。


:::tip 适合使用索引的场景

- 列经常出现在 WHERE、JOIN、ORDER BY、GROUP BY 中；
- 列的值范围很大，不确定性高（即唯一值多，如邮箱、手机号）；
- 表数据量大（小表加索引可能反而更慢）并且查询较为频繁。
- 列更新不频繁（频繁则维护成本高）
:::

### 性能分析

#### 1. 查看SQL执行频次

```sql
# 查看全局执行频次（自数据库启动以来的累计数据）
SHOW GLOBAL STATUS LIKE 'Com_______';

# 查看会话执行频次（当前连接的累计数据）
SHOW SESSION STATUS LIKE 'Com_______';
```

- `Com_select`：查询（SELECT）操作的次数。
- `Com_insert`：插入（INSERT）操作的次数。
- `Com_update`：更新（UPDATE）操作的次数。
- `Com_delete`：删除（DELETE）操作的次数。

#### 2. 获取慢查询日志

慢查询日志（slow query log）是 MySQL 数据库的一个功能，用于记录执行时间超过阈值的 SQL 语句。

慢查询日志`默认是关闭`的，可以通过以下命令开启：


:::code-group
```sql [临时开启]
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
```
```ini [永久开启]
# 在配置文件/etc/my.cnf 的 [mysqld] 下添加：

slow_query_log = 1  #开启慢查询日志  #[!code ++]
slow_query_log_file = /var/log/mysql/mysql-slow.log  #设置慢查询日志文件路径  #[!code ++]
long_query_time = 1  #设置执行时间阈值（秒）  #[!code ++]

# 保存修改然后重启mysql
```
:::

#### 3.EXPLAIN

EXPLAIN 是 MySQL 中用于 分析 SQL 查询执行计划 的核心工具。

它能告诉你 MySQL 如何执行一条 SELECT（或 UPDATE/DELETE）语句，包括是否使用索引、是否全表扫描、关联顺序等，是**SQL 性能优化**的第一步。


输出字段详解：

| 列名 | 说明                                                                                                                          |
|------|-----------------------------------------------------------------------------------------------------------------------------|
| id | 查询序列号。相同表示同一组，越大越先执行（子查询时有用）                                                                                                |
| select_type | 查询类型：SIMPLE（简单查询）、PRIMARY（最外层）、SUBQUERY（子查询）、DERIVED（派生表）等                                                                  |
| table | 当前行所访问的表名                                                                                                                   |
| partitions | 匹配的分区（未分区则为 NULL）                                                                                                           |
| `type` | **访问类型（最重要！）**，性能从好到差：<br>`null`>`system` > `const` > `eq_ref` > `ref` > `range` > `index` > `ALL`<br>⚠️ 出现 `ALL` 表示全表扫描，需警惕 |
| possible_keys | 可能用到的索引                                                                                                                     |
| `key` | `实际使用的索引（NULL表示没走索引）`                                                                                                       |
| key_len | 使用索引的长度（字节），可判断复合索引用了几列                                                                                                     |
| ref | 与索引比较的列或常量（如 `const` 表示用常量值匹配）                                                                                              |
| `rows` | `预估需要扫描的行数（越小越好`）                                                                                                           |
| filtered | 按条件过滤后剩余的百分比（估算）                                                                                                            |
| `Extra` | 额外信息，常见值：<br>- `Using index`：`覆盖索引（极好）`<br>- Using where：回表过滤<br>- Using filesort：需要额外排序（性能差）<br>- Using temporary：用了临时表（性能差）   |

:::tip 覆盖索引
当你的 SQL 查询所需要的所有字段，都恰好包含在某个索引（通常是联合索引）的 B+ 树中时，MySQL 就可以直接从索引树上返回数据，而不需要再去聚簇索引（主键）中查询完整的行数据。

这就命中了覆盖索引，省去了“回表”操作，极大地提升了查询性能。

要达成覆盖索引，必须同时满足以下条件：
- SELECT 的字段：`查询返回的所有列，都必须存在于该索引中`。
- WHERE 的字段：`查询条件中的列，也必须存在于该索引中`。
- 主键字段（隐式包含）：在 InnoDB 引擎中，所有的二级索引（非聚簇索引）的叶子节点都默认包含了主键值。因此，即使你的 SELECT 或 WHERE 中包含了主键，它也被视为“已覆盖”。

以下情况会命中覆盖索引

创建索引：**CREATE INDEX idx_name_age_pos ON employees(name, age, position)**;

执行SQL：**SELECT name, age, position FROM employees WHERE name = '张三**'


:::
示例：

:::code-group
```sql [命中主键索引]
EXPLAIN SELECT * FROM users WHERE id = 1;

-- 输出：
type: const（性能较好）
key: PRIMARY
Extra: 
```
```sql [全表扫描]
--假设 name 无索引
EXPLAIN SELECT * FROM users WHERE name = 'Alice';

-- 输出：
type: ALL（性能最差）
key: NULL（没走索引）
rows: 100000  -- 扫描了 10 万行！
Extra: Using where
```

```sql [覆盖索引]
--假设 (name, id) 有复合索引
EXPLAIN SELECT id, name FROM users WHERE name = 'Alice';

-- 输出：
type: ref
key: idx_name
Extra: Using index  -- ⭐ 覆盖索引，无需回表
```
```sql [出现 Using filesort]
--若 age 无索引
EXPLAIN SELECT * FROM users ORDER BY age;

-- 输出：
Extra: Using filesort  -- ⚠️ 磁盘排序，慢！

--优化：给 age 加索引：
CREATE INDEX idx_age ON users(age);
```
:::



### 视图

视图（View） 是一个虚拟表，其内容由一条 SELECT 查询语句定义。

视图本身不存储数据，而是每次查询时动态执行底层 SQL 生成结果。


基本语法：

```sql
CREATE [OR REPLACE] VIEW view_name [(column_list)] AS
SELECT column1, column2, ...
FROM table_name
[WHERE ...]
[GROUP BY ...];
```

示例：创建一个“活跃用户”视图

```sql
-- 假设有 users 和 orders 表
CREATE VIEW active_users AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.name, u.email;

-- 像查普通表一样使用它：

SELECT * FROM active_users WHERE order_count > 5;

```

应用场景：

:::code-group
```sql [封装复杂查询]
-- 创建视图，封装复杂的关联逻辑
CREATE VIEW v_order_details AS
SELECT 
    o.order_id, o.order_time, u.username, p.product_name, o.quantity, o.total_amount
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN products p ON o.product_id = p.product_id;

-- 业务层只需像查普通表一样查询视图，极大简化了代码
SELECT * FROM v_order_details WHERE order_time > '2026-01-01';
```
```sql [数据安全控制]
-- 创建视图，隐藏敏感列（salary, id_card），并限制只能看本部门
CREATE VIEW v_dept_employees AS
SELECT emp_name, job_title 
FROM employees 
WHERE department_id = 'TECH_DEPT';

-- 将视图的查询权限授予部门经理，而非底层基表
GRANT SELECT ON v_dept_employees TO 'manager'@'%';

```
```sql [提供稳定的数据接口]
-- 当底层的表结构发生变更（如字段重命名、表拆分）时，如果业务代码直接依赖基表，修改成本极高。通过视图，可以做到底层改动对上层透明
-- 场景：原来的 users 表被拆分为 user_base（基本信息）和 user_profiles（扩展信息），但旧版 API 仍需要原来的表结构。
-- 创建视图，保持旧表结构不变，底层映射到新表
CREATE VIEW v_users_legacy AS
SELECT 
    b.id, b.username, p.phone, p.address
FROM user_base b
LEFT JOIN user_profiles p ON b.id = p.user_id;
```
:::



:::tip 最佳实践

- 视图名加前缀，如 v_active_users 或 vw_user_summary
- 简单查询无需视图
- 用 COMMENT 说明视图用途
    ```sql
    CREATE VIEW active_users COMMENT '近30天有订单的活跃用户' AS ... 
    ```
- 如果视图包含了聚合函数（SUM）、GROUP BY、DISTINCT 或多表 JOIN，通常是不可更新的。`建议将视图仅作为只读查询使用`。
- 尽量不要在一个视图的基础上再创建视图（`视图套视图`），这会导致底层 SQL 极其复杂
  :::


### 存储过程

存储过程（Stored Procedure）是一组预先编译并存储在数据库中的 SQL 语句集合。你可以把它理解为“数据库里的方法”，它可以**接受参数、执行复杂的业务逻辑，并返回结果**。

:::code-group
```sql [处理员工薪资]
-- 创建存储过程

CREATE PROCEDURE process_salary(
    IN emp_id INT,            -- 1. IN参数：传入员工ID，用于查询
    OUT emp_name VARCHAR(50), -- 2. OUT参数：用于返回该员工的姓名
    INOUT bonus DECIMAL(10,2) -- 3. INOUT参数：传入基础奖金，内部计算后返回最终奖金
)
BEGIN
    -- 使用 IN 参数进行查询，并将结果赋值给 OUT 参数
    SELECT name INTO emp_name FROM employees WHERE id = emp_id;
    
    -- 读取 INOUT 参数的值，进行业务计算，然后重新赋值
    -- 假设根据绩效，奖金翻倍
    SET bonus = bonus * 2; 
END;


-- 调用存储过程
-- 1. 定义用户变量，用于接收 INOUT 和 OUT 的结果
SET @my_bonus = 5000.00; 

-- 2. 调用存储过程
CALL process_salary(1001, @result_name, @my_bonus);

-- 3. 查看返回的输出结果
SELECT @result_name AS 员工姓名, @my_bonus AS 最终奖金;
```
```sql [转账存储]
-- 创建存储过程
CREATE PROCEDURE transfer_money(
    IN from_account INT, 
    IN to_account INT, 
    IN amount DECIMAL(10, 2)
)
BEGIN
    -- 1. 定义异常处理：如果发生错误则回滚事务
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transfer failed due to an error.';
    END;

    -- 2. 开启事务
    START TRANSACTION;
    
    -- 3. 扣减转出账户余额
    UPDATE accounts SET balance = balance - amount WHERE id = from_account;
    
    -- 4. 增加转入账户余额
    UPDATE accounts SET balance = balance + amount WHERE id = to_account;
    
    -- 5. 提交事务
    COMMIT;
END; 


-- 调用存储过程
CALL transfer_money(1001, 1002, 500.00);

```
:::

:::tip 参数类型
- `IN（输入参数）`：只进不出<br/>
  **默认**的参数模式。调用者将数据传递给存储过程，存储过程内部可以读取和修改这个值，但修改后的值不会返回给调用者。<br/>
  适用场景：用于传入查询条件、配置项或计算所需的初始数据。<br/>
- `OUT（输出参数）`：只出不进<br/>
   含义：调用者传入一个变量作为占位符，存储过程内部必须对该参数进行赋值，执行结束后，这个被赋的值会返回给调用者。<br/>
   适用场景：用于返回查询结果的总数、新插入记录的主键 ID、或者某个复杂计算的最终结果。<br/>
- `INOUT（输入输出参数）`：有进有出<br/>
   含义：结合了前两者的特点。调用者传入一个具体的值，存储过程内部可以读取它、对其进行修改，并将修改后的新值返回给调用者。<br/>
   适用场景：常用于累加计算、计数器、或者对传入的数据进行格式化/转换后再返回。<br/>
:::



应用场景：

- **复杂业务逻辑封装与事务处理**：将多步操作（如：扣减库存 -> 生成订单 -> 记录流水）封装在一个过程中，并结合事务（Transaction）保证原子性，要么全部成功，要么全部失败。
- **批量处理数据**：利用存储过程配合循环（如 WHILE）和游标（Cursor）逐行处理海量数据，减少客户端与数据库的网络交互开销。
- **权限控制**：只开放存储过程的 EXECUTE 权限，而不给用户底层表的直接访问权限。这样既能实现业务需求，又能隐藏底层表结构，防止 SQL 注入或越权操作。

存储过程的缺陷：

- **版本管理与部署困难**：存储过程代码存储在数据库中，不像应用代码那样容易进行 Git 版本控制
- **调试困难**：缺乏像现代编程语言那样完善的断点调试工具
- **跨平台移植性差**：更换数据库，存储过程需要完全重写
- **性能瓶颈与锁风险**：如果在存储过程中编写了低效的 SQL，或者在长事务中使用了大循环、游标，极易引发严重的表锁或行锁等待，成为高并发环境下的性能瓶颈。

### 存储函数

存储函数是一组预定义的 SQL 逻辑单元，它可以**接收参数，执行计算或查询，并返回一个单一的值**。它的使用方式与 MySQL 内置函数（如 SUM()、LENGTH()）完全一样。

创建存储函数：
```sql
-- 根据商品价格和税率计算销售税
CREATE FUNCTION calculate_sales_tax(price DECIMAL(10, 2), tax_rate DECIMAL(4, 2)) 
RETURNS DECIMAL(10, 2)
BEGIN
    RETURN price * (tax_rate / 100);
END; 
```
调用存储函数：
```sql
-- 在 SELECT 中直接调用
SELECT product_name, price, calculate_sales_tax(price, 13.00) AS tax FROM products;

-- 在 INSERT 中直接调用
INSERT INTO sales (product_id, total_tax) VALUES (1, calculate_sales_tax(100.00, 13.00));
```

:::tip 存储函数与存储过程对比
- 共同点：都需要显式调用并支持参数和返回值
- 不同点：存储过程支持多种参数类型，并且在`应用层`调用；存储函数只支持`IN`参数类型，需要在`SQL语句`中调用
- 存储函数：适合封装`可复用的计算逻辑`，例如汇率转换、格式化字符串、计算税费等，提升代码复用率；
- 存储过程：适合封装`复杂的业务流程`，例如包含事务的转账操作。可以减少网络交互，提高性能。
:::


### 触发器

触发器是一种特殊的存储过程，它与某张表绑定。当对该表执行 INSERT、UPDATE 或 DELETE 操作时，触发器会`自动执行，无需手动调用`。


:::code-group

```sql [员工薪资下限校验]
-- 当向员工表插入新数据时，自动检查薪资是否低于最低标准，如果低于则直接抛出错误阻止插入：

CREATE TRIGGER check_salary
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    IF NEW.salary < 3000 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Salary must be at least 3000.';
    END IF;
END;

```
```sql [薪资变更审计日志]
-- 当员工薪资被修改后，自动将旧薪资、新薪资和修改时间记录到审计表中
-- OLD表示修改前的数据，NEW表示修改后的数据

CREATE TRIGGER after_employee_update
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (employee_id, old_salary, new_salary, update_time)
    VALUES (OLD.id, OLD.salary, NEW.salary, NOW());
END;

```
:::
>适用场景：用于数据完整性约束、审计日志、数据校验等自动化操作


## 锁

MySQL 中的锁机制是数据库并发控制的核心，主要用于`保证多个事务在同时访问和修改数据时的数据安全与一致性`。

#### 1.全局锁

对整个数据库实例加锁，使整个库处于只读状态。

常用于`全库逻辑备份`（避免备份过程中仍有数据写入操作,保证数据一致性）。

```sql
-- 加锁
FLUSH TABLES WITH READ LOCK;

-- 释放锁
UNLOCK TABLES;

```

:::warning 全局锁缺陷
- **主库加锁导致业务停摆**：如果在业务主库执行全局锁备份，备份期间所有核心写操作都会被阻塞，等同于业务暂停。
- **从库加锁引发主从延迟**：如果在从库上加全局锁，从库会拒绝执行主库同步过来的二进制日志（binlog），导致增量数据无法正常同步，引发主从延迟。
:::


#### 2.表级锁

每次操作锁定整张表。开销小、加锁快，但并发度最低。

表级别的锁主要包括手动表锁、元数据锁（MDL）和意向锁。


- `手动加表锁`

  包含两种类型： `READ`：允许其他会话共享读锁，但禁止写; `WRITE`：独占写锁，排斥其他所有会话的读写行为
  ```sql
  -- 加锁
  LOCK TABLES [表名] READ/WRITE;
  
  -- 释放锁
  UNLOCK TABLES;
  
  ```
- `元数据锁`

  MySQL5.5中引入了元数据锁（MDL）,元数据锁是**系统自动控制，无需显式使用**
  
  当对表执行 DML 操作（增删改查）时，会自动加上 MDL 读锁。读锁之间互相兼容，不会阻塞其他线程的增删改查操作，但会阻止修改表结构。
  
  当对表执行 DDL 操作（如创建、修改、删除表）时，会自动加上 MDL 写锁。写锁与所有的读锁、写锁均互斥，即拥有写锁的线程才能更新表结构，其他线程既不能修改结构，也不能执行增删改查。

- `意向锁`

  意向锁由 InnoDB **自动维护，开发者无需手动干预**。当事务准备对表中的某些行加锁时，会先对整个表加上对应的意向锁：

  如果没有意向锁，当一个事务想要对整张表加表级锁时，系统必须逐行扫描检查表中是否已经存在行锁，这在海量数据下性能极差。
  
  引入意向锁后，系统只需检查表级的意向锁即可快速判断是否存在冲突，无需遍历每一行数据。
  
  
  
  `意向共享锁（IS 锁）`：事务在请求某行的共享锁（S锁，读锁）前，会先获取该表的 IS 锁。
  
  `意向排他锁（IX 锁）`：事务在请求某行的排他锁（X锁，写锁）前，会先获取该表的 IX 锁。



:::danger 注意
- `避免在 InnoDB 中手动使用 LOCK TABLES`，该语句并非事务安全机制，它会隐式提交当前活跃事务，且与 InnoDB 自带的行级锁机制产生冲突，极易引发复杂的锁表现和难以排查的问题。
- 元数据锁的作用：维护表元数据（即表结构）的数据一致性，避免 DML（增删改查）与 DDL（表结构变更）操作并发执行导致的数据不一致问题。
- 意向锁的作用：解决行锁与表锁的冲突检测效率问题，`允许行锁和表锁共存`。
:::

#### 3.行级锁

每次操作只锁定具体的某一行数据。开销大、加锁慢，但并发度最高。

行级锁包含行锁，间隙锁，临键锁：

- `行锁`(Record Lock)

   锁定单个行记录的锁，防止其他事务对此行进行update和delete。在RC，RR隔离级别下都支持。

   行锁包括以下两种类型：

  `共享锁（Shared Lock, S Lock / 读锁）`：允许多个事务同时读取同一行数据，但会阻止其他事务获取排他锁（即阻止修改）。

  `排他锁（Exclusive Lock, X Lock / 写锁）`：允许获取锁的事务读写该行数据，同时阻止其他事务获取共享锁和排他锁。

- `间隙锁`(GapLock)

   锁定索引记录间限(不含该记录)，确保索引记录间隙不变，**防止其他事务在这个间隙进行insert，产生幻读**。在RR隔高级别下都支持。

- `临键锁`(Next-Key Lock)

   行锁和间隙锁组合，同时锁住数据，并锁住数据前面的间隙Gap。在RR隔离级别下支持。

:::tip
`行级锁通常由 InnoDB 引擎自动管理`。在执行 UPDATE、DELETE、INSERT 等写操作时，InnoDB 会自动为涉及到的记录加上`排他锁`。
:::


## 日志


由于不同系统或自定义配置会导致日志路径不同，建议优先通过 SQL 命令查询当前实例的日志位置：

获取日志位置：
```sql
-- 错误日志

SHOW VARIABLES LIKE 'log_error';

-- 二进制日志

SHOW VARIABLES LIKE 'log_bin_basename';

-- 慢查询日志

SHOW VARIABLES LIKE 'slow_query_log_file';

-- 通用查询日志

SHOW VARIABLES LIKE 'general_log_file';

```


查看日志内容：

:::code-group
```bash [错误日志]
#记录 MySQL 启动、停止和运行过程中的异常、警告及故障信息，是排查数据库问题的首选。

# 1.Linux 实时追踪：
sudo tail -f /var/log/mysql/error.log

# 2. 搜索特定错误
sudo grep -i "error" /var/log/mysql/error.log

#3. 查看最后100行
sudo tail -100 /var/log/mysql/error.log
```

```bash [二进制日志]
# 记录所有数据变更操作（DDL 和 DML），不含数据查询的日志，用于数据恢复和主从复制。
# 由于是二进制格式，不能直接用文本编辑器打开，必须使用专用工具或命令。

# 使用 mysqlbinlog 工具解析（命令行）：
# 基础查看

mysqlbinlog /var/lib/mysql/mysql-bin.000001

# 按时间范围过滤：

mysqlbinlog --start-datetime="2025-01-01 00:00:00" --stop-datetime="2025-01-01 12:00:00" mysql-bin.000001
```
```bash [通用查询日志]
# 记录客户端的所有连接和执行的 SQL 语句。由于数据量极大，默认处于关闭状态，仅在特定排查时开启。
# 临时开启
SET GLOBAL general_log = ON;

# 实时追踪
sudo tail -f /var/log/mysql/general.log
```
:::

> 慢查询日志详见：[慢查询日志](/backend/database/mysql.html#_2-获取慢查询日志)


## 主从复制

主从复制允许将一个`主库（Master）`的数据变更，自动且实时地同步到一个或多个`从库（Slave）`上。

作用：

- **读写分离**：主库专门负责处理写操作（INSERT/UPDATE/DELETE），从库负责处理读操作（SELECT）。这能有效分担主库压力，提升系统整体性能。
- **数据备份与容灾**：从库是主库的实时热备。当主库发生硬件故障或数据误删时，可以快速将从库提升为新的主库，保障业务不中断。
- **数据分析与报表**：可以在从库上执行复杂的报表查询或数据分析任务，避免这些耗时操作影响主库的在线业务。
- **负载均衡**：通过将读请求分散到多个从库，可以水平扩展读取能力，应对高并发访问。


### 工作原理

- **Binlog Dump 线程（主库）**：主库在发生数据变更时，将操作记录到二进制日志（Binlog）中。当从库发起连接后，主库会创建该线程，负责将 Binlog 中的事件发送给从库。
- **I/O 线程（从库）**：从库启动复制后，I/O 线程连接到主库，请求并接收 `Binlog` 事件，然后将其写入到从库本地的`中继日志（Relay Log）`文件中。
- **SQL 线程（从库）**：从库的 SQL 线程会不间断地读取 Relay Log 中的指令，解析并在从库上重放执行，最终使从库数据与主库保持一致。


### 搭建步骤

#### 主库配置

1. 修改配置文件 `/etc/my.cnf`，开启二进制日志并设置唯一ID：
```ini
[mysqld]
server-id = 1                # 主库唯一ID
read-only = 0                # 1表示只读，0表示读写
log-bin = mysql-bin          # 开启二进制日志
binlog-format = ROW          # 推荐使用ROW格式，数据一致性更好

```
2. 重启 MySQL：
```shell
systemctl restart mysqld
```
3. 登录mysql并创建远程连接的账号并授权主从复制：
```sql
-- 创建账号
CREATE USER 'repl_user'@'%' IDENTIFIED BY 'StrongPassword!';

-- 分配主从复制权限
GRANT REPLICATION SLAVE ON *.* TO 'repl_user'@'%';

-- 刷新权限
FLUSH PRIVILEGES; 
```

4. 查看日志写入路径
```sql
SHOW MASTER STATUS; 
```
