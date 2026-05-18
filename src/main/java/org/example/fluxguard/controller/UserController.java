package org.example.fluxguard.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.example.fluxguard.dtos.UserLoginDto;
import org.example.fluxguard.dtos.UserRegisterDto;
import org.example.fluxguard.service.UserService;
import org.example.fluxguard.utils.CookieUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/auth/users")
public class UserController {

    private final UserService userService;
    private final CookieUtil cookieUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody UserRegisterDto userRegisterDto,
            HttpServletResponse response) throws Exception {
        String token = userService.registerUser(userRegisterDto);
        cookieUtil.addTokenToCookie(token, response);
        return ResponseEntity.ok("Registration successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody UserLoginDto dto,
            HttpServletResponse response) throws Exception {
        String token = userService.loginUser(dto);
        cookieUtil.addTokenToCookie(token, response);
        return ResponseEntity.ok("Login successful");
    }

    // In UserController.java
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok("Logged out");
    }
}