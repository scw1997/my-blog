# MySQL（下）



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





## 存储引擎

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







## 索引

索引(index)是**帮助MySQL高效获取数据的数据结构(有序)**。

在数据之外，数据库系统还维护着满足特定查找算法的数据结构，这些数据结构以某种方式引用(指向)数据，这样就可以在这些数据结构上实现高级查找算法，这种数据结构就是索引。

#### 索引意义
无索引时：数据库执行 SELECT 或 WHERE 查询需逐行扫描整张表（全表扫描），数据量越大越慢。

有索引时：数据库可快速定位到目标数据位置，大幅减少 I/O 操作和比较次数。

### 索引原理

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


### 常见索引类型

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

### 索引失效的情况

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

### 索引控制提示

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


### 索引优缺点

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

## 性能分析

### 查看SQL执行频次

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

### 获取慢查询日志

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

### EXPLAIN

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


## 存储过程

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

## 存储函数

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


## 触发器

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

### 全局锁

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


### 表级锁

每次操作锁定整张表。开销小、加锁快，但并发度最低。

表级别的锁主要包括手动表锁、元数据锁（MDL）和意向锁。


- #### `手动加表锁`

  包含两种类型： `READ`：允许其他会话共享读锁，但禁止写; `WRITE`：独占写锁，排斥其他所有会话的读写行为
  ```sql
  -- 加锁
  LOCK TABLES [表名] READ/WRITE;
  
  -- 释放锁
  UNLOCK TABLES;
  
  ```
- #### `元数据锁`

  MySQL5.5中引入了元数据锁（MDL）,元数据锁是**系统自动控制，无需显式使用**

  当对表执行 DML 操作（增删改查）时，会自动加上 MDL 读锁。读锁之间互相兼容，不会阻塞其他线程的增删改查操作，但会阻止修改表结构。

  当对表执行 DDL 操作（如创建、修改、删除表）时，会自动加上 MDL 写锁。写锁与所有的读锁、写锁均互斥，即拥有写锁的线程才能更新表结构，其他线程既不能修改结构，也不能执行增删改查。

- #### `意向锁`

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

### 行级锁

每次操作只锁定具体的某一行数据。开销大、加锁慢，但并发度最高。

行级锁包含行锁，间隙锁，临键锁：

- #### `行锁`(Record Lock)

  锁定单个行记录的锁，防止其他事务对此行进行update和delete。在RC，RR隔离级别下都支持。

  行锁包括以下两种类型：

  `共享锁（Shared Lock, S Lock / 读锁）`：允许多个事务同时读取同一行数据，但会阻止其他事务获取排他锁（即阻止修改）。

  `排他锁（Exclusive Lock, X Lock / 写锁）`：允许获取锁的事务读写该行数据，同时阻止其他事务获取共享锁和排他锁。

- #### `间隙锁`(GapLock)

  锁定索引记录间限(不含该记录)，确保索引记录间隙不变，**防止其他事务在这个间隙进行insert，产生幻读**。在RR隔高级别下都支持。

- #### `临键锁`(Next-Key Lock)

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

> 慢查询日志详见：[慢查询日志](/backend/database/mysql-2.html#_2-获取慢查询日志)


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

#### 从库配置

1. 修改配置文件 `/etc/my.cnf`，开启二进制日志并设置唯一ID：
```ini
[mysqld]
server-id = 2                # 从库唯一ID，不能与主库重复
read_only = ON               # 可选：设置从库只读，防止误写( 1表示只读，0表示读写)
```
2. 重启 MySQL：
```shell
systemctl restart mysqld
```
3. 登录mysql并执行以下命令，将主库信息配置到从库：
```sql
CHANGE REPLICATION SOURCE TO
SOURCE_HOST='主库IP',
SOURCE_USER='repl_user', --连接主库的用户名
SOURCE_PASSWORD='StrongPassword!', --连接主库的密码
SOURCE_AUTO_POSITION=1;      -- 关键：启用GTID自动定位（推荐）


```
4. 启动复制：

```sql
START REPLICA;
```

5. 查看复制状态：
```sql
SHOW REPLICA STATUS\G;
```

## 分库分表

### 产生背景
当`单表`数据量达到千万级别，或者单库并发量极高时，系统通常会面临以下几个致命瓶颈：
- **查询性能断崖式下跌**：MySQL 的 InnoDB 引擎依赖 B+ 树索引。当单表数据量过大（如超过千万行），B+ 树的高度会增加，导致查询时需要更多的磁盘 I/O，查询响应时间显著变慢。
- **写入与并发瓶颈**：单台数据库服务器的 CPU、内存、磁盘 I/O 和网络带宽是有限的。在高并发场景下（如秒杀、大促），单机连接数和写入吞吐量会达到上限，甚至引发 too many connections 报错。
- **运维与存储压力**：单表数据量过大，会导致数据库备份和恢复的时间极长（可能需要数小时甚至更久），一旦发生故障，恢复成本极高，难以满足业务的高可用要求。

### MyCat

Mycat 是一个开源的分布式`数据库中间件`，它伪装成一个 MySQL 服务器，对前端应用完全透明。

应用只需连接 Mycat，Mycat 会在底层拦截并解析 SQL，根据配置好的规则将请求路由到后端的真实物理数据库，最后将结果汇总返回给应用。

#### 安装

1. 下载指定linux版本安装包并解压到 `/usr/local/` 目录下：
```shell
tar -zxvf Mycat-server-1.6.7.1-release-20190627191042-linux.tar.gz -C /usr/local/
```

解压后，Mycat 的默认目录结构如下：
- bin：存放启动、停止等可执行脚本
- conf：存放核心配置文件（重点）
- lib：存放 Mycat 依赖的 Java 第三方包
- logs：存放运行日志
2. 配置环境变量：
```shell
# 编辑环境变量文件
vim /etc/profile

# 在文件末尾添加以下内容
export MYCAT_HOME=/usr/local/mycat
export PATH=$PATH:$MYCAT_HOME/bin
```
3. 使配置立即生效：
```shell
source /etc/profile
```

#### 配置文件

Mycat 的运行逻辑主要由 `conf/` 目录下的三个 XML 文件控制，在启动前需要根据实际业务进行修改：
- `server.xml`：定义 Mycat 的系统参数、连接端口以及登录 Mycat 的用户名和密码。
- `schema.xml`：定义逻辑库、逻辑表以及后端真实的物理数据库节点（DataHost/DataNode），是配置读写分离和分库分表的核心。
- `rule.xml`：定义分片规则（如按 ID 取模、按时间范围分片等）。

基础示例：

:::code-group
```xml [schema.xml]
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">

    <!-- 1. 定义逻辑库 -->
<!--  sqlMaxLimit表示当不指定limit时默认最多查多少条数据 -->
    <schema name="TESTDB" checkSQLschema="false" sqlMaxLimit="100">
        <!-- 定义逻辑表，不写 rule 属性表示这是一张单表，不进行分片 -->
        <table name="user" dataNode="dn1" />
      <!-- 定义逻辑表 order，绑定 3 个数据节点，并引用 rule.xml 中的规则名 -->
      <table name="order" dataNode="dn1,dn2,dn3" rule="sharding-by-userid-mod" />
    </schema>

    <!-- 2. 定义数据节点 (DataNode) -->
    <!-- 将逻辑表与具体的物理数据库绑定 -->
    <!-- 定义 3 个数据节点，分别对应 3 个物理库或物理表 -->
    <dataNode name="dn1" dataHost="localhost1" database="db_0" />
    <dataNode name="dn2" dataHost="localhost1" database="db_1" />
    <dataNode name="dn3" dataHost="localhost1" database="db_2" />

    <!-- 3. 定义数据主机 (DataHost) 与读写分离 -->
    <dataHost name="localhost1" maxCon="1000" minCon="10" balance="1" writeType="0" dbType="mysql" dbDriver="native">
        <!-- 心跳检测语句，用于判断后端数据库是否存活 -->
        <heartbeat>select user()</heartbeat>
        
        <!-- 主库配置 (负责写操作) -->
        <writeHost host="hostM1" url="192.168.1.10:3306" user="root" password="root_password">
            <!-- 从库配置 (负责读操作)，可以配置多个 readHost 实现读负载均衡 -->
            <readHost host="hostS1" url="192.168.1.11:3306" user="root" password="root_password" />
        </writeHost>
    </dataHost>

</mycat:schema>
```
```xml [server.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mycat:server SYSTEM "server.dtd">
<mycat:server xmlns:mycat="http://io.mycat/">
    <system>
        <!-- 基础系统参数 -->
        <property name="useSqlStat">0</property> <!-- 关闭SQL实时统计，生产环境建议关闭以节省内存 -->
        <property name="sequnceHandlerType">2</property> <!-- 指定全局序列生成方式 -->
    </system>

    <!-- 定义连接 Mycat 的用户 -->
    <user name="mycat_user" defaultAccount="true">
        <!-- 客户端连接 Mycat 的密码 -->
        <property name="password">123456</property>
        <!-- 授权该用户可以访问的逻辑库（需与 schema.xml 中的 schema name 对应） -->
        <property name="schemas">TESTDB</property>
        <!-- 是否只读，false 表示允许增删改 -->
        <property name="readOnly">false</property>
    </user>
</mycat:server>
```
```xml [rule.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mycat:rule SYSTEM "rule.dtd">
<mycat:rule xmlns:mycat="http://io.mycat/">

    <!-- 1. 定义表的分片规则 -->
    <tableRule name="sharding-by-userid-mod">
        <rule>
            <!-- 指定参与分片的字段（分片键） -->
            <columns>user_id</columns>
            <!-- 指定使用的分片算法名称，必须与下方 function 的 name 对应 -->
            <algorithm>mod-long-3</algorithm>
        </rule>
    </tableRule>

    <!-- 2. 定义具体的分片算法 -->
    <function name="mod-long-3" class="io.mycat.route.function.PartitionByMod">
        <!-- 配置分片数量，这里配置为 3，表示数据会被均匀分到 3 个节点/表中 -->
        <property name="count">3</property>
    </function>

</mycat:rule>

```
:::


#### 启动验证

1. 进入 Mycat 的 bin 目录，执行启动命令

```shell
cd /usr/local/mycat/bin
./mycat start
```

2. 验证运行状态：

```shell
./mycat status
```

3. 连接数据库测试：
```shell
# 输入密码后成功进入mysql则说明mycat启动成功

mysql -h 127.0.0.1 -P 8066  -u[用户名] -p
```
:::tip mycat端口
Mycat 默认提供两个端口：`8066`（数据端口，供应用连接）和 `9066`（管理端口）。mycat启动默认占用8066端口。
:::


## 独写分离

MySQL 读写分离是一种将数据库的读操作和写操作分发到不同服务器上的架构设计。

它的核心思想是：让一个**主库（Master）专门负责处理所有的写操作（如 INSERT、UPDATE、DELETE），而将一个或多个从库（Slave）专门负责处理读操作（SELECT）**。

### 产生背景

在绝大多数互联网业务中，数据库面临的往往是“`读多写少`”的场景（读写比例可能达到几十比一）。随着用户量增长，单台数据库往往无法承受海量的并发请求。读写分离能带来以下显著优势：
- `分担负载，提升性能`：将大量的读请求分散到多个从库，极大减轻了主库的并发压力，避免了读写操作抢占同一台服务器的 CPU 和 I/O 资源。
- `提高系统可用性`：当主库发生故障时，可以快速将某个从库提升为新的主库；如果某个从库宕机，读请求也可以自动转移到其他健康的从库上。
- `数据备份与离线分析`：从库可以作为主库的实时热备，同时也可以在从库上执行复杂的报表查询，避免影响线上主库的业务。

:::warning 注意
读写分离的核心前提是配置好 `主从复制`,确保从库的数据与主库保持实时同步。
:::

### MyCat配置

假设我们有一主一从的 MySQL 环境：
- 主库（Master）：192.168.1.10:3306
- 从库（Slave）：192.168.1.11:3306

要让 Mycat 实现读写分离，只需修改 `schema.xml` 配置文件即可。以下是核心配置示例：

```xml

<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">

    <!-- 1. 定义逻辑库（不需要配置 table 标签，因为不做分表） -->
    <schema name="TESTDB" checkSQLschema="false" sqlMaxLimit="100" dataNode="dn1">
    </schema>

    <!-- 2. 定义数据节点，映射到具体的物理数据库 -->
    <dataNode name="dn1" dataHost="localhost1" database="my_test_db" />

    <!-- 3. 核心：定义数据主机与读写分离规则 -->
<!-- balance=1表示开启读写分离,所有的 readHost（从库）都会参与 SELECT 语句的负载均衡.0则不开启 -->
    <dataHost name="localhost1" maxCon="1000" minCon="10" balance="1" writeType="0" dbType="mysql" dbDriver="native" switchType="1">
        <!-- 心跳检测，判断后端数据库是否存活 -->
        <heartbeat>select user()</heartbeat>
        
        <!-- 配置主库（负责写操作） -->
        <writeHost host="hostM1" url="192.168.1.10:3306" user="root" password="root_password">
            <!-- 配置从库（负责读操作） -->
            <readHost host="hostS1" url="192.168.1.11:3306" user="root" password="root_password" />
        </writeHost>
    </dataHost>

</mycat:schema>
```
