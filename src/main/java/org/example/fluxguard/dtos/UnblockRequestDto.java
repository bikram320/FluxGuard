// ── UnblockRequestDto.java ──────────────────────────────────────────────────
package org.example.fluxguard.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UnblockRequestDto {
    @NotBlank(message = "IP address is required")
    private String ip;              // passed as string, converted in service

    private String apiKey;          // optional — if null, unblocks globally
}