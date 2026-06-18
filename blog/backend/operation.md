# 运维

## Linux


## Nginx

Nginx 是目前互联网领域使用最广泛的高性能**反向代理服务器、负载均衡器，电子邮件代理服务器以及 Web服务器**。它以事件驱动的非阻塞 I/O 架构著称，能够以极低的内存消耗处理数万级并发连接

### 核心路径结构

以 Linux/CentOS/Ubuntu 为例：

| 路径                          | 作用 | 备注 |
|:----------------------------| :--- | :--- |
| `/etc/nginx/nginx.conf`     | 主配置文件 | 全局配置、include 入口、worker 进程定义 |
| `/etc/nginx/conf.d/*.conf`  | 业务配置目录 | 推荐将每个站点/服务独立为一个 .conf 文件 |
| /etc/nginx/sites-available/ | 站点配置库 | Debian/Ubuntu 特有，存放所有站点配置 |
| /etc/nginx/sites-enabled/   | 站点启用链接 | 通过软链接指向 sites-available，控制启停 |
| `/var/log/nginx/access.log` | 访问日志 | 记录所有请求的详细信息 |
| `/var/log/nginx/error.log`  | 错误日志 | 排查问题的第一现场，按 error/warn/info 分级 |
| `/usr/share/nginx/html/`    | 默认静态资源根目录 | 未指定 root 时的兜底目录 |
| /run/nginx.pid              | 主进程 PID 文件 | reload/restart 时用于信号通信 |
| /etc/nginx/mime.types`      | MIME 类型映射 | 决定浏览器如何解析响应内容 |

:::tip 技巧
生产环境中永远**不要把所有配置写在 nginx.conf 里**。使用 include /etc/nginx/conf.d/*.conf; 将配置模块化，每个微服务或域名一个文件，便于版本管理和团队协作。
:::

### 配置技巧

#### 1. 基础高性能调优

```nginx
# nginx.conf 全局块
worker_processes auto;           # 自动匹配CPU核心数
worker_rlimit_nofile 65535;      # 单worker最大打开文件数
events {
    worker_connections 4096;     # 单worker最大并发连接数
    use epoll;                   # Linux下必选epoll模型
    multi_accept on;             # 一次accept多个新连接
}
```

#### 2.反向代理与负载均衡（最常用场景）

```nginx
upstream backend_api {
    least_conn;                  # 最少连接算法，比轮询更均衡
    server 10.0.1.10:8080 weight=5 max_fails=3 fail_timeout=30s;
    server 10.0.1.11:8080 weight=3 max_fails=3 fail_timeout=30s;
    server 10.0.1.12:8080 backup; # 备用节点，仅当其他节点全挂时启用
    keepalive 64;                # ⭐ 保持长连接池，大幅减少TCP握手开销
}

server {
    listen 80;
    server_name api.example.com;

    location /api/ {
        proxy_pass http://backend_api;
        
        # ⭐ 必加的代理头，否则后端拿不到真实IP和协议
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置，避免慢请求拖垮Nginx
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
        proxy_send_timeout 30s;
    }
}
```

#### 3.静态资源缓存与 Gzip 压缩

```nginx
# 全局开启Gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain application/json application/javascript text/css image/svg+xml;

server {
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|woff2)$ {
        root /var/www/static;
        expires 30d;              # 强缓存30天
        add_header Cache-Control "public, immutable"; # 配合hash文件名使用
        access_log off;           # ⭐ 静态资源关闭日志，减少IO
    }
}
```
:::warning 注意事项
- `location` 和 `proxy_pass` 要么都带尾部斜杠，要么都不带。混合使用几乎必然导致路径错乱。修改后务必用`curl -v`验证实际转发路径。
- nginx配置变更后，请务必用`nginx -s reload`重新加载，不要用`nginx -s stop`重启。
:::