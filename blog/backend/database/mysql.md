# MySQL

## SQL vs MySql

SQL 是操作数据库的“语言”，MySQL 是实现这种语言的“数据库系统”之一。

## 数据库分类

#### 关系型数据库

- **特点**：数据以“表（Table）”形式存储，行（记录）与列（字段）结构清晰，支持 SQL 查询，强调 ACID 事务。
- **代表系统**：
    - MySQL、PostgreSQL（开源）
    - Oracle、Microsoft SQL Server、IBM Db2（商业）
    - SQLite（嵌入式）
- **适用场景**：金融交易、ERP、CRM、需要强一致性和复杂查询的业务。

- **优势**：成熟、稳定、支持复杂 JOIN 和事务  
- **劣势**：水平扩展难，不适合非结构化数据

---

#### 非关系型数据库

为应对高并发、海量数据、灵活 schema 等需求而兴起，进一步细分为四类：

##### （1）文档型数据库
- **数据模型**：以 JSON/BSON 格式存储“文档”，类似嵌套对象。
- **代表**：MongoDB、Couchbase、Firebase
- **适用**：内容管理、用户画像、日志分析

##### (2) 键值型数据库
- **数据模型**：简单的 key → value 映射，value 可为任意类型（字符串、二进制等）。
- **代表**：Redis（内存）、DynamoDB（云）、Riak
- **适用**：缓存、会话存储、购物车、计数器

##### (3) 列族数据库
- **数据模型**：按列存储（非关系型“列”），适合稀疏数据和大规模读写。
- **代表**：Apache Cassandra、HBase、ScyllaDB
- **适用**：时序数据、物联网（IoT）、消息系统

##### (4) 图数据库
- **数据模型**：以“节点（Node）”和“边（Edge）”表示实体与关系。
- **代表**：Neo4j、Amazon Neptune、JanusGraph
- **适用**：社交网络、欺诈检测、推荐系统（关系密集型场景）



## 安装/启动

#### windows平台

以`mysql 8.0`为例

> 官网下载链接：https://dev.mysql.com/downloads/installer/

#### 1.安装
1. 双击 `.msi` 文件运行安装向导
2. 选择 **“Developer Default”**（开发默认配置，包含 Server + Workbench）
3. 点击 “Execute” 安装依赖（如 Visual C++ Redistributable）
4. 进入 **Configuration Steps**：
    - **Type and Networking**：选 “Development Computer”
    - **Authentication Method**：**强烈建议选 “Use Strong Password Encryption”**（兼容新应用）
    - **Accounts and Roles**：设置 **root 用户密码**（务必记住！）
    - 其他保持默认，一路 Next 直到 Finish

> 💡 安装过程中会自动注册 Windows 服务（服务名如 `MySQL80`）

#### 2：启动 MySQL 服务
- 方法 1（图形界面）：
    - 按 `Win + R` → 输入 `services.msc`
    - 找到 **MySQL80** → 右键 → **启动**
- 方法 2（命令行，管理员权限）：
  ```cmd
  net start MySQL80
  ```
  
#### 3.添加环境变量

<br/>

#####  方法 1：图形界面（推荐）
1. 按 `Win + S`，搜索 **“环境变量”** → 选择 **“编辑系统环境变量”**
2. 点击 **“环境变量...”** 按钮
3. 在 **“系统变量”** 区域，找到并选中 `Path`，点击 **“编辑”**
4. 点击 **“新建”**，然后粘贴你的 MySQL Server `bin` 路径，一般默认为：
   ```
   C:\Program Files\MySQL\MySQL Server 8.0\bin
   ```
5. 点击 **确定** 保存所有窗口

##### 方法 2：命令行（管理员权限）
```cmd
setx /M PATH "%PATH%;C:\Program Files\MySQL\MySQL Server 8.0\bin"
```
> ⚠️ 注意：`setx` 修改后需**重新打开 CMD** 才生效。


#### 4：连接测试
1. 打开命令提示符（CMD）
2. 进入 MySQL（Mysql Server） bin 目录或任意目录（已添加环境变量情况下）：
   ```cmd
   mysql -u root -p
   ```
3. 输入安装时设置的 root 密码
4. 成功进入 `mysql>` 提示符即表示运行正常

**验证安装启动成功**：
```sql
SELECT VERSION();
SHOW DATABASES;
```

## SQL语句

### 分类

| 类别 | 作用                         | 主要语句 | 特点       |  
|------|----------------------------|--------|----------|
| DDL | 定义或修改数据库的结构，如创建/删除表、索引、视图等。 | `CREATE`, `ALTER`, `DROP` | 自动提交（执行后立即生效，不能回滚）。 | 
| DML | 对表中的数据进行增删改查。              | `INSERT`, `UPDATE`, `DELETE`, `SELECT` | 可回滚（在事务中），需手动 COMMIT 提交。 |
| DCL | 控制数据库访问权限和安全，管理用户角色与权限。      | `GRANT`, `REVOKE` | —  | 
| TCL | 管理事务，确保数据一致性（ACID 特性）。 | `COMMIT`, `ROLLBACK`, `SAVEPOINT` | —        | 
| DQL | 专门用于查询数据        | `SELECT` | —        | 

此外，一些常用命令有：

- `USE database_name;`：选择数据库
- `SHOW databases;`：查看所有数据库
- `SHOW tables;`：查看当前数据库的所有表
- `DESCRIBE table_name;`：查看表结构（数据）

### 书写规范

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
- 避免使用` SELECT *`
- 避免使用`!=`来表达不等于（非SQL标准，有安全隐患），应该用 `<>`
- 使用`NOT` 逻辑运算符可以进行补集逻辑
    ````sql
    --筛选sale_price小于1000的 产品（等价于使用<）
    SELECT product_name, product_type, sale_price
    FROM Product
    WHERE NOT sale_price >= 1000; 
    ````

- WHERE 条件注意 NULL 处理（NULL 不能用 =, != 判断（否则会返回`UNKNOWN`值，而不是TRUE/FALSE，而WHERE只取返回TRUE的结果），需用 `IS NULL / IS NOT NULL`）
    ```sql
    -- ❌ 错误（会忽视掉status为NUll的数据）
    WHERE status != 'deleted' 
    
    -- ✅ 正确（若 status 可能为 NULL）
    WHERE status IS NULL OR status != 'deleted'
    -- 或
    WHERE COALESCE(status, '') != 'deleted'
    ```

### 数据类型

#### （1）整数


| 类型 | 范围（有符号） | 存储空间 | 说明                      |
|------|----------------|--------|-------------------------|
| `TINYINT` | -128 ～ 127 | 1 字节 | 常用于状态标志（0/1）            |
| `SMALLINT` | -32,768 ～ 32,767 | 2 字节 | —                       |
| `MEDIUMINT` | -8,388,608 ～ 8,388,607 | 3 字节 | MySQL 特有                |
| `INT` / `INTEGER` | -2³¹ ～ 2³¹-1（约 ±21 亿） | 4 字节 | 最常用整数类型                 |
| `BIGINT` | -2⁶³ ～ 2⁶³-1（约 ±9e18） | 8 字节 | 用于 ID、计数器等大数。**避免过度使用** |

#### （2）小数

| 类型 | 说明 | 精度问题                    | 适用场景 |
|------|------|-------------------------|--------|
| `FLOAT` | 单精度浮点 | ❌ 有舍入误差（约 6～9 位十进制有效数字） | 科学计算、近似值 |
| `DOUBLE` | 双精度浮点 | ❌ 有舍入误差（约 15～17 位十进制有效数字）               | 同上 |
| `DECIMAL(M,D)` | 定点数（精确） | ✅ 无误差                   | 金额、财务数据 |

> DECIMAL(10,2) 表示：总共 10 位数字，小数占 2 位（如 12345678.99）

:::tip 单精度 vs 双精度

假设要存储数字：123456789.123456789

| 类型 | 存储结果（近似值） | 丢失精度 |
|------|------------------|--------|
| 单精度 (`float`) | `123456792.0` | 后几位完全错误 |
| 双精度 (`double`) | `123456789.12345679` | 保留前 15～16 位 |
:::


#### （3）字符串

| 类型 | 最大长度 | 存储特点       | 适用场景                |
|------|--------|------------|---------------------|
| `CHAR(n)` | 255 字符 | 固定长度，不足补空格 | 短且长度固定（如国家代码 `'CN'`） |
| `VARCHAR(n)` | 65,535 字节 | 可变长度，节省空间  | 最常用（用户名、标题等）        |
| `TINYTEXT` | 255 字节 | —          |          —           |
| `TEXT` | 65,535 字节（≈64KB） |  —   |  博客正文、评论                   |
| `MEDIUMTEXT` | 16MB | —          | —                   |
| `LONGTEXT` | 4GB | —         | 小说、日志等超大文本          |
| `ENUM` | — | — | 枚举值，可指定 |
| `SET` | — | — | 枚举值，可指定多个 |
| `BINARY(n)` | 255 字节 | 固定长度，非 ASCII 字符用十六进制表示 | 二进制数据 |
| `VARBINARY(n)` | 255 字节 | 可变长度，非 ASCII 字符用十六进制表示 | 二进制数据 |
| `BLOB` | 65,535 字节 | — | 二进制数据 |

> TEXT 类型不能有默认值，且排序时只用前若干字节。

#### （4）日期和时间

| 类型 | 格式 | 范围 | 精度 | 说明 |
|------|------|------|------|------|
| `DATE` | `YYYY-MM-DD` | 1000-01-01 ～ 9999-12-31 | 天 | 仅日期 |
| `TIME` | `HH:MM:SS` | -838:59:59 ～ 838:59:59 | 秒 | 仅时间（可表示时长） |
| `DATETIME` | `YYYY-MM-DD HH:MM:SS` | 1000-01-01 00:00:00 ～ 9999-12-31 23:59:59 | 秒（支持微秒） | 常用，与时区无关 |
| `TIMESTAMP` | 同上 | 1970-01-01 00:00:01 UTC ～ 2038-01-19 03:14:07 UTC | 秒（支持微秒） | 自动转时区，受系统时区影响 |

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    profile JSON
);
```


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


## 主键PRIMARY KEY

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
- 主键优先使用自增整数（简单高效）或UUID（隐私性好）
- 避免使用自然主键（如用“身份证号”、“邮箱”作主键），因为这些数据长度大且可能会修改。
- 分布式系统考虑 UUID（全局唯一，适合分库分表）
- 避免主键进行更新，因为会导致`索引重建和外键级联更新（可能锁表）`。
:::


## 聚合

MySQL 的聚合函数（Aggregate Functions） 用于对一组值执行计算，并返回单个汇总结果。它们通常与 GROUP BY 子句配合使用，是数据分析、报表统计的核心工具。

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


- `COUNT(*)`：统计所有行数（包括 NULL 和重复值）
- `COUNT(column)`：统计指定列非 NULL 的行数
- `SUM(column)`：对数值列求和，忽略 NULL。如果所有值都是 NULL，返回 NULL（不是 0）
- `AVG(column)`：对数值列求平均值，忽略 NULL。如果所有值都是 NULL，返回 NULL（不是 0）。`AVG(column) = SUM(column) / COUNT(column)`

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

### 与GROUP BY（分组）配合使用

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
- `WHERE 不能用聚合函数`。如WHERE AVG(amount) > 100会报错，可改用 HAVING AVG(amount) > 100来进行过滤操作
- 所有非聚合字段必须出现在 GROUP BY 中。例如`SELECT name, COUNT(*) FROM t（若 name 未 GROUP BY）`会报错
:::

### HAVING vs WHERE

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

## 排序

排序是通过`ORDER BY`子句实现的，用于控制查询结果的`行`返回顺序。

基本语法：

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
```
> ASC为升序（默认），DESC为降序

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
- 分页查询必须带 ORDER BY
    ```sql
    -- 最贵的 5 个商品
    SELECT * FROM products
    ORDER BY price DESC
    LIMIT 5;
    
    -- 分页：第 2 页（每页 10 条）
    SELECT * FROM products
    ORDER BY id
    LIMIT 10 OFFSET 10;
    ```
:::


## 数据更新

#### 插入数据

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

#### 修改数据

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;  -- ⚠️ 强烈建议加上！
```

> `必须加 WHERE 条件`。如果省略 WHERE，会更新整张表的所有行，极易造成生产事故！


#### 删除数据

```sql
DELETE FROM table_name
WHERE condition;  -- ⚠️ 强烈建议加上！
```

> `必须加 WHERE 条件`。如果省略 WHERE会删除整张表数据，但表结构保留。


:::tip
- 插入/删除/修改数据操作都`可支持回滚`。
:::

## 事务

用于`将一组数据库操作打包成一个逻辑工作单元`，确保这些操作要么全部成功执行，要么全部不执行，从而保证数据的一致性和可靠性。

事务的特性：

- **原子性**：事务中的所有操作是一个不可分割的整体：要么全做，要么全不做。 
- **一致性**：事务执行前后，数据库必须从一个合法状态转移到另一个合法状态（如满足约束、触发器等）。
- **隔离性**： 多个并发事务之间互不干扰，每个事务都感觉不到其他事务的存在。 
- **持久性**：一旦事务提交（`COMMIT`），其结果将永久保存，即使系统崩溃也不会丢失。 

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

两个操作几乎同时发生（多个事务同时执行），可能引发以下问题：

| 问题        | 描述 | 场景示例                                                             |
|-----------|------|------------------------------------------------------------------|
| **脏读**    | 读到另一个事务未提交的数据 | 事务 B 执行后（未commit），事务A此时读到了余额400，以为钱少了。而后B因为网络异常rollback恢复为1000元。 |
| **不可重复读** | 同一事务内，两次读同一行，结果不同（因被其他事务修改并提交） | 事务 A 第一次查询余额为1000，而后事务B执行完，A再次查询余额为400,前后不一致。                    |                                  |
| **幻读**    | 同一事务内，两次查询返回的行数不同（因其他事务插入/删除了符合条件的行） | 事务A查询了最近的交易数量，事务B执行完交易流程后，A再次查询则数量+1，前后不一致。                      |

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

-- 设置会话级别
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

:::tip 最佳实践

- 事务越短越好,长事务会占用资源、阻塞其他操作、增加死锁风险。
- 避免在事务中处理业务逻辑（如调用外部 API、发送邮件）
- 异常时必须回滚
- 不要在事务中读用户输入
- 合理选择隔离级别：一般业务使用`READ COMMITTED` 或 `REPEATABLE READ`，金融核心系统考虑用`SERIALIZABLE`

:::



## 视图

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


:::tip 最佳实践

- 视图名加前缀，如 v_active_users 或 vw_user_summary
- 简单查询无需视图
- 用 COMMENT 说明视图用途
    ```sql
    CREATE VIEW active_users COMMENT '近30天有订单的活跃用户' AS ... 
    ```
- 视图适合装复杂查询逻辑，兼容旧接口（视图模拟旧表结构）和数据安全控制（创建只暴露部分字段的视图）等场景
:::

## 子查询
子查询（Subquery） 是指嵌套在另一个 SQL 语句中的 SELECT 查询。外层的语句可以是 SELECT、INSERT、UPDATE 或 DELETE，因此子查询也被称为“嵌套查询”。

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
```sql [返回单行单列（一个值）]
-- 可用于 SELECT、WHERE、ORDER BY 等任何需要单个值的地方
-- 也称为标量子查询

-- 查询每个用户的订单总数（作为一列）
SELECT 
    name,
    (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS order_count
FROM users;
```
```sql [返回单行多列]
-- 通常与行构造器（如 (col1, col2)）配合使用
-- 查找与用户 'Alice' 相同部门和职位的人（排除自己）
SELECT name 
FROM employees 
WHERE (dept, job_title) = (
    SELECT dept, job_title FROM employees WHERE name = 'Alice'
)
AND name != 'Alice';
```
```sql [返回多行多列]
-- 常用于 IN、EXISTS、FROM 等场景

-- 例子1：查找下过单的用户
SELECT name 
FROM users 
WHERE id IN (SELECT user_id FROM orders);


-- 例子2：先统计每个用户的订单数，再筛选大于5的
-- 注意：派生表必须有别名
SELECT * FROM (
    SELECT user_id, COUNT(*) AS cnt 
    FROM orders 
    GROUP BY user_id
) AS user_order_counts
WHERE cnt > 5;
```
:::

### 子查询 vs JOIN

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


### CTE（MySQL 8新增）

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

## 常用函数

- 字符串：CONCAT, SUBSTRING, REPLACE
- 数值：ROUND, ABS, RAND
- 日期：NOW, DATE_FORMAT, DATE_ADD
- 逻辑：IF, CASE, COALESCE
- 聚合：COUNT, SUM, AVG


示例：

:::code-group
```sql [字符串]
-- 生成完整姓名
SELECT CONCAT(first_name, ' ', last_name) AS full_name 
FROM users;

-- 拼接 URL
SELECT CONCAT('https://example.com/user/', id) AS profile_url
FROM users;


-- 隐藏手机号中间4位：138****1234
SELECT CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS masked_phone
FROM users;

-- 提取文件扩展名
SELECT SUBSTRING_INDEX(filename, '.', -1) AS ext FROM files;

-- 清理脏数据：把中文逗号换成英文
UPDATE products SET tags = REPLACE(tags, '，', ',');

-- 移除空格
SELECT REPLACE(description, ' ', '') FROM products;
```
```sql [数值]
-- 显示2位小数的价格。四舍五入（保留小数）
SELECT name, ROUND(price, 2) AS price FROM products;

-- 百分比（如 0.875 → 87.5%）
SELECT CONCAT(ROUND(ratio * 100, 1), '%') AS percent FROM stats;
```
```sql [日期]
-- 插入带时间戳的记录
INSERT INTO logs (message, created_at) 
VALUES ('用户登录', NOW());

-- 查询今天的数据
SELECT * FROM orders WHERE DATE(order_time) = CURDATE();

-- 显示“2026年01月29日”
SELECT DATE_FORMAT(NOW(), '%Y年%m月%d日') AS today;

-- 按月统计订单
SELECT DATE_FORMAT(order_time, '%Y-%m') AS month, COUNT(*)
FROM orders
GROUP BY month;

-- 查询7天内注册的用户。日期加减（避免直接用 + -）
SELECT * FROM users 
WHERE reg_time >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- 会员到期时间（注册+1年）
SELECT name, DATE_ADD(reg_time, INTERVAL 1 YEAR) AS expire_date
FROM users;
```
```sql [逻辑]
-- 用户状态显示。简单条件判断（类似三元运算符）
SELECT name, IF(is_vip, 'VIP', '普通') AS user_type FROM users;

-- 安全除法（避免除零）
SELECT IF(total > 0, success / total, 0) AS rate FROM metrics;

-- 订单状态分类
SELECT 
    order_id,
    CASE 
        WHEN status = 'paid' THEN '已支付'
        WHEN status = 'shipped' THEN '已发货'
        ELSE '其他'
    END AS status_desc
FROM orders;
```
```sql [聚合]
-- 总用户数
SELECT COUNT(*) FROM users;

-- 有填写手机号的用户数
SELECT COUNT(phone) FROM users;  -- 自动忽略 NULL

-- 总销售额
SELECT SUM(amount) FROM orders;

-- 平均订单金额（只算有效订单）
SELECT AVG(amount) FROM orders WHERE amount > 0;

-- 每个部门的员工姓名列表
SELECT dept, GROUP_CONCAT(name SEPARATOR ', ') AS members
FROM employees
GROUP BY dept;
-- 结果: "研发部 | 张三, 李四"
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

## 表的加减法

### 加法（合并多个表数据）

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

### 减法

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


## JOIN（联结）

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
- `CROSS JOIN`（叉联结）：将两表所有行都匹配，结果集为两表行数乘积（**慎用**）

```sql
-- 查询有订单的用户及其订单
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

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
- 不要忘记写ON条件，否则会变成`CROSS JOIN`
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
