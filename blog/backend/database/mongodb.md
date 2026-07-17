# MongoDB

文档型（JSON）数据库。无固定表结构，支持扩展和嵌套数据，读写性能高。`适合数据结构经常变、写入量巨大、或者嵌套层级很深的非核心数据`。


## 安装启动

1. 官网地址：https://www.mongodb.com/try/download/community
2. 下载对应系统版本（以4.x版本为例，win10不支持8.x版本）的`msi`安装包后双击安装，注意勾选 Install MongoDB as a Service（将 MongoDB 安装为服务）。这样它会自动在后台运行，并随电脑开机自启。
3. 将mongodb的安装目录下的`bin`目录（通常默认为为C:\Program Files\MongoDB\Server\4.x.x\bin）添加到系统的环境变量Path中
4. 打开命令窗口，执行`mongo`命令启动并连接mongodb服务，输出如下
    ```shell
    MongoDB shell version v4.0.x
    connecting to: mongodb://127.0.0.1:27017/
    >
    ```


## 常用命令

mongodb中的表称为`集合`，每一行数据称为`文档`

### 数据库与集合管理
- `show dbs`：列出服务器上所有的数据库。
- `use <数据库名>`：切换或创建数据库（如果数据库不存在，会在插入第一条数据时自动创建）。
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

   `db.<集合名>.find().pretty()`：以格式化的方式展示查询结果，更易读。

   `db.<集合名>.findOne({name: "张三"})`：只查询并返回符合条件的第一条文档。
#### 更新数据 (Update)
   `db.<集合名>.updateOne({name: "张三"}, {$set: {age: 26}})`：更新符合条件的第一条文档（$set 表示只修改指定字段）。

   `db.<集合名>.updateMany({age: {$lt: 20}}, {$set: {status: "未成年"}})`：批量更新所有符合条件的文档。
#### 删除数据 (Delete)
   `db.<集合名>.deleteOne({name: "张三"})`：删除符合条件的第一条文档。

   `db.<集合名>.deleteMany({age: {$gt: 60}})`：批量删除所有符合条件的文档。

   `db.<集合名>.deleteMany({})`：清空集合中的所有文档（但保留集合本身）。
