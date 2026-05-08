package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
import org.example.fluxguard.Exceptions.DataNotFoundException;
import org.example.fluxguard.Exceptions.UserNotFoundException;
import org.example.fluxguard.dtos.AppSummaryDto;
import org.example.fluxguard.dtos.BlockedIpDto;
import org.example.fluxguard.dtos.RequestLogDto;
import org.example.fluxguard.model.ApiKey;
import org.example.fluxguard.model.Application;
import org.example.fluxguard.model.Blocks;
import org.example.fluxguard.model.RequestLogs;
import org.example.fluxguard.model.User;
import org.example.fluxguard.repository.ApiKeyRepository;
import org.example.fluxguard.repository.ApplicationRepository;
import org.example.fluxguard.repository.BlocksRepository;
import org.example.fluxguard.repository.RequestLogsRepository;
import org.example.fluxguard.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Instant;
import java.util.List;

@AllArgsConstructor
@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final ApiKeyRepository apiKeyRepository;
    private final BlocksRepository blocksRepository;
    private final RequestLogsRepository requestLogsRepository;
    private final BlockIPService blockIPService;

    // ── Applications ────────────────────────────────────────────────────────

    /**
     * Lists all applications owned by the authenticated user,
     * each paired with its generated API key.
     */
    public List<AppSummaryDto> getMyApplications(String userEmail) throws UserNotFoundException {
        User user = resolveUser(userEmail);
        List<Application> apps = applicationRepository.findAllByUser(user);

        return apps.stream().map(app -> {
            // Each application has exactly one API key
            ApiKey key = apiKeyRepository.findByApplication(app);
            return new AppSummaryDto(
                    app.getId(),
                    app.getAppName(),
                    app.getDescription(),
                    key != null ? key.getFgKey() : "N/A",
                    app.getCreatedAt()
            );
        }).toList();
    }

    // ── Request Logs ────────────────────────────────────────────────────────

    /**
     * Returns paginated request logs for a specific application, newest first.
     * Only returns logs belonging to the authenticated user (ownership check).
     *
     * @param appId  the application ID to fetch logs for
     * @param page   zero-based page number
     * @param size   page size (max 100 enforced below)
     */
    public Page<RequestLogDto> getLogsForApp(String userEmail, Long appId, int page, int size) throws UserNotFoundException {
        User user = resolveUser(userEmail);
        Application app = applicationRepository.findByIdAndUser(appId, user)
                .orElseThrow(() -> new DataNotFoundException("Application not found or access denied"));

        ApiKey apiKey = apiKeyRepository.findByApplication(app);
        if (apiKey == null) {
            throw new DataNotFoundException("No API key found for this application");
        }

        int safeSize = Math.min(size, 100); // cap at 100 per page
        PageRequest pageRequest = PageRequest.of(page, safeSize, Sort.by("createdAt").descending());

        return requestLogsRepository
                .findAllByApiKey(apiKey, pageRequest)
                .map(log -> new RequestLogDto(
                        log.getId(),
                        log.getIp().getHostAddress(),
                        log.getEndpoint(),
                        log.getMethod(),
                        log.getCreatedAt()
                ));
    }

    // ── Blocked IPs ─────────────────────────────────────────────────────────

    /**
     * Returns all currently active blocks across all applications owned by this user.
     * "Active" means: expiresAt is null OR expiresAt is in the future.
     */
    public List<BlockedIpDto> getActiveBlocks(String userEmail) throws UserNotFoundException {
        User user = resolveUser(userEmail);
        List<Application> apps = applicationRepository.findAllByUser(user);
        List<ApiKey> apiKeys = apps.stream()
                .map(apiKeyRepository::findByApplication)
                .filter(k -> k != null)
                .toList();

        return blocksRepository
                .findAllByApiKeyInAndExpiresAtIsNullOrApiKeyInAndExpiresAtAfter(
                        apiKeys, apiKeys, Instant.now()
                )
                .stream()
                .map(block -> new BlockedIpDto(
                        block.getId(),
                        block.getIp().getHostAddress(),
                        block.getReason(),
                        block.getCreatedAt(),
                        block.getExpiresAt(),
                        block.getApiKey().getApplication().getAppName()
                ))
                .toList();
    }

    /**
     * Unblocks an IP. If apiKey is provided, only removes the block for that specific
     * application. If null, removes all blocks for this IP across all of the user's apps.
     */
    @Transactional
    public String unblockIp(String userEmail, String rawIp, String fgKey) throws UserNotFoundException {
        resolveUser(userEmail); // ensure user exists

        InetAddress ip;
        try {
            ip = InetAddress.getByName(rawIp);
        } catch (UnknownHostException e) {
            throw new IllegalArgumentException("Invalid IP address: " + rawIp);
        }

        if (fgKey != null && !fgKey.isBlank()) {
            blockIPService.unblockIpForApiKey(ip, fgKey);
            return "IP " + rawIp + " unblocked for the specified application";
        } else {
            blockIPService.unblockIp(ip);
            return "IP " + rawIp + " unblocked across all your applications";
        }
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private User resolveUser(String email) throws UserNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) throw new UserNotFoundException("User not found: " + email);
        return user;
    }
}