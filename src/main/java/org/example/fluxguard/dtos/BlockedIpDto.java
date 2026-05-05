// ── BlockedIpDto.java ───────────────────────────────────────────────────────
package org.example.fluxguard.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class BlockedIpDto {
    private Long id;
    private String ip;
    private String reason;
    private Instant blockedAt;
    private Instant expiresAt;      // null = permanent block
    private String appName;         // which app this block belongs to
}