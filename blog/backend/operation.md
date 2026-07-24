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
- `ps -ef | grep [进程名称关键词]`：通过关键词搜索进程。
- `kill [进程PID]`：终止进程。正常关闭使用 kill PID，遇到顽固进程使用 `kill -9 [PID]` 强制杀死。
- `chmod`：修改文件或目录权限。例如 chmod +x script.sh 赋予脚本执行权限，chmod 755 文件 设置基础读写执行权限。
- `history`：查看历史输入过的命令，避免重复输入长命令。
- `clear`：清空当前终端屏幕（快捷键 Ctrl + L）。
- `tar`：打包与解包。压缩使用 `tar -zcvf 包名.tar.gz` 目录，解压使用 `tar -zxvf 包名.tar.gz`。
- `vi/vim`：（vi的增强版，需要`yum install vim`来安装）编辑器来进行文本编辑操作
  ![vim](/vim.png)

### 软件安装

大多数场景，推荐使用系统自带的包管理器（如`apt` 或 `yum/dnf`）进行安装，这种方式**速度快、依赖自动处理且便于后续升级**。如果有特定版本需求，也可以上传软件二进制压缩包到Linux系统中`手动安装`。

以java安装为例：
- 从 Oracle 官网下载Linux系统对应版本的`.tar.gz` 压缩包。
- 解压并移动到指定目录（如 /usr/local/java），例如：`tar -zxvf jdk-17.0.19_linux-x64_bin.tar.gz -C /usr/local/java`。
- 配置环境变量：编辑 `/etc/profile`文件，在末尾添加：
  ```shell
  export JAVA_HOME=/usr/local/java/jdk-17.0.9  #替换为实际路径
  export PATH=$JAVA_HOME/bin:$PATH
  ```
- 使配置生效：`source /etc/profile`
- 验证安装：`java -version`,若输出版本号则说明安装成功。


## Nginx

Nginx 是目前互联网领域使用最广泛的高性能**反向代理服务器、负载均衡器，电子邮件代理服务器以及 Web服务器**。它以事件驱动的非阻塞 I/O 架构著称，能够以极低的内存消耗处理数万级并发连接

### 安装启动

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

:::code-group
```nginx [基本示例]
# conf/nginx.conf 

# 定义跨域请求的白名单映射
# 根据请求的来源动态设置$cors_origin的值
map $http_origin $cors_origin {
    default "";
    "http://localhost:3000" $http_origin;
    "https://www.yourdomain.com" $http_origin;
}
http {
    # 当前是主配置文件，可以通过include引入其他配置文件
    include /etc/nginx/conf.d/*.conf;

    #gzip配置
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
        
    # http模块中可以添加多个server模块配置 
    # 每个server对应一个域名   
    server { 
      # 监听80端口(默认)
     listen 80;
     # 服务名，生产环境请修改为实际域名方便各个域名独立配置
     server_name localhost; 
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
          
           # 处理预检请求（OPTIONS）
          if ($request_method = 'OPTIONS') {
              return 204;
          }
     }
     
       # 当浏览器访问/api-test时（如果是跨域请求，例如在A域名的网站访问当前域名的接口）
       location ^~ /api-test {
          # 代理转发接口请求，这里为当前Linux服务器启动的8083端口服务（例如springboot服务端口）
          proxy_pass http://127.0.0.1:8083;
          #⭐ 必加的代理头，否则后端拿不到真实IP和协议
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
 
          # 配置允许调用当前域名的网站域名（无限制则用'*'）
          # 允许多个域名，可以使用变量：add_header 'Access-Control-Allow-Origin' $http_origin always;
          add_header 'Access-Control-Allow-Origin' 'http://aaaa.com' always;
          # 2. 允许携带 Cookie 或 Authorization 认证信息
          add_header 'Access-Control-Allow-Credentials' 'true' always;
          # 3. 允许的请求方法（建议加上 PUT, DELETE 等常用方法）
          add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
          # 4. 允许前端携带的自定义请求头
          add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
          
          # 超时设置，避免慢请求拖垮Nginx
          proxy_connect_timeout 5s;
          proxy_read_timeout 60s;
          proxy_send_timeout 30s;
     }
     # 处理websocket
     location ^~ /api/ws { 
        # 设置代理地址
         proxy_pass http://0.0.0.0:8083; 
         
         # 设置代理使用的 HTTP 版本为 1.1，这是 WebSocket 所必需的。
         proxy_http_version 1.1; 
         
         # 传递 Upgrade 头信息给后端服务器，这告诉服务器客户端希望升级到 WebSocket 协议。
         proxy_set_header Upgrade $http_upgrade;
         
         # 传递 Connection 头信息，用于控制或指定当前连接或消息体的性质。
         proxy_set_header Connection "upgrade";
         
         # 传递原始的请求头主机信息
         proxy_set_header Host $host;
      
         # 关键：移除或重写 Origin 头，让后端认为是同源请求
         proxy_set_header Origin ""; 
	}
     
     # 处理静态文件
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
}
```
```nginx [https配置]
# 1. 80 端口：捕获所有 HTTP 请求并强制 301 重定向到 HTTPS
server {
    listen 80;
    server_name agentdesk.peaksscrm.com;
    return 301 https://$host$request_uri;
}

# 2. 443 端口：提供安全的 HTTPS 服务
server {
    listen 443 ssl http2;  # 开启 443 端口、ssl 和 HTTP/2 协议
    server_name agentdesk.peaksscrm.com;

    # --- SSL 证书配置 ---
    ssl_certificate     /etc/nginx/ssl/agentdesk.peaksscrm.com.pem;
    ssl_certificate_key /etc/nginx/ssl/agentdesk.peaksscrm.com.key;
    ssl_trusted_certificate /etc/nginx/ssl/ca-bundle.crt; # 中间链证书

    # --- SSL 安全与性能优化（推荐配置） ---
    ssl_protocols TLSv1.2 TLSv1.3;  # 禁用老旧协议，仅使用安全版本
    ssl_ciphers HIGH:!aNULL:!MD5;   # 启用强加密算法
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # --- 业务逻辑配置（如反向代理或静态文件） ---
    location / {
        proxy_pass http://127.0.0.1:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme; # 告诉后端当前是 HTTPS
    }
}
```
:::tip nginx配置常用内置变量
Nginx 提供了大量内置变量，用于获取当前请求或服务器的各类信息，可以直接在配置中引用：
- `$remote_addr`：客户端 IP 地址。
- `$request_uri`：包含请求参数的原始 URI。
- `$http_x_forwarded_for`：当前端有正向代理服务器时，此参数用于获取客户端真实的 IP 地址。
- `$http_user_agent`：当前请求的客户端浏览器信息。
- `$http_origin`：当前请求的 Origin 头，用于 CORS 请求。
- `$request_uri`：包含请求参数的原始 URI，不包含主机名（例如 /foo/bar.php?arg=baz）。此变量不可被修改。
- `$uri`：当前请求的 URI，不带请求参数。在请求处理过程中，它可能会因内部重定向或使用 index 指令而发生改变。
- `$request_method`：客户端发起的请求动作，通常为 GET、POST、PUT 或 DELETE 等。
- `$scheme`：请求使用的协议，如 http 或 https。
- `$host`：请求的主机名。其优先级为：HTTP 请求行中的主机名 > Host 请求头字段 > 匹配的 server_name。
:::


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
    server_name sss.aaa.com;
    
     # 规则 A（普通前缀匹配）
    location /api {
        # ...
    }

    # 规则 B （带^~的前缀匹配）
    location ^~ /api {
       # ...
    }

    # 规则 C （正则匹配）
    location ~ /api {
         # ...
    }
}
```
基于上述nginx配置，如果我们发起一个请求：GET `/api/user/detail`，则匹配步骤为：
1. 首先会扫描所有非正则的 location（即规则 A 和规则 B）。
2. 发现规则 A（/api）和规则 B（^~ /api）都能匹配/api/user/detail，选出最长的的那个即规则B并标记为最长前缀匹配。
3. 因为规则 B 带有 `^~`，Nginx 会立即触发“急刹车”机制，直接采用规则 B 并终止整个匹配流程
4. 如果不存在规则B（即没有^~进行拦截），则标记规则A为最长前缀匹配，然后继续发现存在正则匹配规则C也可匹配/api/user/detail，则最终应用规则C。

:::tip 存在多个匹配规则都可匹配当前请求时的规则采用优先级

`含^~的前缀匹配 > 正则匹配 > 普通前缀匹配`

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

### 项目部署

#### 前端部署

1. 将前端打包构建后的静态资源上传至 Nginx安装目录下的 静态资源目录，例如 `/user/local/nginx/html`。
2. 在配置文件目录`config/nginx.conf`中配置反向代理服务器和路径重写规则：
3. 执行nginx命令启动Nginx服务

#### 后端部署

1. 将后端项目编译（执行`package`生命周期打包）后的可执行文件(jar包)上传至 Nginx安装目录下的 bin 目录，例如 `/user/local/nginx/java/[项目名]`。
2. 进入上面的目录，后台运行服务进程并设置日志路径（避免直接通过java启动服务后Linux终端被关闭而停止服务）：`nohup java -jar [包名].jar &> [包名].log &`
3. 查看进程运行状态：`ps -ef | grep [包名].jar`


## Docker

Docker 是一个开源的容器化平台，它能够**将应用程序及其所有依赖项打包成一个标准化的单元（即“容器”），从而在任何支持 Docker 的环境中快速部署和运行**。Docker 采用客户端-服务器（C/S）架构，其核心组件包括：
- **镜像**（Image）：容器的只读模板，包含了运行应用所需的所有文件系统和依赖。
- **容器**（Container）：镜像的运行实例，提供轻量级、相互隔离的运行环境。
- **仓库**（Registry）：集中管理和分发镜像的平台，如公共的 Docker Hub 或企业私有仓库。

Docker 的核心优势在于`环境一致性`（解决“在我机子上没问题”的痛点）、`极高的资源利用率`和`毫秒级的启动速度`，已成为现代微服务架构和 CI/CD 流程中不可或缺的工具。

### 产生背景

- **解决“环境一致性”与“依赖冲突”难题**

  开发、测试和生产环境之间存在配置差异，且不同项目之间的依赖项容易发生冲突，常常面临“在我的机器上可以运行，但在你的机器上却不行”的窘境。

  Docker 通过将应用程序及其所有依赖项（如代码、运行时、库、环境变量等）打包到一个称为“容器”的独立运行环境中，确保了环境的一致性，实现了“一次镜像，处处运行”。
- **解决虚拟机启动慢，资源占用大，利用率低的问题**

  之前通常使用虚拟机来解决环境隔离问题，然而，虚拟机技术过于笨重，它需要模拟完整的硬件系统并运行一个完整的操作系统，导致资源占用大（GB级空间）、启动速度慢（分钟级），且性能开销高。

  Docker 作为一种轻量级的虚拟化技术，不需要虚拟出整个操作系统，而是直接运行在宿主主机的内核中，仅需 MB 级空间且能在几秒钟内启动，极大地提高了资源利用率。

- **简化繁杂的部署与运维流程**

  传统的应用开发完成后，运维团队需要根据繁杂的配置文档在服务器上安装各种软件并进行配置，不仅费时费力，还极易出错，且难以跨平台移植。

  Docker 打破了“程序即应用”的传统观念，将运作应用所需的系统环境由下而上打包，使得应用的交付、部署和升级变得像搭乐高积木一样简单便捷，大大降低了运维成本。

### 安装使用

使用阿里云镜像安装：
```bash
sudo curl -fsSL https://gitee.com/tech-shrimp/docker_installer/releases/download/latest/linux.sh | bash -s docker --mirror Aliyun
```
常用基本命令：
- 启动Docker：`systemctl start docker`
- 停止Docker：`systemctl stop docker`
- 重启Docker：`systemctl restart docker`
- 设置Docker开机自启：`systemctl enable docker`
- 查看Docker运行状态：`systemctl status docker`

常用镜像命令：
- 拉取镜像：`docker pull [镜像名:版本]`
- 推送镜像（需权限）：`docker push [镜像名:版本]`
- 查看本地已有所有镜像：`docker images`
- 删除本地镜像：`docker rmi [镜像名:版本]`
- 自定义制作镜像：`docker build`
- 打包镜像：`docker save -o [打包后的tar文件名] [镜像名:版本]`
- 加载镜像：`docker load -i [.tar打包文件]`

常用容器命令：
- 运行容器：`docker run [镜像名:版本]`
- 停止容器：`docker stop [容器名]`
- 启动已停止的容器：`docker start [容器名]`
- 查看正在运行的Docker容器（也可用来验证docker是否安装成功）：`docker ps`
- 进入容器：`docker exec -it [容器名] bash`
- 退出已进入的容器：`exit`
- 删除容器：`docker rm [容器名]`
- 查看某容器的日志：`docker logs [容器名]`
- 查看某容器的详情（例如容器ip地址）：`docker inspect [容器名]`



### 镜像安装和容器运行

Docker中的应用安装均基于镜像。镜像不仅包含应用本身，还包含应用运行所需要的环境、配置、系统函数库。

示例：在Docker中安装MySql

```bash
docker run -d \  
--name mysql-server \
-p 3307:3306 \
-v /mydata/mysql/conf:/etc/mysql/conf.d \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/logs:/var/log/mysql \
-e MYSQL_ROOT_PASSWORD=your_password \
mysql:8.0
```
:::tip 镜像安装命令解析
- docker run：表示创建并运行一个容器，
- -d：表示后台运行，
- --name：表示容器名称，
- `-p [a]:[b]`：表示容器的端口映射到宿主机的端口（[a]为`宿主机端口`，[b]为`容器端口`。创建容器时，**外部无法直接访问容器的端口，只能访问映射后的宿主机端口**），
- `-v [a]:[b]`：表示数据卷映射，[a]为宿主机目录，[b]为容器目录，
- -e：表示环境变量
- mysql:8.0：表示要下载的镜像名称和版本。
:::

执行上述命令时，Docker会先查看本地是否存在该应用的镜像版本，若有则优先使用本地，没有则从官方公共镜像仓库（Docker Hub）中自动搜索并下载应用镜像(image)。

Docker会在运行镜像时会创建一个`隔离环境`，称为`容器`(container)，同一个镜像可以创建多个容器（例如mysql可以安装多个实例），容器之间互相隔离，互不影响。

>使用Docker拉取指定应用镜像并创建运行容器前，记得要删除或停止调之前已存在的对应应用进程，避免干扰


以下是其他常用镜像安装命令

:::code-group
```bash [Java17]
docker run -d --name jdk17 openjdk:17 /bin/bash
```
```bash [nginx]
docerker run -d  --name nginx -p 80:80 nginx:1.20.2

# 注意docker中nginx容器的默认静态文件路径为：/usr/share/nginx/html
```
```bash [node]
docker run -d --name node22 -p 3000:3000 node:22
```
:::warning 注意事项
- 在Docker创建的镜像容器中，默认并不支持ll,vim,vi等部分基础命令，因为Docker容器只包含该镜像所必需的运行环境，避免容器中运行环境过多，导致镜像体积过大。


:::

### 数据卷

#### 产生背景

在 Docker 中，容器默认使用的是临时文件系统（可写层）。这意味着容器内的所有数据（如日志、数据库文件、用户上传的内容等）都直接存储在容器的可写层中。这种设计带来了几个致命的问题：
- `数据随容器消亡`：一旦容器被删除或重建，其内部的所有修改和数据都会永久丢失。对于数据库等有状态服务来说，这是绝对不可接受的。
- `性能瓶颈`：容器底层的联合文件系统（如 overlay2）在处理频繁写入、大文件或随机 I/O 时性能较差，存在写时复制（CoW）的开销。
- `数据交互困难`：默认情况下，宿主机的文件系统与容器是隔离的，**外部无法直接访问容器内部的文件**，必须通过 docker cp 手动拷贝，极不方便。

Docker 引入了数据卷（Volume）机制。数据卷将**数据存储在容器外部（宿主机或外部存储系统）**，使其生命周期独立于容器。即使容器被删除，数据依然安全保留，同时还能实现容器与宿主机之间的数据共享与实时同步。

> 数据卷(volume)是一个虚拟目录，是 容器内目录 与 宿主机目录 之间映射的桥梁。通过此映射，数据卷可以通过修改宿主机的文件从而同步修改了容器内的数据，并**实现数据持久化**。


#### 数据挂载

Docker 提供了三种主要的数据挂载方式，其中最常用的是`命名卷`（Volume）和`绑定挂载`（Bind Mount）：

1. **命名卷（生产环境首选）**

由 Docker 完全管理，数据默认存储在 /var/lib/docker/volumes/ 下。用户无需关心底层路径，可移植性强。
```bash
docker volume create [数据卷名称]       # 创建数据卷
docker volume ls                  # 列出所有卷
docker volume inspect [数据卷名称]      # 查看卷详情（包含实际存储路径）
docker volume rm [数据卷名称]           # 删除卷
docker volume prune               # 删除所有未使用的卷
```
挂载使用：
```bash
# mydata为数据卷名称（不存在则创建），/var/lib/mysql为容器内的目录
docker run -d -v mydata:/var/lib/mysql --name db mysql:8.0
```
**2. 绑定挂载**

直接在创建并运行容器时，将宿主机上的任意路径文件直接映射到容器中。

```bash
# /home/user/myapp为宿主机目录，/app为容器内目录
# 宿主机目录可以使用绝对路径/xxx，也可以使用相对路径./xxx
docker run -d -v /home/user/myapp:/app --name dev node:18
```
:::warning 注意
- `务必使用命名卷或绑定挂载`：如果仅指定 -v /var/lib/mysql 而不加本地路径或卷名，会**创建匿名卷**。部分 Docker 环境在重启或清理时可能会将匿名卷一并删除，导致数据丢失。
- 如果-v后面的值没有以/或者./开头，则会被识别为数据卷的名称（采用第一种命名卷方式），而不是本地绑定挂载的宿主机路径
:::

3. **临时卷（tmpfs）**

数据仅存储在宿主机的内存中，不写入磁盘。容器停止后数据立即消失，适合存储密码、会话等敏感临时数据。

### 自定义镜像

我们可以直接使用 Docker Hub 上的官方镜像，但在实际项目中，往往需要在基础镜像上安装额外软件、配置环境变量或打包自己的代码。

这时就需要通过编写 `Dockerfile` 来构建自定义镜像。


示例：基于 Spring Boot 的 Java 应用自定义镜像

1. 在本地创建一个项目目录，准备以下文件：
```text
- jdk17.tar.gz（jdk安装压缩包）
- app.jar（java应用程序包）
- Dockerfile（构建指令文件）
```

2. 编写Dockerfile 文件：
```dockerfile
# 使用 CentOS 7 作为基础镜像
FROM centos:7

# 复制JDK安装压缩包到 到容器指定路径中
COPY jdk17.tar.gz /usr/local/
# 解压压缩包并删除压缩包
RUN tar -xzf /usr/local/jdk17.tar.gz -C /usr/local/ &&  rm /usr/local/jdk17.tar.gz

# 设置环境变量（注意这里的jdk-17.0.10是压缩包内根路径的名称即解压后的文件夹名称）
ENV JAVA_HOME=/usr/local/jdk-17.0.10
ENV PATH=$JAVA_HOME/bin:$PATH

# 创建应用目录
RUN mkdir -p /app
# 切换至该目录
WORKDIR /app

# 复制应用 JAR 文件到容器的/app应用目录
COPY app.jar app.jar

# 暴露端口
EXPOSE 8080

# 设置容器启动时的运行命令
ENTRYPOINT ["java","-jar","/app/app.jar"]
```
:::tip dockerfile 语法

Dockerfile 是一个纯文本文件，包含了构建镜像所需的所有命令。以下是几个最常用的指令及其作用：

- **FROM**：指定基础镜像（Dockerfile 的第一个命令）。例如 FROM python:3.8-slim。
- **WORKDIR**：设置容器中的工作目录，后续的 RUN、COPY 等命令都会在此目录下执行。
- **COPY**：将宿主机（本地）的文件或目录复制到容器中。
- **RUN**：在容器构建阶段执行命令行指令，常用于安装软件包或执行编译操作。
- **ENV**：设置环境变量，方便在容器内或后续指令中使用。
- **EXPOSE**：声明容器在运行时监听的端口，供外界访问。
- **ENTRYPOINT**：定义容器启动时默认执行的命令，通常用于启动应用程序。
:::

3. 在包含 Dockerfile 的目录下执行镜像构建

```shell
#my-java-app为镜像名称，1.0为镜像版本, .为Dockerfile文件所在路径（示例为当前目录）

docker build -t my-java-app:1.0 .
```


4. 创建并运行容器

```shell
docker run -d --name my-java-app -p 8080:8080 my-java-app:1.0
```

### 网络机制

Docker默认 会在宿主机上创建一个名为 docker0 的**虚拟网桥**，容器启动时通过 veth pair 接入该网桥。

**容器拥有独立的 IP 地址**，容器间通过`网桥`进行二层通信，访问外网则通过 iptables 进行 NAT 地址转换。

#### 自定义网络

使用 `docker network create` 命令可以创建自定义网络。如果不指定驱动，Docker 默认会创建`桥接`网络。

:::code-group
```shell [基础方式]
docker network create my-network
```
```shell [自定义方式]
docker network create \
  --driver bridge \
  --subnet=172.25.0.0/16 \
  --gateway=172.25.0.1 \
  --ip-range=172.25.50.0/24 \
  my-custom-network
```
:::

使用创建的Docker网络：

```shell 
# 场景1：启动容器时绑定网络
docker run -d --network my-custom-network --name web nginx:latest

# 场景2：为运行中的容器动态连接网络
docker network connect my-custom-network existing-container

# 场景3：容器之间可以直接通过容器名称进行互相访问
# 创建网络并启动数据库
docker network create webapp
docker run -d --network webapp --name database mysql:8.0

# 启动后端服务
# 进入backend 容器内，可以直接通过 database 这个主机名来访问 MySQL 服务
docker run -d --network webapp --name backend node-app:latest
```

常用Docker网络命令：
- `docker network create [网络名称]`：创建一个自定义网络。
- `docker network inspect [网络名称]`：查看指定网络的详细信息。
- `docker network connect [网络名称] [容器名称] `：将容器连接到一个网络。
- `docker network disconnect 网络名称] [容器名称] `：将容器从网络中分离。
- `docker network rm [网络名称]`：删除一个自定义网络。
- `docker network ls`：列出所有网络。
- `docker network prune`：删除所有未使用的网络。


### 项目部署

#### 前端

1. 在Linux服务器端的宿主机上先创建好nginx必要目录（如.conf配置文件和静态资源目录）
2. 将打包后的前端静态资源和写好的nginx配置文件上传至宿主机上创建的nginx目录上
3. 创建并运行一个nginx容器（命令卷挂载）并设置好与宿主机端的nginx目录映射（使用绑定挂载）

#### 后端

以SpringBoot + MySql项目为例：

1. 在Linux服务器端先创建并运行一个mysql容器（命令卷挂载）并创建好表结构
2. 修改SpringBoot项目配置文件，将数据库连接信息改为docker中mysql的连接信息（可使用docker自定义网络名称代替ip地址），以及修改logback日志路径，最后打执行package生命周期打jar包
3. 编写dockerFile文件并与jar包放在同一目录下，执行构建自定义镜像相关命令并运行容器

#### DockerCompose

随着微服务架构的兴起，一个完整的应用往往由多个容器（如 Web 服务、数据库、缓存等）协同工作。如果仅使用原生的 Docker 命令，开发者需要为每个服务手动执行 docker run，并繁琐地配置端口映射、环境变量、网络和数据卷。这种方式不仅极易出错，而且难以保证开发、测试和生产环境的一致性。

Docker Compose允许用户通过一个 `YAML 配置文件(docker-compose.yml)定义整个应用栈`，并使用简单的命令一键启动或停止所有关联服务，极大简化了多容器应用的部署和管理流程。

1. **创建一个项目目录如app，准备以下文件**：

```text
- mysql（mysql相关配置目录）
- nginx（nginx相关配置目录，包含conf和html目录）
- jdk17.tar.gz（jdk安装压缩包）
- app.jar（java应用程序包）
- Dockerfile（构建指令文件）
- docker-compose.yml
```

其中docker-compose.yml编写示例：

```yaml
# docker-compose.yml
services:
  # mysql镜像容器配置
  mysql:
    image: mysql:8
    container_name: mysql
    ports:
      - "3307:3306"
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 123
    volumes:
      - "/usr/local/app/mysql/conf:/etc/mysql/conf.d"
      - "/usr/local/app/mysql/data:/var/lib/mysql"
      - "/usr/local/app/mysql/init:/docker-entrypoint-initdb.d"
    networks:
      - my-net
  # java-app镜像的容器配置    
  java-app:
    # build表示使用Dockerfile文件进行自定义构建镜像，而不是拉取镜像或使用已有镜像
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: java-app
    ports:
      - "8080:8080"
    networks:
      - my-net
    # 配置依赖关系，确保mysql容器配置运行成功后再运行java-app容器
    depends_on:
      - mysql
  # nginx镜像的容器配置    
  nginx:
    image: nginx:1.20.2
    container_name: my-nginx
    ports:
      - "80:80"
    volumes:
      - "/usr/local/app/nginx/conf/nginx.conf:/etc/nginx/nginx.conf"
      - "/usr/local/app/nginx/html:/usr/share/nginx/html"
    # 配置依赖关系，确保java-app容器配置运行成功后再运行nginx容器
    depends_on:
      - java-app
    networks:
      - my-net
#网络定义      
networks:
  my-net:
    name: my-net-name
```
2. **通过docker-compose`相关命令管理此项目目录（需进入此目录）**
- 后台运行所有容器：`docker-compose up -d`。
- 停止并移除容器、网络：`docker-compose down`
- 查看所有容器的运行状态：`docker-compose ps`
- 查看实时日志输出：`docker-compose logs -f`
- 重新构建并启动(例如dockerfile有修改时)：`docker-compose up -d --build`
- 进入指定容器内部执行命令：`docker-compose exec [service-name] /bin/bash`
