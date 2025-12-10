package org.example.fluxguard.controller;

import lombok.AllArgsConstructor;
import org.example.fluxguard.dtos.SecurityRequestDto;
import org.example.fluxguard.dtos.SecurityResponseDto;
import org.example.fluxguard.service.SecurityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/fluxguard/security")
public class SecurityController {

    private final SecurityService securityService;

    @PostMapping("/check")
    public ResponseEntity<?> securityCheck(@RequestBody SecurityRequestDto securityRequestDto) {
        SecurityResponseDto response = securityService.performSecurityCheck(securityRequestDto);
        if(response.isStatus()){
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }
    }
}
