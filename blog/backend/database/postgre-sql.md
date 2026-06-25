# PostgreSQL

## 对比MySql

### 常见语法差异

- 只接受`单引号`来表示字符串（MySQL同时支持`单双引号`）。
- 使用 `||` 作为字符串连接符。
  ```sql
  --postgreSql
  SELECT CONCAT(username, '的行程') FROM users;  
  
  --mysql
  SELECT CONCAT(username, '的行程') FROM users;
  ```
- 大小写敏感。
- 分页查询必须使用标准写法 LIMIT count OFFSET offset（如 LIMIT 5 OFFSET 10）。
  ```sql
  --postgreSql
  SELECT * FROM trip_sessions LIMIT 5 OFFSET 10;
  
  --mysql
  SELECT * FROM trip_sessions LIMIT 10, 5;
  ```
- 使用 `SERIAL` 或 `BIGSERIAL` 数据类型来定义自增主键。
  ```sql
  --postgreSql
  id BIGSERIAL PRIMARY KEY
  
  --mysql
  id BIGINT AUTO_INCREMENT PRIMARY KEY
  ```  
- 支持**BOOLEAN** 类型，**JSONB**（高性能二进制 JSON）、**数组类型**（TEXT[]）、**范围类型**等。
  :::code-group
  ```sql [boolean]
  --postgreSql
  is_active BOOLEAN DEFAULT TRUE
  
  --mysql
  is_active TINYINT(1) DEFAULT 1
  ```
  ```sql [处理json数据]
  --查询 plan_data 中包含 destination='杭州' 的行程
  
  --postgreSql（使用操作符@>表示包含）
  SELECT * FROM trip_plans WHERE plan_data @> '{"destination": "杭州"}';
  
  --mysql
  SELECT * FROM trip_plans 
  WHERE JSON_EXTRACT(plan_data, '$.destination') = '杭州';
  ```
  :::  
- 使用 CURRENT_TIMESTAMP 或 CURRENT_DATE来获取当前时间。
- 多表更新适用FROM语法
  ```sql
  --postgreSql
  UPDATE trip_sessions ts
  SET title = '更新后的标题'
  FROM users u
  WHERE ts.user_id = u.id AND u.username = 'admin';
  
  --mysql
  UPDATE trip_sessions ts, users u
  SET ts.title = '更新后的标题'
  WHERE ts.user_id = u.id AND u.username = 'admin';
  ```

### 架构性能和并发处理

- MySQL 的优势在`“读”与“简单事务`：MySQL 采用`多线程`架构，内存开销较小，在`纯写入场景`（如 TPC-C 基准测试）和`高频读取场景`下，通常比 PostgreSQL 快 15-30%。它非常适合互联网高并发、读多写少的 OLTP（联机事务处理）场景。

- PostgreSQL 的优势在`“写”与“复杂查询”`：PostgreSQL 采用`多版本并发控制`（MVCC），读写操作互不阻塞，因此在`频繁并发写入`和混合工作负载下表现极佳。它的查询优化器非常智能，在`处理复杂的多表` JOIN、数据分析（OLAP）和窗口函数时，性能往往远超 MySQL。


### 数据类型与扩展性

- MySQL：专注于`结构化数据`。虽然 8.0 版本引入了 JSON 类型和 CHECK 约束，但在处理复杂数据结构时仍显基础。
- PostgreSQL：被称为**对象-关系型数据库**，支持 `JSONB、数组、几何类型、UUID` 等极其丰富的数据类型。它允许用户`自定义数据类型`、函数和索引方法，扩展性极强。

### 适用场景
优先选择 `PostgreSQL` 的场景：
- **AI 与多模数据处理**：如果你的项目需要 AI 向量检索（如 RAG 知识库）、GIS 地理信息分析，或者需要同时处理结构化、JSON、时序等多种数据，PG 是首选。
- **复杂业务与数据分析**：业务以复杂查询、多表关联、数据仓库或深度报表为主。
- **强合规与数据安全**：有等保三级、金融监管等强合规需求，且不想购买昂贵的企业版（PG 社区版原生支持行级安全、TDE加密和审计）。
- **商业分发与二次开发**：企业需要基于数据库做底层定制并商业化，无开源协议风险。

优先选择 `MySQL` 的场景：
- **互联网高并发交易**：典型的电商、Web 应用、CMS 系统，以简单的 CRUD 和高并发读取为主。
- **团队技术储备有限**：中小团队没有专职 DBA，希望以最低的运维成本快速上线项目。
- **大规模分布式部署**：需要大规模水平扩展、分库分表，MySQL 的生态工具链更为成熟。
