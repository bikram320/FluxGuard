package org.example.fluxguard.repository;

import org.example.fluxguard.model.ApiKey;
import org.example.fluxguard.model.RequestLogs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestLogsRepository extends JpaRepository<RequestLogs, Long> {
    // Used by DashboardService.getLogsForApp() — paginated
    Page<RequestLogs> findAllByApiKey(ApiKey apiKey, Pageable pageable);
}