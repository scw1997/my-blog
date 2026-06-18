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
