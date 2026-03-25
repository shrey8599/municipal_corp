package com.example.municipalcorp.controller;

import com.example.municipalcorp.dto.ApiResponse;
import com.example.municipalcorp.dto.UserRegistrationDTO;
import com.example.municipalcorp.model.Leader;
import com.example.municipalcorp.model.User;
import com.example.municipalcorp.service.LeaderService;
import com.example.municipalcorp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    private final LeaderService leaderService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        log.info("Get user by ID: {}", id);
        User user = userService.getUserById(id);
        // Refresh associated leader data to ensure latest info (name, designation, etc.)
        if (user.getAssociatedLeader() != null) {
            Leader freshLeader = leaderService.getLeaderById(user.getAssociatedLeader().getId());
            user.setAssociatedLeader(freshLeader);
        }
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUserById(
            @PathVariable Long id,
            @Valid @RequestBody UserRegistrationDTO request) {
        
        log.info("Profile update request for user: {}", id);
        User updated = userService.updateUserProfile(id, request);
        
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@RequestParam Long userId) {
        // In production, get userId from JWT token
        User user = userService.getUserById(userId);
        // Refresh associated leader data to ensure latest info
        if (user.getAssociatedLeader() != null) {
            Leader freshLeader = leaderService.getLeaderById(user.getAssociatedLeader().getId());
            user.setAssociatedLeader(freshLeader);
        }
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }
    
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            @RequestParam Long userId,
            @Valid @RequestBody UserRegistrationDTO request) {
        
        log.info("Profile update request for user: {}", userId);
        User updated = userService.updateUserProfile(userId, request);
        
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
    
    @PutMapping("/me/leader")
    public ResponseEntity<ApiResponse<User>> updateLeader(
            @RequestParam Long userId,
            @RequestParam Long leaderId) {
        
        log.info("Leader update request for user: {} to leader: {}", userId, leaderId);
        User updated = userService.updateAssociatedLeader(userId, leaderId);
        
        return ResponseEntity.ok(ApiResponse.success("Leader updated successfully", updated));
    }
    
    @PatchMapping("/{id}/profile-picture")
    public ResponseEntity<ApiResponse<User>> updateProfilePicture(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request) {
        
        String profilePictureUrl = request.get("profilePictureUrl");
        
        if (profilePictureUrl == null || profilePictureUrl.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Profile picture URL is required"));
        }
        
        log.info("Profile picture update request for user: {}", id);
        User updated = userService.updateProfilePicture(id, profilePictureUrl);
        
        return ResponseEntity.ok(ApiResponse.success("Profile picture updated successfully", updated));
    }
}
