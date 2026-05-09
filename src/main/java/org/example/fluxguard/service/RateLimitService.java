package org.example.fluxguard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.net.InetAddress;
import java.time.Duration;

@RequiredArgsConstructor
@Service
public class RateLimitService {

    private final RedisTemplate<String, String> redisTemplate;

    // General limit — set to 60 in application.properties
    @Value("${security.rate-limit.limit-per-minute:60}")
    private Long limitPerMinute;

    // Strict limit for auth/sensitive endpoints — set to 10
    @Value("${security.rate-limit.strict-limit-per-minute:10}")
    private Long strictLimitPerMinute;

    public boolean isRateLimited(String apiKey, InetAddress ip) {
        return check("rate", apiKey, ip, 60, limitPerMinute);
    }

    public boolean isStrictRateLimited(String apiKey, InetAddress ip) {
        return check("rate:strict", apiKey, ip, 60, strictLimitPerMinute);
    }

    private boolean check(String prefix, String apiKey, InetAddress ip,
                          int ttlSeconds, long limit) {
        String key   = prefix + ":" + apiKey + ":" + ip.getHostAddress();
        Long   count = redisTemplate.opsForValue().increment(key);
        if (count != null && count == 1) {
            redisTemplate.expire(key, Duration.ofSeconds(ttlSeconds));
        }
        return count != null && count > limit;
    }
}