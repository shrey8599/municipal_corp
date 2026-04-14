package com.example.municipalcorp.controller;

import com.example.municipalcorp.dto.ApiResponse;
import com.example.municipalcorp.dto.TicketCommentDTO;
import com.example.municipalcorp.dto.TicketCreateDTO;
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
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@Slf4j
public class TicketController {
    
    private final TicketService ticketService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponseDTO>> createTicket(
            @RequestParam Long userId,
            @Valid @RequestBody TicketCreateDTO request) {
        
        log.info("Ticket creation request from user: {}", userId);
        Ticket ticket = ticketService.createTicket(request, userId);
        TicketResponseDTO response = ticketService.getTicketById(ticket.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Ticket created successfully", response));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResponseDTO>>> getTickets(
            @RequestParam(required = false) Long userId) {
        
        if (userId != null) {
            log.info("Fetching tickets for user: {}", userId);
            List<TicketResponseDTO> tickets = ticketService.getCitizenTickets(userId);
            return ResponseEntity.ok(ApiResponse.success("Tickets retrieved successfully", tickets));
        } else {
            log.info("Fetching all tickets");
            List<TicketResponseDTO> tickets = ticketService.getAllTickets();
            return ResponseEntity.ok(ApiResponse.success("Tickets retrieved successfully", tickets));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> getTicketById(
            @PathVariable Long id) {
        
        log.info("Fetching ticket: {}", id);
        TicketResponseDTO ticket = ticketService.getTicketById(id);
        
        return ResponseEntity.ok(ApiResponse.success("Ticket retrieved successfully", ticket));
    }
    
    @GetMapping("/by-ticket-id/{ticketId}")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> getTicketByTicketId(
            @PathVariable String ticketId) {
        
        log.info("Fetching ticket by ticketId: {}", ticketId);
        TicketResponseDTO ticket = ticketService.getTicketByTicketId(ticketId);
        
        return ResponseEntity.ok(ApiResponse.success("Ticket retrieved successfully", ticket));
    }
    
    @GetMapping("/leader/{leaderId}")
    public ResponseEntity<ApiResponse<List<TicketResponseDTO>>> getLeaderTickets(
            @PathVariable Long leaderId) {
        
        log.info("Fetching tickets for leader: {}", leaderId);
        List<TicketResponseDTO> tickets = ticketService.getLeaderTickets(leaderId);
        
        return ResponseEntity.ok(ApiResponse.success("Tickets retrieved successfully", tickets));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String resolutionNote) {
        
        log.info("Updating ticket {} status to: {}", id, status);
        Ticket.TicketStatus ticketStatus = Ticket.TicketStatus.valueOf(status.toUpperCase());
        ticketService.updateTicketStatus(id, ticketStatus, resolutionNote);
        TicketResponseDTO response = ticketService.getTicketById(id);
        
        return ResponseEntity.ok(ApiResponse.success("Ticket status updated successfully", response));
    }
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<TicketCommentDTO>> addComment(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam(required = false) String role,
            @Valid @RequestBody TicketCommentDTO request) {
        
        log.info("Adding comment to ticket {} by user {} with role {}", id, userId, role);
        TicketComment comment = ticketService.addComment(id, request.getComment(), userId, role);
        
        // Convert to DTO to avoid circular reference
        TicketCommentDTO dto = new TicketCommentDTO(
            comment.getId(),
            comment.getComment(),
            comment.getCommentedBy(),
            comment.getCreatedAt()
        );
        
        return ResponseEntity.ok(ApiResponse.success("Comment added successfully", dto));
    }
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<TicketCommentDTO>>> getTicketComments(
            @PathVariable Long id) {
        
        log.info("Fetching comments for ticket: {}", id);
        List<TicketCommentDTO> comments = ticketService.getTicketComments(id);
        
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved successfully", comments));
    }
}
