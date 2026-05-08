package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
import org.example.fluxguard.Exceptions.DataNotFoundException;
import org.example.fluxguard.Exceptions.IPBlockedException;
import org.example.fluxguard.dtos.SecurityRequestDto;
import org.example.fluxguard.dtos.SecurityResponseDto;
import org.springframework.stereotype.Service;

import java.net.InetAddress;

@AllArgsConstructor
@Service
public class SecurityService {

    private final ApiKeyValidationService apiKeyValidationService;
    private final BlockIPService blockIPService;
    private final RateLimitService rateLimitService;
    private final RequestLoggingService requestLoggingService;
    private final SuspiciousBehaviorService suspiciousBehaviorService;

    /**
     * PerformSecurityCheck is the main method that orchestrates all security checks
     * for incoming API requests.
     * It validates the API key, checks for IP blocks, enforces rate limits,
     * detects suspicious behavior, and logs valid requests.
     *
     * @param dto SecurityRequestDto containing details of the incoming request
     *            such as API key, IP address, endpoint, HTTP method, timestamp, and response status.
     * @return SecurityResponseDto indicating whether the request is allowed or blocked, along with a message.
     */

    public SecurityResponseDto performSecurityCheck(SecurityRequestDto dto) {

        String apiKey = dto.getApiKey();
        InetAddress ip = dto.getIpAddress();
        String endpoint = dto.getEndpoint();
        Integer status = dto.getResponseStatus();

        // 1 — Validate API key
        if (!apiKeyValidationService.isValidApiKey(apiKey)) {
            throw new DataNotFoundException("Invalid API key");
        }

        // 2 — Check if IP is already blocked
        if (blockIPService.isIpBlockedForApiKey(ip, apiKey)) {
            throw new IPBlockedException("IP address is blocked: " + ip.getHostAddress());
        }

        // 3 — Rate limit check → auto-block if exceeded
        if (rateLimitService.isRateLimited(apiKey, ip)) {
            blockIPService.blockIp(ip, apiKey, "Auto-blocked: rate limit exceeded");
            return new SecurityResponseDto(false, "Rate limit exceeded. IP temporarily blocked.");
        }

        // 4 — Endpoint hammering check → auto-block if exceeded
        if (suspiciousBehaviorService.recordAndCheckEndpointAbuse(apiKey, ip, endpoint)) {
            blockIPService.blockIp(ip, apiKey, "Auto-blocked: endpoint hammering on " + endpoint);
            return new SecurityResponseDto(false, "Suspicious endpoint abuse detected. IP temporarily blocked.");
        }

        // 5 — Error rate check (only when a 4xx status is reported)
        if (status != null && status >= 400 && status < 500) {
            if (suspiciousBehaviorService.recordAndCheckErrorRate(apiKey, ip)) {
                blockIPService.blockIp(ip, apiKey, "Auto-blocked: excessive error rate (" + status + ")");
                return new SecurityResponseDto(false, "Excessive error rate detected. IP temporarily blocked.");
            }
        }

        // 6 — Log the request (only valid passing requests are logged)
        requestLoggingService.LogRequest(dto);

        // 7 — Allow
        return new SecurityResponseDto(true, "Request allowed");
    }
}