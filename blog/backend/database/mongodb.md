# MongoDB

文档型（JSON）数据库。无固定表结构，支持扩展和嵌套数据，读写性能高。

`适合数据结构经常变、写入量巨大、或者嵌套层级很深的非核心数据`。


## 安装启动

默认端口`27017`

### Windows

以4.0版本为例（6.0安装配置稍繁琐，`win10不支持8.x版本`）：

1. 官网地址：https://www.mongodb.com/try/download/community
2. 下载对应系统版本的`msi`安装包后双击安装，注意勾选 Install MongoDB as a Service（将 MongoDB 安装为服务）。这样它会自动在后台运行，并随电脑开机自启。
3. 将mongodb的安装目录下的`bin`目录（通常默认为为C:\Program Files\MongoDB\Server\4.x.x\bin）添加到系统的环境变量Path中
4. 打开命令窗口，执行`mongo`命令启动并连接mongodb服务，输出如下则成功启动
    ```shell
    MongoDB shell version v4.0.x
    connecting to: mongodb://127.0.0.1:27017/
    >
    ```

### Linux

以centos 7.0 为例：
1. 创建 MongoDB 的 YUM 源配置文件
```bash
sudo vi /etc/yum.repos.d/mongodb-org-6.0.repo
```
2. 写入以下内容并保存退出
```text
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
```
3. 安装mongodb
```bash
sudo yum install -y mongodb-org
```

4. 管理mongodb服务

```bash
# 启动 MongoDB 服务
sudo systemctl start mongod

# 设置开机自动启动
sudo systemctl enable mongod

# 查看运行状态（确认是否显示 active (running)）
sudo systemctl status mongod
```

5. 创建管理员账号
```js
// 终端输入mongosh进入交互式Shell
mongosh

// 切换到 admin 数据库
use admin

// 创建拥有 root 权限的管理员用户
db.createUser({
   user: "admin",
   pwd: "your_strong_password", // 替换为你自己的强密码
   roles: [{ role: "root", db: "admin" }]
})

//输入exit退出
```

6. 开启密码认证和远程连接

```bash
# 使用编辑器打开 MongoDB 的配置文件
sudo vi /etc/mongod.conf

# 找到 net 配置块，将 bindIp 修改为 0.0.0.0：
net:
  port: 27017
  bindIp: 0.0.0.0
  
# 在文件末尾添加 security 配置块：
security:
  authorization: enabled

# 保存退出  
```

7. 重启并测试远程连接
```shell
# 重启服务
sudo systemctl restart mongod

# 测试远程连接
# mongodb 6.0 以上版本
mongosh "mongodb://用户名:密码@服务器IP地址:27017/?authSource=admin"

# mongodb 4.x
mongo "mongodb://用户名:密码@服务器IP地址:27017/?authSource=admin"
```
## 常用命令

mongodb中的表称为`集合`，每一行数据称为`文档`

### 数据库与集合管理
- `show dbs`：列出服务器上所有的数据库。
- `use <数据库名>`：切换或创建数据库（**如果数据库不存在，会在插入第一条数据时自动创建**）。
- `db`：查看当前正在使用的数据库。
- `db.dropDatabase()`：删除当前所在的数据库。
- `show collections`：列出当前数据库下的所有集合（相当于关系型数据库中的“表”）。
- `db.createCollection("<集合名>")`：手动创建一个集合。
- `db.<集合名>.drop()`：删除指定的集合。

### 增删改查

#### 插入数据 (Create)
   `db.<集合名>.insertOne({name: "张三", age: 25})`：插入单条文档。

   `db.<集合名>.insertMany([{name: "李四"}, {name: "王五"}])`：批量插入多条文档。
#### 查询数据 (Read)
   `db.<集合名>.find()`：查询集合中的所有文档。

   `db.users.find({ age: { $gt: 20 } }).count()`：统计 age 大于 20 岁的用户总数

   `db.<集合名>.find({content:/关键词/})`：查询集合中的content字段包含关键词的所有文档（正则模糊查询）。

   `db.<集合名>.find().pretty()`：以格式化的方式展示查询结果，更易读。

   `db.<集合名>.findOne({name: "张三"})`：只查询并返回符合条件的第一条文档。

   `db.<集合名>.find().skip(20).limit(10).sort({ createdAt: -1, _id: 1 })）`: 按createdAt升序以及_id降序排列，并跳过前 20 条，然后取 10 条数据（分页查询）
#### 更新数据 (Update)
   `db.<集合名>.updateOne({name: "张三"}, {$set: {age: 26}})`：更新符合条件的第一条文档（$set 表示只修改指定字段）。

   `db.<集合名>.updateMany({age: {$lt: 20}}, {$set: {status: "未成年"}})`：批量更新所有符合条件的文档。
#### 删除数据 (Delete)
   `db.<集合名>.deleteOne({name: "张三"})`：删除符合条件的第一条文档。

   `db.<集合名>.deleteMany({age: {$gt: 60}})`：批量删除所有符合条件的文档。

   `db.<集合名>.deleteMany({})`：清空集合中的所有文档（但保留集合本身）。

:::warning 注意  
- mongodb插入数据时无需考虑集合字段结构。如果集合不存在，会自动创建集合。并且会自动生成`_id`字段。
- 批量插入数据时，如果某条数据插入失败，则会终止插入,但已插入成功的数据会保存。可以通过添加`try/catch`来处理插入失败的数据。
- 使用分页查询（skip+limit）时必须`结合 sort()` 使用。如果不指定排序规则，MongoDB 返回数据的顺序是不稳定的，会导致分页数据出现重复或遗漏。
:::


## 索引

MongoDB 的索引和 MySQL 类似，都是用来大幅提升查询速度、避免全表扫描的。如果没有索引，MongoDB 就必须扫描集合里的每一条文档，这在数据量大的时候会非常慢。

MongoDB索引使用的是`B-Tree`结构。

### 索引类型
:::code-group
```javascript [单字段索引]
//针对某一个字段添加索引。
//场景：假设你有一个 users 集合，经常需要根据 age 来查询用户。
// 1 表示升序，-1 表示降序

db.users.createIndex({ age: 1 })
```

```javascript [复合索引]
//针对多个字段添加索引。
//场景：你经常需要同时查询某个城市的特定年龄段的订单，比如 city 和 age。

db.orders.createIndex({ city: 1, age: -1 })

//以下查询不会索引生效，违背最左前缀原则
db.orders.find({ age: 25 })
```
```javascript [唯一索引]
// 添加唯一索引后，不仅加速查询，还能保证数据的唯一性（类似 MySQL 的主键或唯一约束）。
// 如果你尝试插入第二条 email 相同的数据，MongoDB 会直接报错拒绝插入。
db.users.createIndex({ email: 1 }, { unique: true })
```
:::

:::warning 注意
- 复合索引同样需要符合`最左前缀原则`才能生效
:::


### 管理索引

```javascript
// 查看索引
db.users.getIndexes()
// 删除指定名称索引
db.users.dropIndex("age_1")
//删除某集合的所有索引
db.users.dropIndexes()
```

### 判断索引生效

```javascript
// MongoDB 的查询计划
db.users.find({ age: 25 }).explain("executionStats")
```
在返回的结果中，重点看 `winningPlan.stage`：
- 如果显示 `IXSCAN` (Index Scan)，说明成功使用了索引。
- 如果显示 `COLLSCAN` (Collection Scan)，说明没有走索引，进行了全表扫描。


## 事务

从 4.0 版本开始，MongoDB 引入了多文档 ACID 事务支持。

MongoDB 的事务完全符合 ACID 特性，保证了复杂业务场景下的数据一致性。


### 基本使用

在代码中使用 MongoDB 事务，通常需要借助会话（Session）。核心流程分为以下几步：
1. 启动一个客户端会话（Session）。
2. 在会话中开启事务。
3. 执行一个或多个数据库操作（如插入、更新、删除），并且必须将 Session 对象传递给这些操作。
4. 提交事务。如果过程中发生异常，则中止（回滚）事务。

```js
// nodejs代码示例

// 1. 启动会话
const session = client.startSession();

try {
    // 2. 开启事务
    session.startTransaction();

    // 3. 执行操作（注意：必须传入 { session } 选项）
    await accountsCollection.updateOne(
        { _id: "account1" }, 
        { $inc: { balance: -100 } }, 
        { session }
    );
    await accountsCollection.updateOne(
        { _id: "account2" }, 
        { $inc: { balance: 100 } }, 
        { session }
    );

    // 4. 提交事务
    await session.commitTransaction();
    console.log("事务提交成功！");
} catch (error) {
    // 发生错误时回滚事务
    await session.abortTransaction();
    console.error("事务执行失败，已回滚:", error);
} finally {
    // 结束会话
    session.endSession();
}
```

:::warning 注意

虽然 MongoDB 支持了事务，但官方并**不推荐滥用**。

什么时候该用：当你的业务逻辑确实需要跨多个文档、多个集合甚至多个分片进行原子性操作时。

什么时候该不用：你能通过合理的数据建模（非规范化设计）把需要一起更新的数据放在同一个文档里，就完全不需要使用多文档事务。


:::

## 日志

### 运行日志

MongoDB 默认会将运行日志以 JSON 格式记录在磁盘上，默认位置为 `/var/log/mongodb/mongod.log`。

```bash
# 实时查看最新的日志
tail -f /var/log/mongodb/mongod.log

# 搜索包含 "ERROR" 或 "WriteConflict" 的日志
grep -E "ERROR|WriteConflict" /var/log/mongodb/mongod.log
```

### mongosh 查询

如果你已经连接到了 MongoDB 实例，可以查看启动警告或最近的日志，但**只能查看最近的 1024 条记录**。

```js
// 查看所有最近日志
db.adminCommand({ getLog: "global" })

// 查看启动警告
db.adminCommand({ getLog: "startupWarnings" })
```
