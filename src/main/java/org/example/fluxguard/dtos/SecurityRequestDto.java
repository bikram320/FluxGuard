package org.example.fluxguard.dtos;

import lombok.Data;

import java.net.InetAddress;
import java.time.LocalDateTime;

@Data
public class SecurityRequestDto {
    private String      apiKey;
    private InetAddress ipAddress;
    private String      endpoint;
    private String      method;
    private LocalDateTime createdAt;
    private Integer     responseStatus;
    // New fields for expanded security checks
    private String      userAgent;    // for bot/scanner detection
    private String      queryString;  // for SQLi / XSS / injection detection
}