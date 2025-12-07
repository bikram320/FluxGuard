package org.example.fluxguard.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UserRegisterDto {

    @NotBlank(message = "Username is required")
    @Length(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Length(min = 8 , message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank(message = "Confirm Password is required")
    private String confirmPassword;
}
