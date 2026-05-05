// ── AppSummaryDto.java ──────────────────────────────────────────────────────
package org.example.fluxguard.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AppSummaryDto {
    private Long id;
    private String appName;
    private String description;
    private String apiKey;          // the FG-xxx key for this app
    private LocalDateTime createdAt;
}
