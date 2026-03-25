package com.example.municipalcorp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OTPRequestDTO {
    @NotBlank(message = "Phone or email is required")
    private String identifier; // phone or email
    
    private String role; // CITIZEN or ADMIN
}
