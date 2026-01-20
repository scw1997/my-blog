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

#### 3：连接测试
1. 打开命令提示符（CMD）
2. 进入 MySQL（Mysql Server） bin 目录（或已添加 PATH）：
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

### 书写规范

- 语句以分号`;` 结尾
- 字符串用单引号 ' '，别名/标识符用反引号 ````  （MySQL）或双引号 "（标准 SQL / PostgreSQL）
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
    -- ❌ 错误
    WHERE status != 'deleted'
    
    -- ✅ 正确（若 status 可能为 NULL）
    WHERE status IS NULL OR status != 'deleted'
    -- 或
    WHERE COALESCE(status, '') != 'deleted'
    ```
- 在 `NOT IN` 前确保子查询无 NULL（因为`id NOT IN (x, NULL)`等价于`id != x AND id != NULL`，NULL使用了!=判断则此时整体返回UNKNOWN）
    ```sql
    -- ❌ 可能错误（若user_id值可能为NULL的情况下）
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
- 主键优先使用自增整数（简单高效）或UUID（隐私性好）
- 避免使用自然主键（如用“身份证号”、“邮箱”作主键），因为这些数据长度大且可能会修改。
- 分布式系统考虑 UUID（全局唯一，适合分库分表）
- 避免主键进行更新，因为会导致`索引重建和外键级联更新（可能锁表）`。
:::
