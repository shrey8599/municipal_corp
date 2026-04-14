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

import jakarta.servlet.http.HttpServletRequest;
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
        
        String identifier = request.getIdentifier();
        log.info("OTP request for: {}", identifier);
        
        // Check if identifier is registered (for debugging)
        boolean isUserRegistered = userService.isRegistered(identifier);
        if (isUserRegistered) {
            User user = userService.getUserByIdentifier(identifier);
            log.info("OTP request for registered user: {}, Role: {}", user.getName(), user.getRole());
        } else {
            log.debug("OTP request for unregistered identifier (may be registration): {}", identifier);
        }
        
        // Check if this is a leader
        try {
            Leader leader = leaderService.getLeaderByIdentifier(identifier);
            log.info("OTP request for registered leader: {}", leader.getName());
        } catch (Exception e) {
            // Not a leader, that's okay
        }
        
        // Generate and send OTP
        String otp = otpService.generateAndSendOTP(identifier);
        log.info("OTP generated for: {} -> {}", identifier, otp);
        
        Map<String, String> data = new HashMap<>();
        data.put("message", "OTP sent successfully");
        data.put("identifier", identifier);
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
                data.put("state", user.getState());
                data.put("city", user.getCity());
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
    
    // ============ Super Admin Endpoints for Leader Registration ============
    
    @PostMapping("/super-admin/send-otp-for-leader")
    @Operation(summary = "Send OTP for Leader Registration", description = "Super admin sends OTP to leader's phone/email")
    public ResponseEntity<ApiResponse<Map<String, String>>> sendOTPForLeader(
            @Valid @RequestBody OTPRequestDTO request,
            HttpServletRequest httpRequest) {
        
        // Check if user is super admin
        String role = (String) httpRequest.getAttribute("role");
        if (role == null || !role.equals("SUPER_ADMIN")) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Only super admins can register leaders"));
        }
        
        log.info("Super admin sending OTP for leader registration: {}", request.getIdentifier());
        
        String otp = otpService.generateAndSendOTP(request.getIdentifier());
        
        Map<String, String> data = new HashMap<>();
        data.put("message", "OTP sent successfully to leader");
        data.put("identifier", request.getIdentifier());
        // For development only - remove in production
        data.put("otp", otp);
        
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", data));
    }
    
    @PostMapping("/super-admin/verify-otp-for-leader")
    @Operation(summary = "Verify OTP for Leader Registration", description = "Super admin verifies OTP for new leader")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOTPForLeader(
            @Valid @RequestBody OTPVerifyDTO request,
            HttpServletRequest httpRequest) {
        
        // Check if user is super admin
        String role = (String) httpRequest.getAttribute("role");
        if (role == null || !role.equals("SUPER_ADMIN")) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Only super admins can register leaders"));
        }
        
        log.info("Super admin verifying OTP for leader: {}", request.getIdentifier());
        
        boolean isValid = otpService.verifyOTP(request.getIdentifier(), request.getOtp());
        
        if (!isValid) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid or expired OTP"));
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("verified", true);
        data.put("identifier", request.getIdentifier());
        data.put("message", "OTP verified. Proceed with leader registration");
        
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", data));
    }
    
    @PostMapping("/super-admin/register-leader")
    @Operation(summary = "Register Leader", description = "Super admin registers a new leader after OTP verification")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerLeader(
            @Valid @RequestBody LeaderRegistrationDTO request,
            @RequestParam String identifier,
            HttpServletRequest httpRequest) {
        
        // Check if user is super admin
        String role = (String) httpRequest.getAttribute("role");
        if (role == null || !role.equals("SUPER_ADMIN")) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Only super admins can register leaders"));
        }
        
        log.info("Super admin registering new leader: {}", identifier);
        
        try {
            Leader leader = leaderService.registerLeaderBySuperAdmin(
                request.getName(),
                request.getPhone(),
                request.getEmail(),
                request.getJurisdiction(),
                request.getDesignation()
            );
            
            Map<String, Object> data = new HashMap<>();
            data.put("id", leader.getId());
            data.put("name", leader.getName());
            data.put("phone", leader.getPhone());
            data.put("email", leader.getEmail());
            data.put("jurisdiction", leader.getJurisdiction());
            data.put("designation", leader.getDesignation());
            data.put("active", leader.getActive());
            data.put("createdAt", leader.getCreatedAt());
            
            return ResponseEntity.ok(ApiResponse.success("Leader registered successfully", data));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
}
