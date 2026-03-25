package com.example.municipalcorp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketComment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonIgnoreProperties({"assignedTickets", "tickets", "citizen", "assignedLeader", "comments"})
    private Ticket ticket;
    
    @NotBlank(message = "Comment is required")
    @Column(nullable = false, length = 1000)
    private String comment;
    
    @Column(nullable = false)
    private String commentedBy; // Name (stored for backward compatibility)
    
    @Column(name = "user_id")
    private Long userId; // ID of the user/leader who commented
    
    @Column(name = "user_role")
    private String userRole; // CITIZEN or LEADER
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
