// ── RequestLogDto.java ──────────────────────────────────────────────────────
package org.example.fluxguard.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RequestLogDto {
    private Long id;
    private String ip;
    private String endpoint;
    private String method;
    private LocalDateTime createdAt;
}