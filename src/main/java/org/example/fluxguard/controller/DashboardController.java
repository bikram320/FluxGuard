package org.example.fluxguard.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.fluxguard.Exceptions.UserNotFoundException;
import org.example.fluxguard.dtos.AppSummaryDto;
import org.example.fluxguard.dtos.BlockedIpDto;
import org.example.fluxguard.dtos.RequestLogDto;
import org.example.fluxguard.dtos.UnblockRequestDto;
import org.example.fluxguard.service.DashboardService;
import org.example.fluxguard.utils.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * All routes here are protected — the JwtAuthenticationFilter runs before
 * every request, so by the time we reach these methods the user is authenticated.
 * We extract the email from the JWT to scope all data to the current user.
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final JwtUtil jwtUtil;

    // ── Applications ────────────────────────────────────────────────────────

    /**
     * GET /api/dashboard/apps
     * Returns all applications belonging to the authenticated user,
     * including each app's generated API key.
     */
    @GetMapping("/apps")
    public ResponseEntity<List<AppSummaryDto>> getMyApps(HttpServletRequest request) throws UserNotFoundException {
        String email = extractEmail(request);
        return ResponseEntity.ok(dashboardService.getMyApplications(email));
    }

    // ── Request Logs ────────────────────────────────────────────────────────

    /**
     * GET /api/dashboard/apps/{appId}/logs?page=0&size=20
     * Returns paginated request logs for a specific application.
     * Ownership is verified inside the service — users can only see their own logs.
     */
    @GetMapping("/apps/{appId}/logs")
    public ResponseEntity<Page<RequestLogDto>> getLogs(
            HttpServletRequest request,
            @PathVariable Long appId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) throws UserNotFoundException {

        String email = extractEmail(request);
        return ResponseEntity.ok(dashboardService.getLogsForApp(email, appId, page, size));
    }

    // ── Blocked IPs ─────────────────────────────────────────────────────────

    /**
     * GET /api/dashboard/blocks
     * Returns all active IP blocks across all of the user's applications.
     */
    @GetMapping("/blocks")
    public ResponseEntity<List<BlockedIpDto>> getBlocks(HttpServletRequest request) throws UserNotFoundException {
        String email = extractEmail(request);
        return ResponseEntity.ok(dashboardService.getActiveBlocks(email));
    }

    /**
     * POST /api/dashboard/blocks/unblock
     * Body: { "ip": "1.2.3.4", "apiKey": "FG-xxx" }
     * apiKey is optional — omit it to unblock across all apps.
     */
    @PostMapping("/blocks/unblock")
    public ResponseEntity<String> unblock(
            HttpServletRequest request,
            @Valid @RequestBody UnblockRequestDto dto) throws UserNotFoundException {

        String email = extractEmail(request);
        String message = dashboardService.unblockIp(email, dto.getIp(), dto.getApiKey());
        return ResponseEntity.ok(message);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private String extractEmail(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7); // strip "Bearer "
        return jwtUtil.extractUsername(token);
    }
}