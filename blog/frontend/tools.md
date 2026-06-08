# 常用工具类/函数


## 防抖/节流

:::code-group 
```ts [防抖]
export const debounce = (fun: (...args: any[]) => void, delay: number) => {
    let timer: number | null;

    return (...args: any[]) => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = window.setTimeout(() => {
            fun.call(EMPTY, ...args);
            timer = null;
        }, delay);
    };
};


```
```ts [节流]
export const throttle = (fun: (...args: any[]) => void, delay: number) => {
    let timer: number | null;

    return (...args: any[]) => {
        if (timer) {
            return;
        }

        timer = window.setTimeout(() => {
            fun.call(EMPTY, ...args);
            timer = null;
        }, delay);
    };
};
```
:::

## (毫)秒数->时长HH:mm:ss

```ts
export const transformMsToText = (value: number, type: 'ms' | 's' = 'ms') => {
    if (!value) {
        return '00:00:00';
    }
    const msSeconds = type === 'ms' ? value / 1000 : value;

    // 转换为时分秒
    const hours = parseInt(((msSeconds / 60 / 60) % 24).toString());
    const hoursText = hours < 10 ? '0' + hours : hours;
    let minutes = parseInt(((msSeconds / 60) % 60).toString());
    const minutesText = minutes < 10 ? '0' + minutes : minutes;
    const seconds = parseInt((msSeconds % 60).toString());
    const secondsText = seconds < 10 ? '0' + seconds : seconds;
    // 作为返回值返回
    return `${hoursText}:${minutesText}:${secondsText}`;
};

```

## 常用正则表达式

```ts
export const Reg = {
    // 自然数（0，1，2，3，4）
    natureNo: /^(0|[1-9][0-9]*)$/,
    // 非0数量（1，2，3...）
    noZeroAmount: /^[1-9]\d*$/,
    // 手机号码
    mobileTel: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
    // 固定电话号码（带区号）
    fixedTel: /^(0\d{2,3})-?(\d{7,8})$/,
    // url地址(以http或https开头)
    url: /^(https?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/,
    // 最多两位小数的数字
    fixed2No: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
    // 邮箱正则
    email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    //检测移动端设备平台（通过navigator.userAgent.match匹配）
    isMobile: /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/
    
};
```

## File/Blob/Base64转换

### base64（带文件类型） -> Blob/File

```ts
export const base64toBlob = (base64 = '') => {
    const arr = base64.split(',');
    const mime = arr?.[0]?.match(/:(.*?);/)?.[1];
    const suffix = mime?.split('/')[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    const blob = new Blob([u8arr], { type: mime });
    
    // File对象是基于Blob实现的，可以快速转换成file
    // const file = new File([blob], 'fileName',{...options});
    return  blob
};
```

### base64（无文件类型） -> Blob/File

```ts
export function base64toBlobWithoutType(base64Str = '') {
    const bstr = atob(base64Str);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], {
        type: 'application/octet-stream'
    })
    // File对象是基于Blob实现的,可以快速转换成file
    // const file = new File([blob], 'fileName',{...options});
    return blob
 
}
```

### File/Blob -> base64

```ts
export const fileToBase64 = (file:File|Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
```

### File -> Blob

```ts
export const fileToBlob = (file:File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        //转换成arrayBuffer，blob由arraybuffer的集合组成
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(new Blob([reader.result]));
        reader.onerror = (error) => reject(error);
    });
};
```

### 根据url下载文件

```ts
export const downLoadByUrl = (fileLinkUrl, fileName?) => {
    const handleFileDownload = (url, filename) => {
        // 创建 a 标签
        const a = document.createElement('a');

        a.href = url;
        a.download = filename;
        a.click();
    };

    // handleFileDownload(fileLinkUrl, fileName);

    return new Promise((resolve, reject) => {
        Toast.loading(true);

        fetch(fileLinkUrl, {
            method: 'get',
            mode: 'cors'
        })
            .then(function (res) {
                if (res.status !== 200) {
                    throw new Error('文件下载异常');
                }

                return res.arrayBuffer();
            })
            .then((blobRes) => {
                // 生成 Blob 对象，设置 type 等信息
                const e = new Blob([blobRes], {
                    type: 'application/octet-stream'
                });
                // 将 Blob 对象转为 url
                const link = window.URL.createObjectURL(e);

                handleFileDownload(link, fileName);
                resolve(true);
            })
            .catch((err) => {
                const strErr = err.toString();

                reject(strErr);
                Toast.fail(strErr);
            })
            .finally(() => {
                Toast.loading(false);
            });
    });
};
```

## 复制文本到粘贴板

```ts
export const copyText = (text) => {
    const textArea = document.createElement('textarea') as any;
    textArea.value = text;
    // 手机端防止页面抖动
    textArea.style.width = 0;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999px';
    textArea.style.top = '10px';
    textArea.setAttribute('readonly', 'readonly');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
};

```

## 指定可滚动的容器元素滚动条到底部

```ts
export const scrollToBottom = (
    domRef: MutableRefObject<any> | Element | null,
    callback?: () => void
) => {
    setTimeout(() => {
        // 处理滚动到底部的距离计算
        const ele = (domRef as MutableRefObject<any>)?.current ?? domRef;
        const totalHeight = ele?.scrollHeight || 0;
        const clientHeight = ele?.clientHeight || 0;
        const scrollTop = totalHeight - clientHeight;

        if (ele) {
            ele.scrollBy({
                top: scrollTop,
                behavior: 'smooth'
            });

            callback?.();
        }
    }, 200); // 滚动底部有误差，暂时用延时器解决
};

```

## bytes（字节数） -> kb/mb/gb

```ts
export const transformBytes = (bytes: number) => {
    let size = '';

    if (bytes < 0.1 * 1024) {
        // 小于0.1KB，则转化成B
        size = `${bytes.toFixed(2)} Bytes`;
    } else if (bytes < 0.1 * 1024 * 1024) {
        // 小于0.1MB，则转化成KB
        size = `${(bytes / 1024).toFixed(2)} Kb`;
    } else if (bytes < 0.1 * 1024 * 1024 * 1024) {
        // 小于0.1GB，则转化成MB
        size = `${(bytes / (1024 * 1024)).toFixed(2)} Mb`;
    } else {
        // 其他转化成GB
        size = `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Gb`;
    }

    return size;
};

```

## 时间戳 -> 天时分秒

```ts
export const transformStampToText = (timeStamp: number) => {
    if (timeStamp === undefined || timeStamp === null) {
        return;
    }

    const days = Math.floor(timeStamp / 86400);
    const hours = Math.floor((timeStamp % 86400) / 3600);
    const minutes = Math.floor(((timeStamp % 86400) % 3600) / 60);
    const seconds = ((timeStamp % 86400) % 3600) % 60;

    return `${days ? `${days}天` : ''}${hours ? `${hours}时` : ''}${minutes ? `${minutes}分` : ''}${seconds}秒`;
};

```

## 解析前端路由 query参数

:::code-group
```ts [browser路由]
export const getBrowserUrlParams: (url?: string) => Record<string, any> | undefined = (url?: string) => {
    const targetUrl = url ?? location.href;

    try {
        const queryData = new URL(targetUrl).searchParams;
        const formatQueryData: Record<string, any> = {};

        queryData.forEach((value, key) => {
            formatQueryData[key] = value;
        });

        return formatQueryData;
    } catch (e) {
        return {};
    }
};



```
```ts [hash路由]
export const getHashUrlParams: (url?: string) => Record<string, any> | undefined = (url?: string) => {
    const targetUrl = url || location.href;
    const searchStartIndex = targetUrl.lastIndexOf('?');
    if (searchStartIndex === -1) {
        return {};
    } else {
        return qs.parse(targetUrl.slice(searchStartIndex + 1));
    }

};

```
:::

## 网路请求axios封装

```ts
import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { notification } from 'antd';

const CancelToken = Axios.CancelToken;

export const notifyError = async (code: string | number, message: string, onClose?: () => void) => {
    let type, textPrefix;
    switch (true) {
        case String(code) === '401':
            // type = 'info';
            // textPrefix = '系统提示';
            // break;
            onClose();
            return;
        default:
            type = 'error';
            textPrefix = '请求失败';
    }
    notification[type]({
        key: Date.now(),
        message: `${textPrefix} ${code || 'Error'}`,
        description: message,
        placement: 'topLeft',
        duration: 3,
        onClose: onClose
    });
};

type CustomConfig = {
    isControl?: boolean; //为true则在服务端成功返回响应数据时，不进行code报错判断提示，由开发自行控制
};

export type HttpMethod = (
    url: string,
    params?: any,
    config?: AxiosRequestConfig & CustomConfig
) => Promise<any>;

const instance: AxiosInstance = Axios.create({
    timeout: 10000
});

/**
 * 拦截器
 */
instance.interceptors.request.use(
    (config) => {
        if (config.method === 'post' && !config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
        config.headers.authorization = `Bearer ${localStorage.getItem(tokenKey)}`;

        return config;
    },
    (err: AxiosError) => {
        return Promise.reject(err);
    }
);
let isNotifying = false; // 控制同时只能显示一个401登录失效的提醒
instance.interceptors.response.use(
    (res: AxiosResponse) => {
        return res;
    },
    (err: AxiosError) => {
        console.log('err', err);

        if (!navigator.onLine || err.code === 'ERR_NETWORK') {
            return Promise.reject(new AxiosError('网络请求失败，请检查后重试', '-1'));
        }
        if (err.code === 'ECONNABORTED') {
            return Promise.reject(new AxiosError('网络请求超时，请稍后重试', '-1'));
        }

        switch (err?.response?.status) {
            case 401:
                if (isNotifying) {
                    return;
                }

                isNotifying = true;
                //登录状态失效
                return Promise.reject(new AxiosError('登录状态已失效，请重新登录', '401'));
            case 403:
                //登录失败（例如非管理员）
                return Promise.reject(
                    new AxiosError('您当前无权限访问此资源，请联系管理员', '403')
                );
            case 404:
                return Promise.reject(new AxiosError('抱歉，您访问的接口地址貌似不存在', '404'));
            case 500:
                return Promise.reject(new AxiosError('抱歉，当前服务器异常，请稍后再试', '500'));
        }
        return Promise.reject(new AxiosError(err.message, err.response?.status.toString()));
    }
);

/**
 * 处理response数据
 * @param res
 * @param resolve
 * @param reject
 * @param config
 */
const handleRes = async (
    res: AxiosResponse,
    resolve: (data: any) => void,
    reject: (reason: any) => void,
    config?: Parameters<HttpMethod>[2]
) => {
    if (res?.status === 200) {
        let { code, msg, data } = res?.data || {};

        switch (code) {
            case 0:
                return config?.isControl ? resolve(res?.data) : resolve(data);
            default:
                if (config?.isControl) {
                    return resolve(res.data);
                }
                if (code === 401) {
                    isNotifying = true;
                    notifyError(code, msg, () => {
                        isNotifying = false;
                    });
                    return;
                }

                notifyError(code, msg);

                reject(msg);
        }
    } else {
        const { statusText = '数据请求失败' } = res || {};
        if (!config?.isControl && !isNotifying) {
            notifyError(res?.status, statusText);
        }
        reject(statusText);
    }
};

export let cancelReqFun = (msg: string) => {
    //取消当前正在执行的请求
    //
};

const createHttpMethod = (method: 'get' | 'post' | 'put' | 'delete', ...rest) => {
    const [url, data, config] = rest;
    return new Promise((resolve, reject) => {
        instance({
            method,
            url: 'http://www.apiTest.com' + url,
            params: method === 'get' ? data : {},
            data: method === 'get' ? {} : data,
            cancelToken: new CancelToken(function (cancel) {
                cancelReqFun = cancel;
            }),
            ...config
        })
            .then((res: AxiosResponse) => {
                handleRes(res, resolve, reject, config);
            })
            .catch((err: { code: string | number; message: string }) => {
                const { code, message } = err;

                notifyError(code, message, () => {
                    isNotifying = false;
                });
                reject(message);
            });
    });
};

const httpMethods: Record<Parameters<typeof createHttpMethod>[0], HttpMethod> = (
    ['get', 'post', 'put', 'delete'] as const
).reduce(
    (pre, cur, array) => {
        pre[cur] = (...params: any[]) => createHttpMethod(cur, ...params);
        return pre;
    },
    {
        get: undefined,
        post: undefined,
        delete: undefined,
        put: undefined
    }
);
export default httpMethods;

```

## jwt的生成和解析

:::code-group

```java [java工具类]
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

/**
 * JWT 工具类
 * 采用静态工厂模式设计，私有化构造器防止实例化和继承
 */
public final class JwtUtils {

    // 生产环境建议从配置文件或环境变量中读取复杂密钥，严禁硬编码弱密码
    private static final String SECRET_KEY = "MySuperSecureSecretKeyForJWTSigning2024"; 
    
    // 默认过期时间：30分钟（毫秒）
    private static final long EXPIRATION_MS = 30 * 60 * 1000L; 

    /**
     * 私有化构造器，防止外部实例化和子类继承
     */
    private JwtUtils() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * 获取签名密钥对象
     * 使用 HS256 算法时，密钥长度必须 >= 256位 (32字节)，否则会抛出 WeakKeyException
     */
    private static SecretKey getSignKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 生成 JWT Token
     * @param subject 主题（通常是用户ID或用户名）
     * @param claims 自定义载荷数据（如角色、权限等）
     * @return JWT 字符串
     */
    public static String generateToken(String subject, Map<String, Object> claims) {
        Date now = new Date();
        Date expireDate = new Date(now.getTime() + EXPIRATION_MS);

        JwtBuilder builder = Jwts.builder()
                .setSubject(subject)                    // 设置主题
                .setIssuedAt(now)                       // 签发时间
                .setExpiration(expireDate)              // 过期时间
                .setId(java.util.UUID.randomUUID().toString()) // 唯一标识(JTI)，防重放攻击
                .signWith(getSignKey(), SignatureAlgorithm.HS256); // HS256 算法签名

        // 合并自定义声明
        if (claims != null && !claims.isEmpty()) {
            builder.setClaims(claims);
        }

        return builder.compact(); // 触发编码与签名，输出最终Token字符串
    }

    /**
     * 解析并验证 JWT Token
     * @param token JWT 字符串
     * @return Claims 载荷对象
     */
    public static Claims parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignKey()) // 必须使用相同的密钥进行验签
                    .build()
                    .parseClaimsJws(token)       // 解析并验证签名和有效期
                    .getBody();                  // 获取 Payload
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT Token 已过期", e);
        } catch (SignatureException | MalformedJwtException e) {
            throw new RuntimeException("无效的 JWT Token", e);
        }
    }

    /**
     * 仅判断 Token 是否有效（常用于拦截器/过滤器）
     * @param token JWT 字符串
     * @return true-有效，false-无效
     */
    public static boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 从 Token 中提取特定字段
     * @param token JWT 字符串
     * @return 主题信息
     */
    public static String getUsernameFromToken(String token) {
        return parseToken(token).getSubject();
    }
}
```
```xml [添加依赖]
<!--pom.xml-->
<!-- JWT API -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<!-- JWT 运行时实现 -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<!-- JSON 序列化支持 -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```
