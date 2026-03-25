package com.example.municipalcorp.controller;

import com.example.municipalcorp.dto.*;
import com.example.municipalcorp.model.Leader;
import com.example.municipalcorp.model.User;
import com.example.municipalcorp.security.JwtUtil;
import com.example.municipalcorp.service.LeaderService;
import com.example.municipalcorp.service.OTPService;
import com.example.municipalcorp.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "OTP-based authentication and registration endpoints")
public class AuthController {
    
    private final OTPService otpService;
    private final UserService userService;
    private final LeaderService leaderService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/send-otp")
    @Operation(summary = "Request OTP", description = "Send OTP to phone number or email")
    public ResponseEntity<ApiResponse<Map<String, String>>> sendOTP(
            @Valid @RequestBody OTPRequestDTO request) {
        
        log.info("OTP request for: {}", request.getIdentifier());
        
        String otp = otpService.generateAndSendOTP(request.getIdentifier());
        
        Map<String, String> data = new HashMap<>();
        data.put("message", "OTP sent successfully");
        data.put("identifier", request.getIdentifier());
        // For development only - remove in production
        data.put("otp", otp);
        
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", data));
    }
    
    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP", description = "Verify OTP and get JWT token if user is registered")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOTP(
            @Valid @RequestBody OTPVerifyDTO request) {
        
        log.info("OTP verification for: {}", request.getIdentifier());
        
        boolean isValid = otpService.verifyOTP(request.getIdentifier(), request.getOtp());
        
        if (!isValid) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid or expired OTP"));
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("verified", true);
        data.put("identifier", request.getIdentifier());
        
        // Check if user exists in User table
        boolean isUserRegistered = userService.isRegistered(request.getIdentifier());
        
        // Check if leader exists in Leader table
        boolean isLeaderRegistered = false;
        try {
            leaderService.getLeaderByIdentifier(request.getIdentifier());
            isLeaderRegistered = true;
        } catch (Exception e) {
            // Leader not found, that's okay
        }
        
        boolean isRegistered = isUserRegistered || isLeaderRegistered;
        data.put("isRegistered", isRegistered);
        
        // Generate JWT token if registered
        if (isRegistered) {
            if (isLeaderRegistered) {
                // Leader login
                Leader leader = leaderService.getLeaderByIdentifier(request.getIdentifier());
                String token = jwtUtil.generateToken(leader.getId(), request.getIdentifier(), "LEADER");
                
                data.put("userId", leader.getId());
                data.put("userName", leader.getName());
                data.put("role", "LEADER");
                data.put("token", token);
            } else {
                // Citizen login
                User user = userService.getUserByIdentifier(request.getIdentifier());
                String token = jwtUtil.generateToken(user.getId(), request.getIdentifier(), user.getRole().name());
                
                data.put("userId", user.getId());
                data.put("userName", user.getName());
                data.put("role", user.getRole());
                data.put("token", token);
            }
        }
        
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", data));
    }
    
    @PostMapping("/register")
    @Operation(summary = "Register User", description = "Register new citizen after OTP verification")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(
            @Valid @RequestBody UserRegistrationDTO request,
            @RequestParam String identifier) {
        
        log.info("Registration request for: {}", identifier);
        
        if (!userService.isRegistered(identifier)) {
            User user = userService.registerCitizen(request, identifier);
            
            // Generate JWT token for the new user
            String token = jwtUtil.generateToken(user.getId(), identifier, user.getRole().name());
            
            // Create clean response DTO without circular references
            UserResponseDTO.UserResponseDTOBuilder userDto = UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .address(user.getAddress())
                .wardNumber(user.getWardNumber())
                .role(user.getRole().name())  // Convert enum to String
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt());
            
            // Add leader info if present (fetch fresh from database by ID)
            if (user.getAssociatedLeader() != null) {
                Leader freshLeader = leaderService.getLeaderById(user.getAssociatedLeader().getId());
                UserResponseDTO.SimpleLeaderDTO leaderDto = UserResponseDTO.SimpleLeaderDTO.builder()
                    .id(freshLeader.getId())
                    .name(freshLeader.getName())
                    .jurisdiction(freshLeader.getJurisdiction())
                    .designation(freshLeader.getDesignation())
                    .build();
                userDto.associatedLeader(leaderDto);
            }
            
            Map<String, Object> data = new HashMap<>();
            data.put("user", userDto.build());
            data.put("token", token);
            
            return ResponseEntity.ok(ApiResponse.success("User registered successfully", data));
        } else {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("User already registered"));
        }
    }
}
