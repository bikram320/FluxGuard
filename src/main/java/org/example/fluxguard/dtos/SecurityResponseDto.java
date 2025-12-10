package org.example.fluxguard.dtos;

import lombok.Data;

@Data
public class SecurityResponseDto {
    private boolean status;
    private String message;

    public SecurityResponseDto(boolean b, String message) {
        this.status=b;
        this.message=message;
    }
}
