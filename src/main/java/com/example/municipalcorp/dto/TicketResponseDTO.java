package com.example.municipalcorp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class TicketResponseDTO {
    private Long id;
    private String ticketId;
    private String title;
    private String description;
    private String type;
    private String category;
    private String status;
    private String resolutionNote;
    private List<String> imageUrls;
    private CitizenInfo citizen;
    private LeaderInfo assignedLeader;
    private List<CommentInfo> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime closedAt;
    
    @Data
    @AllArgsConstructor
    public static class CitizenInfo {
        private Long id;
        private String name;
        private String phone;
        private String email;
        private String address;
        private String wardNumber;
    }
    
    @Data
    @AllArgsConstructor
    public static class LeaderInfo {
        private Long id;
        private String name;
        private String jurisdiction;
        private String designation;
    }
    
    @Data
    @AllArgsConstructor
    public static class CommentInfo {
        private Long id;
        private String comment;
        private String commentedBy;
        private LocalDateTime createdAt;
    }
}
