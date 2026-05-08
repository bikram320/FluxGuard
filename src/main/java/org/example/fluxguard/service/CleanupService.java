package org.example.fluxguard.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.fluxguard.repository.BlocksRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@RequiredArgsConstructor
@Service
public class CleanupService {

    private final BlocksRepository blocksRepository;

    /**
     * Runs every 10 minutes.
     * Deletes all blocks where expiresAt is in the past.
     * Without this, auto-blocks pile up in the DB forever.
     */
    @Transactional
    @Scheduled(fixedRate = 600_000)
    public void purgeExpiredBlocks() {
        blocksRepository.deleteExpiredBlocks(Instant.now());
        log.info("Expired blocks purged at {}", Instant.now());
    }
}