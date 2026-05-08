package org.example.fluxguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FluxGuardApplication {

    public static void main(String[] args) {
        SpringApplication.run(FluxGuardApplication.class, args);
    }

}
