package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
import org.example.fluxguard.Exceptions.DataNotFoundException;
import org.example.fluxguard.repository.ApiKeyRepository;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ApiKeyValidationService {

    private final ApiKeyRepository apiKeyRepository;

    public boolean isValidApiKey(String apiKey) {
        // checking if apikey is valid or not
        if(apiKey == null || apiKey.isEmpty()){
            throw new DataNotFoundException("Api key not found");
        }
        if(!apiKeyRepository.existsByFgKey(apiKey)){
            throw new DataNotFoundException("Invalid Api key");
        }
        return true;
    }
}
