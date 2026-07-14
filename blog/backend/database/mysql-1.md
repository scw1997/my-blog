# MySQL（上）

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

示例见：[外键Foreign Key](/backend/database/mysql-1.html#外键foreign-key)

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

