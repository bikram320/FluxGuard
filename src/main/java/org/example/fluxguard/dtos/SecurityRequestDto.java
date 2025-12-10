package org.example.fluxguard.dtos;

import lombok.Data;

import java.net.InetAddress;
import java.time.LocalDateTime;

@Data
public class SecurityRequestDto {
    private String apiKey;
    private InetAddress ipAddress;
    private String endpoint;
    private String method;
    private LocalDateTime createdAt;
}
