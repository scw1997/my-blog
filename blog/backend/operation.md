# 运维

## Linux

### 安装运行（虚拟机）

1. 安装`VMwareWorkstation`软件和下载`Linux发行版`（内核版负责控制硬件）镜像压缩包（如centos7）
2. 打开vm软件，点击编辑>虚拟网络编辑器，选择`VMNet8`，选中`NAT模式`并设置子网IP为`192.168.100.0`
3. 解压Linux镜像压缩包，并双击其中的`.vmx`文件则会将虚拟机直接添加到vm列表中
4. 运行该虚拟机，输入默认账号(root)和密码(1234)登录即可进入Linux系统（命令行页面）。
5. 查看ip地址：`ip addr`；停止运行：`init 0`;重启：`init 6`

:::warning 注意事项
- 运行虚拟机如果报错`此主机支持 Intel VT-x，但 Intel VT-x 处于禁用状态...`则需要重启电脑按F2进入BIOS模式，并设置`Intel Virtualization Technology`选项为`enabled`（开启）
- 一般正常企业内部不会使用虚拟机（通常只为测试使用），而是使用真正的服务器来安装Linux系统。
- 服务器一般不会存放在公司里，而是在提供专门苛刻的存储环境的机房（完善电力系统+恒温+无尘等）。所以开发者通常会使用`远程连接工具`（如xshell,finalShell）来连接并操作Linux服务器
:::

### 系统目录结构

```text
/ (根目录 Root)
│
├── bin (Binaries)         # 存放二进制可执行文件
├── sbin (System Binaries) # 存放二进制可执行文件(仅root用户可访问)
├── etc (Etcetera)         # 系统全局配置文件 (如网络配置、用户信息、服务配置)
│   ├── passwd             # 用户信息
│   ├── shadow             # 用户密码密文
│   ├── hosts              # 本地DNS解析
│   └── fstab              # 磁盘挂载信息
│
├── var (Variable)         # 运行时变化的文件 (如日志、缓存、邮件队列)
│   ├── log                # 系统和程序日志 (如 messages, secure)
│   └── cache              # 应用程序缓存
│
├── usr (Unix System Resources) # 用户程序和文件 (类似Windows的Program Files)
│   ├── bin                # 非基础的用户命令 (如 python, gcc)
│   ├── lib                # 应用程序共享库文件
│   ├── local              # 用户手动安装的程序 (独立于系统包管理器)
│   └── share              # 架构无关的数据 (如文档、字体、图标)
│
├── home (Home)            # 普通用户的家目录 (类似Windows的c:\Users\非管理员用户)
├── root (Root Home)       # root超级管理员的家目录(类似Windows的c:\Users\Administrator)
│
├── boot (Boot)            # 启动Linux的核心文件 (如内核 vmlinuz, GRUB引导)
├── dev (Devices)          # 设备文件 (如硬盘 /dev/sda, 终端 /dev/tty)
├── sys (System)           # 虚拟文件系统，暴露内核对象和设备驱动信息
│
├── tmp (Temporary)        # 临时文件，重启后通常会被清空

```
### 常用命令
- `pwd`：查看当前所在的绝对路径，防止在复杂目录中迷路。
- `cd`：切换目录。常用 cd .. 返回上一级，cd ~ 回到用户家目录，cd - 快速返回上一次所在的目录。
- `ls`：列出目录内容。常用组合 `ls -lh`（以人类可读格式显示文件大小和详细信息）和 `ls -lht`（按修改时间倒序排列，方便找最新文件）。
- `mkdir`：创建目录。使用 mkdir -p a/b/c 可以一次性递归创建多级目录。
- `touch`：创建空文件或更新已有文件的时间戳。
- `cp`：复制文件或目录。复制目录时必须加 `-r` 参数（如 cp -r src dst）。
- `mv`：移动文件或重命名文件（目标路径是已存在的目录则是移动文件，否则为重命名）。
- `rm`：删除文件。删除目录使用 `rm -r`。⚠️ 警告：rm -rf 目录名 会强制递归删除且无提示，执行前务必确认路径，避免灾难性误删。
- `cat`：一次性输出文件全部内容，适合查看较短的配置文件。
- `less`：分页查看大文件，按空格键翻页，按 q 键退出。
- `head / tail`：查看文件的开头或结尾。`tail -f 日志文件` 是线上排查问题的绝对高频命令，可以**实时监控日志的最新追加内容**。
- `ps aux`：查看当前系统运行的所有进程列表，常配合 grep 筛选特定进程。
- `kill`：终止进程。正常关闭使用 kill PID，遇到顽固进程使用 `kill -9 PID` 强制杀死。
- `chmod`：修改文件或目录权限。例如 chmod +x script.sh 赋予脚本执行权限，chmod 755 文件 设置基础读写执行权限。
- `history`：查看历史输入过的命令，避免重复输入长命令。
- `clear`：清空当前终端屏幕（快捷键 Ctrl + L）。
- `tar`：打包与解包。压缩使用 `tar -zcvf 包名.tar.gz` 目录，解压使用 `tar -zxvf 包名.tar.gz`。
- `vi/vim`：（vi的增强版，需要`yum install vim`来安装）编辑器来进行文本编辑操作
  ![vim](/vim.png)

### 软件安装

大多数场景，推荐使用系统自带的包管理器（如`apt` 或 `yum/dnf`）进行安装，这种方式**速度快、依赖自动处理且便于后续升级**。如果有特定版本需求，也可以上传软件二进制压缩包到Linux系统中`手动安装`。

以下是常用软件安装步骤:

#### Java安装

- 从 Oracle 官网下载Linux系统对应版本的`.tar.gz` 压缩包。
- 解压并移动到指定目录（如 /usr/local/java），例如：`tar -zxvf jdk-17.0.19_linux-x64_bin.tar.gz -C /usr/local/java`。
- 配置环境变量：编辑 `/etc/profile`文件，在末尾添加：
  ```shell
  export JAVA_HOME=/usr/local/java/jdk-17.0.9  #替换为实际路径
  export PATH=$JAVA_HOME/bin:$PATH
  ```
- 使配置生效：`source /etc/profile`
- 验证安装：`java -version`,若输出版本号则说明安装成功。

#### MySql安装
- 卸载系统中自带的mysql，mariadb（另一种数据库）安装包，否则会安装失败
  ```shell
  # 卸载mysql
  #查找系统安装的mysql包
  rpm -qa | grep mysql 
  #卸载该包（如有）
  rpm -e --nodeps [查找到的包名] 
  
  # 卸载mariadb
  rpm -qa | grep mariadb
  rpm -e --nodeps [查找到的包名]
  ```
- 下载Linux系统对应版本的Mysql`.tar.gz` 压缩包并上传至系统。
- 解压并移动到指定目录（如 /usr/local/mysql），例如：`tar -zxvf mysql-8.0.31-linux-glibc2.12-x86_64.tar.gz -C /usr/local/mysql`。
- 配置环境变量：编辑 `/etc/profile`文件，在末尾添加：
  ```shell
  export MYSQL_HOME=/usr/local/mysql
  export PATH=$MYSQL_HOME/bin:$PATH
  ```
- 注册MySql为系统服务
  ```shell
  cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql
  checkconfig --add mysql
  ```
- 初始化数据库
  ```shell
  groupadd mysql
  useradd -r -g mysql -s /bin/false mysql
  # 初始化完成后，日志会输出mysql root用户的临时密码，需记录下来
  ```
- 启动并登录MySql
  ```shell
  systemctl start mysql
  mysql -uroot -p # 然后输入密码
  ```
- 配置Mysql用户密码并授权远程访问
  ```shell
  # 修改密码
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '[新密码]';
  # 创建远程访问用户
  CREATE USER 'root'@'%' IDENTIFIED BY '[新密码]';
  GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
  FLUSH PRIVILEGES;
  ```
  - 测试远程访问
  ```shell
  #例如在win平台下连接
  mysql -h[ip] -P[端口] -u[用户名] -p[密码]
  # 如果发现链接不上，可能是防火墙问题，请检查防火墙
  ```

#### Nginx安装

- 安装nginx运行时所需依赖
  ```shell
  yum install -y pcre zlib zlib-devel openssl openssl-devel pcre pcre-devel 
   ```
- 从 Nginx 官网下载Linux系统对应版本的`.tar.gz` 源码压缩包并上传。
- 解压到当前目录例如：`tar -zxvf nginx-1.20.1.tar.gz`。
- 进入解压目录并配置nginx安装路径：`./configure --prefix=/usr/local/nginx`
- 编译源码并安装：`make && make install`
- 配置环境变量：编辑 `/etc/profile`文件，在末尾添加：
  ```shell
  export NGINX_HOME=/usr/local/nginx
  export PATH=NGINX_HOME/bin:$PATH
  ```
- 使环境变量配置生效：`source /etc/profile`
- 进入安装目录&启动nginx：`cd /usr/local/nginx/sbin` 和`sbin /nginx`

#### Node安装

## Nginx

Nginx 是目前互联网领域使用最广泛的高性能**反向代理服务器、负载均衡器，电子邮件代理服务器以及 Web服务器**。它以事件驱动的非阻塞 I/O 架构著称，能够以极低的内存消耗处理数万级并发连接

### 核心路径结构

以 Linux/CentOS/Ubuntu 为例：
```text
# nginx 安装目录
│
├── conf        # 配置文件目录 
    ├── nginx.conf  
├── html        # 静态资源存放(html,css,js等)
├── logs        # 日志文件
├── sbin        # nginx可执行文件
├── temp        # 临时文件
```

### 配置文件解析
```nginx
# conf/nginx.conf 

server { 
    # 监听80端口(默认)
     listen 80;
     server_name localhost; #生产环境请修改为实际域名
     # 下面设置路径匹配规则
     
     # 当浏览器访问/时
     location / {
         #设置访问/时的根路径，配置html等价于/user/local/nginx/html    
         root html; 
         #默认首页   
         index index.html index.htm;
         #静态资源不存在时，尝试访问index.html（核心兜底策略）
         try_files $uri $uri/ /index.html; 
     }
     
     # 当浏览器访问/api时（通常为接口请求）
     location ^~ /api/ {
          # 代理转发接口请求
          proxy_pass http://127.0.0.1:8080/;
        
          #⭐ 必加的代理头，否则后端拿不到真实IP和协议
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          
          # 超时设置，避免慢请求拖垮Nginx
          proxy_connect_timeout 5s;
          proxy_read_timeout 60s;
          proxy_send_timeout 30s;
     }
     location ~* \.(js|css)$ {
          expires 1y;
          add_header Cache-Control "public, immutable";
      }
     location ~* \.(js|css|png|jpg|jpeg|gif|ico|woff2)$ {
          root /var/www/static;
          expires 30d;              # 强缓存30天, 如果值为-1则等效于 Cache-Control: no-cache（不用强缓存，使用协商缓存）
          add_header Cache-Control "public, immutable"; # 配合hash文件名使用
          access_log off;           # 静态资源关闭日志，减少IO
     }
     
     
}
http {
    gzip on;                          # 1. 开启 Gzip 压缩
    gzip_comp_level 5;                # 2. 压缩级别（推荐 4-6，平衡 CPU 与压缩率）
    gzip_min_length 1024;             # 3. 最小压缩阈值（小于 1KB 不压缩，避免越压越大）
    gzip_vary on;                     # 4. 添加 Vary 头，防止 CDN 缓存错乱
    gzip_proxied any;                 # 5. 对经过代理的请求也启用压缩
    gzip_types                        # 6. 指定需要压缩的 MIME 类型
        text/plain 
        text/css 
        application/json 
        application/javascript 
        text/xml 
        application/xml;
}
```
常用命令：
- `nginx`：启动
- `nginx -s quit`：停止（待所有请求处理完毕后，工作进程再正常退出。适用于生产环境中的常规维护、版本升级）
- `nginx -s stop`：停止（立即终止所有的工作进程。适用于紧急故障处理、服务无响应。）
- `nginx -s reload`：重新加载
- `nginx -t`：检查配置文件
- `nginx -V`：查看nginx版本及编译参数

:::warning 注意事项
- `expires` 的判断依据是浏览器本地时间，而非服务器时间。如果用户手动改了系统时间，可能导致缓存失效或误命中。
- `不要压缩图片/视频`：Gzip 只对文本类数据（HTML/CSS/JS/JSON/XML）有效。对于 JPG、PNG 等已经压缩过的二进制文件，开启 Gzip 不仅无效，反而会白白消耗 CPU 资源。
- nginx配置变更后，请务必用`nginx -s reload`重新加载。
- `生产环境退出nginx首选quit而不是stop`，前者能够确保现有连接不被中断，对用户操作完全无感，保证了服务和数据的完整性。
:::

### location 匹配规则
```nginx 
server {
    listen 80;
    server_name localhost;
    
     # 规则 A：精确匹配
    location /api {
        return 200 "命中了/api 规则";
    }

    # 规则 B：带有 ^~ 的前缀匹配
    location ^~ /api {
        return 200 "命中了 ^~ /api 规则";
    }

    # 规则 C：正则匹配（匹配所有以 .json 结尾的请求）
    location ~ \.json$ {
        return 200 "命中了正则 .json 规则";
    }
}
```
基于上述nginx配置，如果我们发起一个请求：GET `/api/user/info.json`，则匹配步骤为：
1. Nginx 进行精确匹配，发现 /api/user/info.json 以 /api 开头，暂时记录规则A。然后往下寻找是否还有前缀匹配。
2. 接着发现规则B为最长前缀匹配，一旦匹配到 ^~ /api，立即应用规则 B，并直接跳过后续所有的正则表达式检查。。
3. 最终结果：返回 "命中了 ^~ /api 规则"。规则C 的正则表达式 \.json$ 根本没有机会被执行。

:::tip location匹配规则总结
1. 先检查精确匹配（=）。
2. 寻找最长前缀匹配，如果该前缀带有 `^~`，立即命中并结束匹配流程。
3. 如果前缀没有 ^~，则继续按顺序检查正则匹配（`~` 或 `~*`）。
4. 如果正则也没有命中，才回退使用之前记录的最长普通前缀匹配。
:::

### location与alias/root

在 Nginx 配置中，root 和 alias 的核心区别在于路径拼接逻辑。

示例：客户端请求 http://example.com/static/images/logo.png

- root 的核心逻辑是：**最终路径 = root路径 + 请求URI**

| location  | root                  | 客户端请求 URI | Nginx 实际查找的文件路径 |
| :--- |:----------------------| :--- | :--- |
| /static/ | /var/www/html;      | /static/images/logo.png | /var/www/html/static/images/logo.png| 
| /static | /var/www/html;      | /static/images/logo.png | /var/www/html/static/images/logo.png |
| /static/ | /var/www/html/;     | /static/images/logo.png | /var/www/html//static/images/logo.png |

- alias 的核心逻辑是：**最终路径 = alias路径 + 去除 location 前缀后的剩余URI**

| location  | alias                   | 客户端请求 URI | Nginx 实际查找的文件路径 | 
| :--- |:--------------------------| :--- | :--- |
| /static/ | /var/www/assets/;       | /static/images/logo.png | /var/www/assets/images/logo.png | 
| /static/ | /var/www/assets;  | /static/images/logo.png | /var/www/assetsimages/logo.png | 
| /static | /var/www/assets/; | /static/images/logo.png | /var/www/assets//images/logo.png | 

:::tip 最佳实践
- `root` 的尾部斜杠是可选的；但 `alias` 的尾部斜杠是必须的，否则极易引发路径粘连导致的 404 错误。
- 在同一个 location 块中，千万`不要同时使用 root 和 alias`，这会导致路径被重复拼接或产生不可预期的行为。
:::

### location与proxy_pass

location和proxy_pass末尾是否带斜杠决定路径是否会被重写

| location |proxy_pass| 客户端请求 | 后端实际接收到的 URI
| :--- | :--- | :--- | :--- |
|  `/api` |`http://backend` | `/api/users` | `/api/users` |
| /api/|  **http://backend** | /api/users | /api/users |
| `/api/` |`http://backend/` | `/api/users` | `/users` |
| `/api/` |`http://backend/v1/` | `/api/users` | `/v1/users` |
| /api/| http://backend/v1 | /api/users | /v1users |
| /api|http://backend/ | /api/users | //users |

> 最佳实践：`location和proxy_pass末尾斜杠行为保持一致`，想要重写就都添加斜杠，否则都不添加斜杠

### 项目部署示例

#### 前端部署

1. 将前端打包构建后的静态资源上传至 Nginx安装目录下的 静态资源目录，例如 `/user/local/nginx/html`。
2. 在配置文件目录`config/nginx.conf`中配置反向代理服务器和路径重写规则：
3. 执行nginx命令启动Nginx服务

#### 后端部署

1. 将后端项目编译（执行`package`生命周期打包）后的可执行文件(jar包)上传至 Nginx安装目录下的 bin 目录，例如 `/user/local/nginx/java/[项目名]`。
2. 进入上面的目录，后台运行服务进程并设置日志路径（避免直接通过java启动服务后Linux终端被关闭而停止服务）：`nohup java -jar [包名].jar &> [包名].log &`
3. 查看进程运行状态：`ps -ef | grep [包名].jar`


