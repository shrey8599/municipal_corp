package com.example.municipalcorp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketCommentDTO {
    private Long id;
    
    @NotBlank(message = "Comment is required")
    private String comment;
    
    private String commenterName;
    private LocalDateTime createdAt;
    
    public TicketCommentDTO(String comment) {
        this.comment = comment;
    }
}
