package com.example.municipalcorp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String wardNumber;
    private String role;  // Changed to String to avoid circular dependency
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Simplified leader info without circular refs
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SimpleLeaderDTO {
        private Long id;
        private String name;
        private String jurisdiction;
        private String designation;
    }
    
    private SimpleLeaderDTO associatedLeader;
}
