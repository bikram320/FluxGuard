package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
import org.example.fluxguard.Exceptions.DataNotFoundException;
import org.example.fluxguard.Exceptions.IPBlockedException;
import org.example.fluxguard.dtos.SecurityRequestDto;
import org.example.fluxguard.dtos.SecurityResponseDto;
import org.springframework.stereotype.Service;

import java.net.InetAddress;
import java.util.Set;

@AllArgsConstructor
@Service
public class SecurityService {

    private final ApiKeyValidationService    apiKeyValidationService;
    private final BlockIPService             blockIPService;
    private final RequestLoggingService      requestLoggingService;
    private final RateLimitService           rateLimitService;
    private final SuspiciousBehaviorService  suspiciousBehaviorService;
    private final UserAgentInspectionService userAgentInspectionService;
    private final GeoBlockService            geoBlockService;
    private final PayloadInspectionService   payloadInspectionService;

    private static final Set<String> SENSITIVE_ENDPOINTS = Set.of(
            "/auth/login", "/auth/register", "/auth/forgot-password",
            "/api/admin", "/api/payment", "/api/checkout"
    );

    public SecurityResponseDto performSecurityCheck(SecurityRequestDto dto) {

        String      apiKey    = dto.getApiKey();
        InetAddress ip        = dto.getIpAddress();
        String      endpoint  = dto.getEndpoint()  != null ? dto.getEndpoint()  : "";
        String      userAgent = dto.getUserAgent()  != null ? dto.getUserAgent() : "";
        String      method    = dto.getMethod()     != null ? dto.getMethod()    : "GET";
        Integer     respStatus = dto.getResponseStatus();

        // ── 1. Validate API key ──────────────────────────────────────────────
        if (!apiKeyValidationService.isValidApiKey(apiKey)) {
            throw new DataNotFoundException("Invalid API Key");
        }

        // ── 2. IP block check ────────────────────────────────────────────────
        if (blockIPService.isIpBlocked(ip)) {
            throw new IPBlockedException("IP is blocked: " + ip);
        }

        // ── 3. User-Agent inspection ─────────────────────────────────────────
        UserAgentInspectionService.UaResult uaResult = userAgentInspectionService.inspect(userAgent);
        if (uaResult.isBlocked()) {
            // blockIp(InetAddress ip, String fgKey, String reason) — matches your BlockIPService
            blockIPService.blockIp(ip, apiKey, uaResult.getReason());
            return new SecurityResponseDto(false, uaResult.getReason());
        }

        // ── 4. Payload inspection ────────────────────────────────────────────
        if (dto.getQueryString() != null) {
            PayloadInspectionService.InspectResult inject =
                    payloadInspectionService.inspect(dto.getQueryString());
            if (inject.isMalicious()) {
                blockIPService.blockIp(ip, apiKey, "Injection attempt: " + inject.getReason());
                return new SecurityResponseDto(false, "Malicious payload detected");
            }
        }

        // ── 5. Geo-block check ───────────────────────────────────────────────
        if (geoBlockService.isBlocked(ip, apiKey)) {
            return new SecurityResponseDto(false, "Access denied from this region");
        }

        // ── 6. Sensitive endpoint — strict rate limit ────────────────────────
        boolean isSensitive = SENSITIVE_ENDPOINTS.stream().anyMatch(endpoint::startsWith);
        if (isSensitive && rateLimitService.isStrictRateLimited(apiKey, ip)) {
            blockIPService.blockIp(ip, apiKey, "Auth endpoint abuse");
            return new SecurityResponseDto(false, "Too many requests to sensitive endpoint");
        }

        // ── 7. Global rate limit ─────────────────────────────────────────────
        if (rateLimitService.isRateLimited(apiKey, ip)) {
            blockIPService.blockIp(ip, apiKey, "Rate limit exceeded");
            return new SecurityResponseDto(false, "Rate limit exceeded");
        }

        // ── 8. Suspicious behavior ───────────────────────────────────────────
        // Error rate check — pass 4xx response codes
        if (respStatus != null && respStatus >= 400 && respStatus < 500) {
            if (suspiciousBehaviorService.recordAndCheckErrorRate(apiKey, ip)) {
                blockIPService.blockIp(ip, apiKey, "High error rate — possible scanning");
                return new SecurityResponseDto(false, "Suspicious error rate detected");
            }
        }

        // Endpoint hammering check — every request
        if (suspiciousBehaviorService.recordAndCheckEndpointAbuse(apiKey, ip, endpoint)) {
            blockIPService.blockIp(ip, apiKey, "Endpoint hammering: " + endpoint);
            return new SecurityResponseDto(false, "Endpoint abuse detected");
        }

        // ── 9. Log the request ───────────────────────────────────────────────
        requestLoggingService.LogRequest(dto);

        return new SecurityResponseDto(true, "Request allowed");
    }
}