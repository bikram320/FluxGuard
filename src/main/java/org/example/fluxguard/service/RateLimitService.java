package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
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

    @Value("${security.rate-limit.limit-per-minute}")
    private Long limitPerMinute;

    public boolean isRateLimited(String apiKey, InetAddress ip) {
        String key = "rate:" + apiKey + ":" + ip;

        // increment the counter
        Long count = redisTemplate.opsForValue().increment(key);

        // if key is new → assign TTL (60 seconds)
        if (count != null && count == 1) {
            redisTemplate.expire(key, Duration.ofSeconds(60));
        }

        // if count exceeds allowed limit
        return count != null && count > limitPerMinute;
    }

}
