package org.example.fluxguard.repository;

import jakarta.validation.constraints.NotBlank;
import org.example.fluxguard.model.Application;
import org.example.fluxguard.model.User;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByAppNameAndUser(@NotBlank(message = "App name is required") @Length(min = 3, max = 25, message = "App name must be between 3 and 25 characters") String appName, User user);
}