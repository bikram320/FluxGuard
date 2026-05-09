package org.example.fluxguard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.InetAddress;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Geo-blocking using the free ip-api.com service (no API key needed, 45 req/min).
 * Results are cached in Redis for 24 hours to avoid hammering the lookup API.
 *
 * Blocked countries are configured per deployment in application.properties:
 *   security.geo-block.blocked-countries=CN,RU,KP,IR
 *
 * Set to empty to disable geo-blocking entirely.
 */
@RequiredArgsConstructor
@Service
public class GeoBlockService {

    private final RedisTemplate<String, String> redisTemplate;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("#{'${security.geo-block.blocked-countries:}'.split(',')}")
    private List<String> blockedCountries;

    private static final String CACHE_PREFIX = "geo:";
    private static final Duration CACHE_TTL   = Duration.ofHours(24);

    public boolean isBlocked(InetAddress ip, String apiKey) {
        if (blockedCountries == null || blockedCountries.isEmpty()
                || (blockedCountries.size() == 1 && blockedCountries.get(0).isBlank())) {
            return false;
        }

        String ipStr     = ip.getHostAddress();
        String cacheKey  = CACHE_PREFIX + ipStr;

        // Check cache first
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return blockedCountries.contains(cached);
        }

        // Skip private / loopback IPs (local dev)
        if (ip.isLoopbackAddress() || ip.isSiteLocalAddress()) {
            return false;
        }

        try {
            String url = "http://ip-api.com/json/" + ipStr + "?fields=countryCode,status";
            @SuppressWarnings("unchecked")
            Map<String, String> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !"success".equals(response.get("status"))) {
                return false; // fail open
            }

            String countryCode = response.getOrDefault("countryCode", "");

            // Cache result
            redisTemplate.opsForValue().set(cacheKey, countryCode, CACHE_TTL);

            return blockedCountries.contains(countryCode);

        } catch (Exception e) {
            return false; // fail open — never block on lookup error
        }
    }
}