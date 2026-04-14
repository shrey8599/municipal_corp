package com.example.municipalcorp.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserRegistrationDTO {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String phone;
    
    @Email(message = "Invalid email address")
    private String email;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @NotBlank(message = "Ward number is required")
    private String wardNumber;
    
    private Long leaderId; // Associated leader ID

    private String state;

    private String city;

    private Double latitude;

    private Double longitude;
}
