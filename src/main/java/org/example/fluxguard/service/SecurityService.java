package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
import org.example.fluxguard.Exceptions.DataNotFoundException;
import org.example.fluxguard.Exceptions.IPBlockedException;
import org.example.fluxguard.dtos.SecurityRequestDto;
import org.example.fluxguard.dtos.SecurityResponseDto;
import org.example.fluxguard.model.ApiKey;
import org.example.fluxguard.model.RequestLogs;
import org.example.fluxguard.repository.ApiKeyRepository;
import org.example.fluxguard.repository.BlocksRepository;
import org.example.fluxguard.repository.RequestLogsRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.net.InetAddress;

@AllArgsConstructor
@Service
public class SecurityService {
    private final ApiKeyRepository apiKeyRepository;
    private final BlocksRepository blocksRepository;
    private final RequestLogsRepository requestLogsRepository;
    private final ApiKeyValidationService apiKeyValidationService;
    private final BlockIPService blockIPService;
    private final RequestLoggingService requestLoggingService;
    private final RateLimitService rateLimitService;

    public SecurityResponseDto performSecurityCheck(SecurityRequestDto securityRequestDto) {

        //validating API Key
        String apikey = securityRequestDto.getApiKey();
        if(!apiKeyValidationService.isValidApiKey(apikey)){
            throw new DataNotFoundException("Invalid API Key");
        }

        //validating IP Address
        InetAddress ipAddress = securityRequestDto.getIpAddress();
        if(blockIPService.isIpBlocked(ipAddress)){
            throw new IPBlockedException("IP Address is blocked: " + ipAddress.toString());
        }
        //logging the request in DB
        requestLoggingService.LogRequest(securityRequestDto);

        //check the rate limits
        if(rateLimitService.isRateLimited(apikey, ipAddress)){
            return new SecurityResponseDto(false,"Rate limit exceeded");
        }

        return new SecurityResponseDto(true,"Request allowed");
    }
}
