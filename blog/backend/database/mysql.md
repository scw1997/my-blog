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
- 字符串用单引号 ' '，别名/标识符用反引号   （MySQL）或双引号 "（标准 SQL / PostgreSQL）
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
- 避免` SELECT *`
- WHERE 条件注意 NULL 处理（NULL 不能用 =, != 判断，需用 `IS NULL / IS NOT NULL`）
    ```sql
    -- ❌ 错误
    WHERE status != 'deleted'
    
    -- ✅ 正确（若 status 可能为 NULL）
    WHERE status IS NULL OR status != 'deleted'
    -- 或
    WHERE COALESCE(status, '') != 'deleted'
    ```
