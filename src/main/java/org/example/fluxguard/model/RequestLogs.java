package org.example.fluxguard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.net.InetAddress;
import java.time.Instant;

@Entity
@Table(name = "request_logs")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestLogs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "api_key_id")
    private ApiKey apiKey;

    @Column(name = "ip", nullable = false)
    private InetAddress ip;

    @Column(name = "endpoint", nullable = false)
    private String endpoint;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @ColumnDefault("now()")
    @Column(name = "created_at")
    private Instant createdAt;

}
