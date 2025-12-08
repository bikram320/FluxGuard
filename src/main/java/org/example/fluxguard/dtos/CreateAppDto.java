package org.example.fluxguard.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class CreateAppDto {

    @NotBlank(message = "App name is required")
    @Length(min = 3, max = 25, message = "App name must be between 3 and 25 characters")
    private String appName;

    @NotBlank(message = "App description is required")
    @Length(min = 10, max = 300, message = "App description must")
    private String appDescription;
}
