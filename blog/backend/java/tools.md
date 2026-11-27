# 常用工具类


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
    private static final String SECRET_KEY = Encoders.BASE64.encode(Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded());
    
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
:::

## 跨域解决

```java
package com.scw.scrowlifebackend.bean;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

// 跨域过滤器设置
// 自动生效
@Configuration
public class CorsFilterConfig {

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of( "http://localhost:*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        // 🔑 设置最高优先级，确保在 JWT/Security 过滤器之前执行
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}

```

## 接口统一拦截校验

:::code-group
```java [实现WebMvcConfigurer接口]
package com.scw.codeyellservice.bean;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {
    //注册拦截器
    private final MyInterceptor myInterceptor;


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(myInterceptor).addPathPatterns("/**").excludePathPatterns(
                "/web/v1/auth/**","/error"
        );
    }
}

```
```java [拦截器实现类]
package com.scw.codeyellservice.bean;

import com.scw.codeyellservice.mojo.Jwt;
import com.scw.codeyellservice.mojo.Response;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import tools.jackson.databind.ObjectMapper;


@Slf4j
@Component
public class MyInterceptor implements HandlerInterceptor {
    /**
     * 在请求处理之前进行调用（Controller方法调用之前）
     * 返回值表示是否继续处理请求
     * true：继续处理请求
     * false：中断请求处理
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //对指定请求进行token校验，否则返回401状态码
        String reqUrl = request.getRequestURI();
        String token = request.getHeader("authorization");
        String formatToken = token.replace(" ", "");
        if(token == null|| token.isEmpty() || !Jwt.validateToken(formatToken)) {
            response.setStatus(HttpServletResponse.SC_OK);
            //对象转json
            response.getWriter().write(new ObjectMapper().writeValueAsString(Response.error(401, "Token is invalid or missing")));

            return false;
        }
        return  true;

    }

    /**
     * 在请求处理之后进行调用，但是在视图被渲染之前（Controller方法调用之后）
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, org.springframework.web.servlet.ModelAndView modelAndView) throws Exception {
        // TODO Auto-generated method stub
    }



    //视图渲染完毕后执行，最后执行（前后端分离项目则忽略此方法）
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // TODO Auto-generated method stub
    }





}

```

:::

## 全局异常捕获

:::code-group

```java [全局异常捕获类]
package com.scw.scrowlifebackend.bean;


import com.scw.scrowlifebackend.mojo.MyException;
import com.scw.scrowlifebackend.mojo.Response;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Optional;
import java.util.stream.Collectors;


@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // 处理 @Valid接口字段参数校验失败,通常默认情况下自动返回400
    @ExceptionHandler(MethodArgumentNotValidException.class)
    //这里覆盖设置依然返回200状态码
    @ResponseStatus(HttpStatus.OK)
    public Response handleValidation(
            MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e ->
                        e.getField() + " " +
                                e.getDefaultMessage() // 校验消息
                )
                //map后通过collect将stream转换成集合后再通过join连接成字符串
                .collect(Collectors.joining(", "));

        log.warn("参数校验失败: {}", errors);
        //设置报错时返回数据格式
        return Response.error(errors.toString());
    }

    // service层逻辑判断后自主抛出的异常
    @ExceptionHandler(MyException.class)
    public Response handleMyException(MyException e) {
        log.error("service层抛出异常", e);  // 完整日志进服务端
        return  Response.error(e.getCode(),e.getMessage());
    }


    // 兜底：未预期异常 → 500，不暴露堆栈
    @ExceptionHandler(Exception.class)
    public Response handleUnknown(Exception e) {
        log.error("未预期异常", e);  // 完整日志进服务端
        return  Response.error(500,e.getMessage());
    }



}
```
```java [@Valid校验实体类]
package com.scw.codeyellservice.mojo;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class User {
    //@NotBlank只能用在字符串类型上，校验字段值不为 null 且 trim() 后长度 > 0
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度3-20")
    private String username;

    //@NotNull用于任意类型，校验字段值不为 null
    @NotNull(message = "年龄必填")
    @Min(value = 18, message = "必须成年")
    private Integer age;

    @Email(message = "邮箱格式错误")
    private String email;

    //@NotEmpty用于字符串，集合，数组，Map,校验字段值不为 null 且长度 > 0
    @NotEmpty(message = "角色不能为空")
    private List<String> roles;
}
```
```java [service手动抛出异常实体类]
package com.scw.scrowlifebackend.mojo;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class MyException extends RuntimeException {
    private final Integer code;      // 业务码
    private final String message;
}

```
```java [controller层]

//在Controller中添加@Valid进行校验，校验失败自动返回 400（可通过定义全局异常捕获类GlobalExceptionHandler来统一响应格式）
 public Response register(@RequestBody @Valid User user ) {
    //走到这里说明@Valid校验通过
    log.info("校验通过");
}
```
```xml [所需依赖]
<!--pom.xml-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```


:::
