package org.example.fluxguard.repository;

import org.example.fluxguard.model.Blocks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.net.InetAddress;

public interface BlocksRepository extends JpaRepository<Blocks, Long> {
     @Query("select (count(b) > 0) from Blocks b where b.ip = ?1")
     boolean existsByIpAddress(InetAddress ip_address);
}