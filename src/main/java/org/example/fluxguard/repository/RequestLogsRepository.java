package org.example.fluxguard.repository;

import org.example.fluxguard.model.RequestLogs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestLogsRepository extends JpaRepository<RequestLogs, Long> {
}