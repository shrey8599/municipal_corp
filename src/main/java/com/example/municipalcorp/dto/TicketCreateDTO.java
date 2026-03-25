package com.example.municipalcorp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class TicketCreateDTO {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Type is required")
    private String type; // COMPLAINT or FEEDBACK
    
    @NotNull(message = "Category is required")
    private String category;
    
    private List<String> imageUrls;
}
