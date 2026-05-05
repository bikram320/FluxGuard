package org.example.fluxguard.repository;

import org.example.fluxguard.model.ApiKey;
import org.example.fluxguard.model.Blocks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.net.InetAddress;
import java.time.Instant;
import java.util.List;

public interface BlocksRepository extends JpaRepository<Blocks, Long> {
     @Query("select (count(b) > 0) from Blocks b where b.ip = ?1")
     boolean existsByIpAddress(InetAddress ip_address);

     // Used by BlockIPService.isIpBlocked() — global check
     boolean existsByIpAndExpiresAtIsNullOrIpAndExpiresAtAfter(
             InetAddress ip1, InetAddress ip2, Instant now);

     // Used by BlockIPService.isIpBlockedForApiKey() — scoped check
     boolean existsByApiKeyAndIpAndExpiresAtIsNullOrApiKeyAndIpAndExpiresAtAfter(
             ApiKey key1, InetAddress ip1, ApiKey key2, InetAddress ip2, Instant now);

     // Used by DashboardService.getActiveBlocks()
     List<Blocks> findAllByApiKeyInAndExpiresAtIsNullOrApiKeyInAndExpiresAtAfter(
             List<ApiKey> keys1, List<ApiKey> keys2, Instant now);

     // Used by BlockIPService.unblockIp()
     void deleteAllByIp(InetAddress ip);

     // Used by BlockIPService.unblockIpForApiKey()
     void deleteAllByApiKeyAndIp(ApiKey apiKey, InetAddress ip);

}