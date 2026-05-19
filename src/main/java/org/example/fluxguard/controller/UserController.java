package org.example.fluxguard.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.example.fluxguard.dtos.UserLoginDto;
import org.example.fluxguard.dtos.UserRegisterDto;
import org.example.fluxguard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/auth/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody UserRegisterDto userRegisterDto) throws Exception {
        String token = userService.registerUser(userRegisterDto);
        return ResponseEntity.ok(Map.of("token", token, "message", "Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody UserLoginDto dto) throws Exception {
        String token = userService.loginUser(dto);
        return ResponseEntity.ok(Map.of("token", token, "message", "Login successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }
}