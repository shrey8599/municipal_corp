package com.example.municipalcorp.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderRegistrationDTO {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;
    
    @Email(message = "Invalid email address")
    private String email;
    
    @NotBlank(message = "Jurisdiction (Ward/Area) is required")
    private String jurisdiction;
    
    @NotBlank(message = "Designation is required")
    private String designation;
}
