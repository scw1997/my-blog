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