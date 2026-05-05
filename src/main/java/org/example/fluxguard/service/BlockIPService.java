package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
import org.example.fluxguard.model.ApiKey;
import org.example.fluxguard.model.Blocks;
import org.example.fluxguard.repository.ApiKeyRepository;
import org.example.fluxguard.repository.BlocksRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.InetAddress;
import java.time.Instant;

@AllArgsConstructor
@Service
public class BlockIPService {

    private final BlocksRepository blocksRepository;
    private final ApiKeyRepository apiKeyRepository;

    /**
     * Checks whether a given IP is currently blocked for ANY api key.
     * An active block means: expiresAt is null (permanent) OR expiresAt is in the future.
     */
    public boolean isIpBlocked(InetAddress ip) {
        return blocksRepository.existsByIpAndExpiresAtIsNullOrIpAndExpiresAtAfter(
                ip, ip, Instant.now()
        );
    }

    /**
     * Checks whether a given IP is blocked specifically under a given API key.
     * Useful for per-application block scoping.
     */
    public boolean isIpBlockedForApiKey(InetAddress ip, String fgKey) {
        ApiKey apiKey = apiKeyRepository.findByFgKey(fgKey);
        if (apiKey == null) return false;

        return blocksRepository.existsByApiKeyAndIpAndExpiresAtIsNullOrApiKeyAndIpAndExpiresAtAfter(
                apiKey, ip, apiKey, ip, Instant.now()
        );
    }

    /**
     * Auto-blocks an IP when the rate limiter determines abuse.
     * Block duration: 1 hour by default (you can make this configurable via @Value).
     *
     * @param ip      the offending IP
     * @param fgKey   the API key under which the abuse occurred
     * @param reason  human-readable reason, e.g. "Rate limit exceeded: 120 req/min"
     */
    @Transactional
    public void blockIp(InetAddress ip, String fgKey, String reason) {
        // Don't insert a duplicate block if one already exists
        if (isIpBlockedForApiKey(ip, fgKey)) return;

        ApiKey apiKey = apiKeyRepository.findByFgKey(fgKey);
        if (apiKey == null) return;

        Blocks block = new Blocks();
        block.setIp(ip);
        block.setApiKey(apiKey);
        block.setReason(reason);
        block.setCreatedAt(Instant.now());
        block.setExpiresAt(Instant.now().plusSeconds(3600)); // 1-hour auto-block

        blocksRepository.save(block);
    }

    /**
     * Manually unblocks an IP (called from the dashboard).
     * Deletes all block records for this IP, regardless of API key.
     */
    @Transactional
    public void unblockIp(InetAddress ip) {
        blocksRepository.deleteAllByIp(ip);
    }

    /**
     * Manually unblocks an IP for a specific API key only.
     */
    @Transactional
    public void unblockIpForApiKey(InetAddress ip, String fgKey) {
        ApiKey apiKey = apiKeyRepository.findByFgKey(fgKey);
        if (apiKey == null) return;
        blocksRepository.deleteAllByApiKeyAndIp(apiKey, ip);
    }
}