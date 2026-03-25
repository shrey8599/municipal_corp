package com.example.municipalcorp.controller;

import com.example.municipalcorp.dto.ApiResponse;
import com.example.municipalcorp.dto.TicketCloseDTO;
import com.example.municipalcorp.dto.TicketCommentDTO;
import com.example.municipalcorp.dto.TicketResponseDTO;
import com.example.municipalcorp.model.Ticket;
import com.example.municipalcorp.model.TicketComment;
import com.example.municipalcorp.service.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tickets")
@RequiredArgsConstructor
@Slf4j
public class AdminController {
    
    private final TicketService ticketService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResponseDTO>>> getLeaderTickets(
            @RequestParam Long leaderId,
            @RequestParam(required = false) String status) {
        
        log.info("Fetching tickets for leader: {} with status: {}", leaderId, status);
        
        List<TicketResponseDTO> tickets;
        if (status != null) {
            Ticket.TicketStatus ticketStatus = Ticket.TicketStatus.valueOf(status.toUpperCase());
            tickets = ticketService.getLeaderTicketsByStatus(leaderId, ticketStatus);
        } else {
            tickets = ticketService.getLeaderTickets(leaderId);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Tickets retrieved successfully", tickets));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Ticket>> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        
        log.info("Updating ticket {} status to: {}", id, status);
        
        Ticket.TicketStatus ticketStatus = Ticket.TicketStatus.valueOf(status.toUpperCase());
        Ticket updated = ticketService.updateTicketStatus(id, ticketStatus, null);
        
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", updated));
    }
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<TicketComment>> addComment(
            @PathVariable Long id,
            @RequestParam String commentedBy,
            @Valid @RequestBody TicketCommentDTO request) {
        
        log.info("Adding comment to ticket {} by: {}", id, commentedBy);
        
        TicketComment comment = ticketService.addComment(id, request.getComment(), commentedBy);
        
        return ResponseEntity.ok(ApiResponse.success("Comment added successfully", comment));
    }
}
