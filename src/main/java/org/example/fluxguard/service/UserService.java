package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.fluxguard.Exceptions.CredentialsNotMatchException;
import org.example.fluxguard.config.PasswordConfig;
import org.example.fluxguard.dtos.UserLoginDto;
import org.example.fluxguard.dtos.UserRegisterDto;
import org.example.fluxguard.repository.UserRepository;
import org.example.fluxguard.utils.JwtUtil;
import org.springframework.stereotype.Service;
import org.example.fluxguard.model.User;

import java.sql.Time;
import java.time.LocalDateTime;

@AllArgsConstructor
@Service
public class UserService {

    private final  UserRepository userRepository;
    private final PasswordConfig passwordConfig;
    private final JwtUtil jwtUtil;

    public String registerUser(UserRegisterDto userRegisterDto) throws Exception {

        if (userRepository.existsByEmail(userRegisterDto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        if(!userRegisterDto.getPassword().equals(userRegisterDto.getConfirmPassword())){
             throw new CredentialsNotMatchException("Password and Confirm Password do not match");
        }

        String encodedPassword = passwordConfig.passwordEncoder().encode(userRegisterDto.getPassword());
        User newUser = new User();
        newUser.setName(userRegisterDto.getUsername());
        newUser.setEmail(userRegisterDto.getEmail());
        newUser.setPasswordHash(encodedPassword);
        newUser.setCreatedAt(LocalDateTime.now());
        userRepository.save(newUser);

        return jwtUtil.generateToken(userRegisterDto.getEmail());
    }

    public String loginUser(UserLoginDto loginDto) throws CredentialsNotMatchException {
        User user = userRepository.findByEmail(loginDto.getEmail());
        if (user == null || !passwordConfig.passwordEncoder().matches(loginDto.getPassword(), user.getPasswordHash())) {
            throw new CredentialsNotMatchException("Invalid email or password");
        }
        return jwtUtil.generateToken(user.getEmail());
    }
}
