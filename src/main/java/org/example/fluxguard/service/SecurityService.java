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

    /**
     * Correct order of operations:
     * 1. Validate an API key → fail fast, no logging for invalid keys
     * 2. Check if IP is blocked → fail fast, no logging for already-blocked IPs
     * 3. Check rate limit → if exceeded, auto-block then return 403
     * 4. Log the request → only log requests we're actually processing
     * 5. Allow

     * Previously the log happened before the rate limit check, meaning every request
     * from a rate-limited IP still polluted the request_logs table.
     */
    public SecurityResponseDto performSecurityCheck(SecurityRequestDto securityRequestDto) {

        String apiKey = securityRequestDto.getApiKey();
        InetAddress ip = securityRequestDto.getIpAddress();

        // Step 1 — Validate API key
        if (!apiKeyValidationService.isValidApiKey(apiKey)) {
            throw new DataNotFoundException("Invalid API Key");
        }

        // Step 2 — Check if IP is already blocked
        if (blockIPService.isIpBlockedForApiKey(ip, apiKey)) {
            throw new IPBlockedException("IP address is blocked: " + ip.getHostAddress());
        }

        // Step 3 — Check rate limit; if exceeded, auto-block the IP
        if (rateLimitService.isRateLimited(apiKey, ip)) {
            String reason = "Auto-blocked: rate limit exceeded";
            blockIPService.blockIp(ip, apiKey, reason);
            return new SecurityResponseDto(false, "Rate limit exceeded. Your IP has been temporarily blocked.");
        }

        // Step 4 — Log the valid, allowed request
        requestLoggingService.LogRequest(securityRequestDto);

        // Step 5 — Allow
        return new SecurityResponseDto(true, "Request allowed");
    }
}