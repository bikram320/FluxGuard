package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
import org.example.fluxguard.dtos.SecurityRequestDto;
import org.example.fluxguard.model.ApiKey;
import org.example.fluxguard.model.RequestLogs;
import org.example.fluxguard.repository.ApiKeyRepository;
import org.example.fluxguard.repository.RequestLogsRepository;
import org.springframework.stereotype.Service;

import java.net.InetAddress;

@AllArgsConstructor
@Service
public class RequestLoggingService {

    private final ApiKeyRepository apiKeyRepository;
    private final RequestLogsRepository requestLogsRepository;

    public void LogRequest(SecurityRequestDto securityRequestDto) {

        InetAddress ipAddress = securityRequestDto.getIpAddress();
        ApiKey apiKey = apiKeyRepository.findByFgKey(securityRequestDto.getApiKey());

        RequestLogs logs = new RequestLogs();
        logs.setApiKey(apiKey);
        logs.setIp(ipAddress);
        logs.setEndpoint(securityRequestDto.getEndpoint());
        logs.setMethod(securityRequestDto.getMethod());
        logs.setCreatedAt(securityRequestDto.getCreatedAt());

        requestLogsRepository.save(logs);


    }
}
