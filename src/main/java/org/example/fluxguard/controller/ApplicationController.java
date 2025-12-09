package org.example.fluxguard.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.example.fluxguard.dtos.CreateAppDto;
import org.example.fluxguard.service.ApplicationService;
import org.example.fluxguard.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@AllArgsConstructor
@RestController
@RequestMapping("/api/application")
public class ApplicationController {

     private final ApplicationService applicationService;
     private final JwtUtil jwtUtil;

     @PostMapping("/create")
     public ResponseEntity<?> createApplication(HttpServletRequest request,
                                                @RequestBody CreateAppDto appDto) throws Exception {
          String authHeader = request.getHeader("Authorization");

          if(authHeader != null && authHeader.startsWith("Bearer ")) {
               String jwtToken = authHeader.substring(7);
               String userEmail = jwtUtil.extractUsername(jwtToken);
               String apiKey = applicationService.createApplication(userEmail, appDto);
               return new ResponseEntity<>(apiKey, HttpStatus.CREATED);
          }

          return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                  .body("Authorization header is missing or invalid");
     }



}
