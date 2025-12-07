package org.example.fluxguard.controller;

import lombok.AllArgsConstructor;
import org.example.fluxguard.dtos.UserLoginDto;
import org.example.fluxguard.dtos.UserRegisterDto;
import org.example.fluxguard.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/auth/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDto userRegisterDto) throws  Exception {
        String message =  userService.registerUser(userRegisterDto);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto loginDto) throws  Exception
    {
        String message =  userService.loginUser(loginDto);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
