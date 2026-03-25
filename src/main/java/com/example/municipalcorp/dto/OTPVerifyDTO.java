package com.example.municipalcorp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OTPVerifyDTO {
    @NotBlank(message = "Phone or email is required")
    private String identifier;
    
    @NotBlank(message = "OTP is required")
    private String otp;
}
