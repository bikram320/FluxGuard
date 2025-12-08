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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@AllArgsConstructor
@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ApiKeyRepository apiKeyRepository;

    public String createApplication(String userEmail,
                                    CreateAppDto appDto) throws Exception {

        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + userEmail);
        }
        if(applicationRepository.existsByAppNameAndUser(appDto.getAppName(), user)){
            throw new DuplicateAppException("Application name already exists for this user");
        }
        Application application = new Application();
        application.setAppName(appDto.getAppName());
        application.setUser(user);
        application.setDescription(appDto.getAppDescription());
        application.setCreatedAt(LocalDateTime.now());
        applicationRepository.save(application);

        String apikey = generateApiKey();

        ApiKey apiKey = new ApiKey();
        apiKey.setFgKey(apikey);
        apiKey.setApplication(application);
        apiKey.setUser(user);
        apiKey.setCreatedAt(LocalDateTime.now());
        apiKeyRepository.save(apiKey);

        return apikey;
    }
    public String generateApiKey() {
        Random random = new Random();
        int randomDigits = 1000+ random.nextInt(9000);

        String letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        StringBuilder randomAlphabets = new StringBuilder();
        for(int i =0; i<4; i++){
            randomAlphabets.append(letters.charAt(random.nextInt(letters.length())));
        }

        return "FG-" + randomDigits+ "-" + randomAlphabets.toString();
    }
}
