package org.example.fluxguard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.net.InetAddress;
import java.time.Duration;

@RequiredArgsConstructor
@Service
public class SuspiciousBehaviorService {

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${security.suspicious.max-errors-per-window:20}")
    private Long maxErrorsPerWindow;

    @Value("${security.suspicious.max-endpoint-hits:50}")
    private Long maxEndpointHits;

    /**
     * Call this when responseStatus is 4xx.
     * Tracks how many client errors an IP produces in a 5-minute window.
     * Returns true if threshold exceeded → auto-block.
     */
    public boolean recordAndCheckErrorRate(String apiKey, InetAddress ip) {
        String key = "errors:" + apiKey + ":" + ip.getHostAddress();
        Long count = redisTemplate.opsForValue().increment(key);
        if (count != null && count == 1) {
            redisTemplate.expire(key, Duration.ofMinutes(5));
        }
        return count != null && count > maxErrorsPerWindow;
    }

    /**
     * Call this on every request to track per-endpoint frequency.
     * Normalizes path variables so /users/123 and /users/456 count as the same pattern.
     * Returns true if a single endpoint is hammered beyond threshold → auto-block.
     */
    public boolean recordAndCheckEndpointAbuse(String apiKey, InetAddress ip, String endpoint) {
        String normalized = normalizeEndpoint(endpoint);
        String key = "endpoint:" + apiKey + ":" + ip.getHostAddress() + ":" + normalized;
        Long count = redisTemplate.opsForValue().increment(key);
        if (count != null && count == 1) {
            redisTemplate.expire(key, Duration.ofMinutes(1));
        }
        return count != null && count > maxEndpointHits;
    }

    // /users/123/posts/5 → /users/{id}/posts/{id}
    private String normalizeEndpoint(String endpoint) {
        if (endpoint == null) return "/";
        return endpoint.replaceAll("/\\d+", "/{id}");
    }
}