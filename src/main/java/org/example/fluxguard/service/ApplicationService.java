package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
import org.example.fluxguard.Exceptions.DuplicateAppException;
import org.example.fluxguard.Exceptions.UserNotFoundException;
import org.example.fluxguard.dtos.CreateAppDto;
import org.example.fluxguard.model.ApiKey;
import org.example.fluxguard.model.Application;
import org.example.fluxguard.model.User;
import org.example.fluxguard.repository.ApiKeyRepository;
import org.example.fluxguard.repository.ApplicationRepository;
import org.example.fluxguard.repository.UserRepository;
import org.example.fluxguard.utils.ApiKeyGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@AllArgsConstructor
@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ApiKeyRepository apiKeyRepository;

    /**
     * @Transactional ensures that if the ApiKey save fails after the Application is already saved,
     * the whole thing rolls back. Without this you'd get orphaned Application rows.
     */
    @Transactional
    public String createApplication(String userEmail, CreateAppDto appDto) throws UserNotFoundException {

        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + userEmail);
        }

        if (applicationRepository.existsByAppNameAndUser(appDto.getAppName(), user)) {
            throw new DuplicateAppException("Application name already exists for this user");
        }

        Application application = new Application();
        application.setAppName(appDto.getAppName());
        application.setUser(user);
        application.setDescription(appDto.getAppDescription());
        application.setCreatedAt(LocalDateTime.now());
        applicationRepository.save(application);

        // Use SecureRandom-based generator instead of java.util.Random
        String rawKey = ApiKeyGenerator.generate();

        ApiKey apiKey = new ApiKey();
        apiKey.setFgKey(rawKey);
        apiKey.setApplication(application);
        apiKey.setUser(user);
        apiKey.setCreatedAt(LocalDateTime.now());
        apiKeyRepository.save(apiKey);

        return rawKey;
    }
}