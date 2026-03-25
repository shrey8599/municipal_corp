package com.example.municipalcorp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketCloseDTO {
    @NotBlank(message = "Resolution note is required")
    private String resolutionNote;
}
