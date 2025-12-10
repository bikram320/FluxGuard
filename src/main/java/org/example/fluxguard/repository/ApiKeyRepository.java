package org.example.fluxguard.repository;

import org.example.fluxguard.model.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    boolean existsByFgKey(String apikey);

    ApiKey findByFgKey(String apikey);
}