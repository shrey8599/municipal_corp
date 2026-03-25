package com.example.municipalcorp.service;

import com.example.municipalcorp.dto.*;
import com.example.municipalcorp.model.*;
import com.example.municipalcorp.repository.TicketCommentRepository;
import com.example.municipalcorp.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketService {
    
    private final TicketRepository ticketRepository;
    private final TicketCommentRepository commentRepository;
    private final UserService userService;
    private final LeaderService leaderService;
    
    @Transactional
    public Ticket createTicket(TicketCreateDTO dto, Long citizenId) {
        User citizen = userService.getUserById(citizenId);
        
        if (citizen.getAssociatedLeader() == null) {
            throw new RuntimeException("No leader associated with this citizen");
        }
        
        Ticket ticket = new Ticket();
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setType(Ticket.ComplaintType.valueOf(dto.getType().toUpperCase()));
        ticket.setCategory(Ticket.ComplaintCategory.valueOf(dto.getCategory().toUpperCase()));
        ticket.setStatus(Ticket.TicketStatus.OPEN);
        ticket.setCitizen(citizen);
        ticket.setAssignedLeader(citizen.getAssociatedLeader());
        
        if (dto.getImageUrls() != null) {
            ticket.setImageUrls(dto.getImageUrls());
        }
        
        Ticket savedTicket = ticketRepository.save(ticket);
        log.info("Ticket created: {} by citizen {}", savedTicket.getTicketId(), citizenId);
        
        return savedTicket;
    }
    
    public List<TicketResponseDTO> getCitizenTickets(Long citizenId) {
        User citizen = userService.getUserById(citizenId);
        List<Ticket> tickets = ticketRepository.findByCitizen(citizen);
        return tickets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public List<TicketResponseDTO> getLeaderTickets(Long leaderId) {
        Leader leader = new Leader();
        leader.setId(leaderId);
        List<Ticket> tickets = ticketRepository.findByAssignedLeader(leader);
        return tickets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public List<TicketResponseDTO> getLeaderTicketsByStatus(Long leaderId, Ticket.TicketStatus status) {
        Leader leader = new Leader();
        leader.setId(leaderId);
        List<Ticket> tickets = ticketRepository.findByAssignedLeaderAndStatus(leader, status);
        return tickets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public TicketResponseDTO getTicketById(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return convertToDTO(ticket);
    }
    
    public TicketResponseDTO getTicketByTicketId(String ticketId) {
        Ticket ticket = ticketRepository.findByTicketId(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return convertToDTO(ticket);
    }
    
    @Transactional
    public Ticket updateTicketStatus(Long ticketId, Ticket.TicketStatus status, String resolutionNote) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticket.setStatus(status);
        
        // If status is RESOLVED and resolution note is provided, set it
        if (status == Ticket.TicketStatus.RESOLVED && resolutionNote != null && !resolutionNote.trim().isEmpty()) {
            ticket.setResolutionNote(resolutionNote);
            ticket.setClosedAt(LocalDateTime.now());
        }
        
        Ticket updated = ticketRepository.save(ticket);
        
        log.info("Ticket {} status updated to {}", ticket.getTicketId(), status);
        return updated;
    }
    
    @Transactional
    public TicketComment addComment(Long ticketId, String comment, String commentedBy) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        TicketComment ticketComment = new TicketComment();
        ticketComment.setTicket(ticket);
        ticketComment.setComment(comment);
        ticketComment.setCommentedBy(commentedBy);
        // Legacy method - userId and userRole will be null
        
        TicketComment saved = commentRepository.save(ticketComment);
        log.info("Comment added to ticket {} by {}", ticket.getTicketId(), commentedBy);
        
        return saved;
    }
    
    @Transactional
    public TicketComment addComment(Long ticketId, String comment, Long userId) {
        return addComment(ticketId, comment, userId, null);
    }
    
    @Transactional
    public TicketComment addComment(Long ticketId, String comment, Long userId, String role) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        // Fetch user/leader based on role if provided
        String commenterName;
        if ("LEADER".equals(role)) {
            // Look in Leader table first
            try {
                Leader leader = leaderService.getLeaderById(userId);
                commenterName = leader.getName() + " (" + leader.getDesignation() + ")";
            } catch (Exception e) {
                throw new RuntimeException("Leader not found with ID: " + userId);
            }
        } else {
            // Try User first, then Leader as fallback
            try {
                User user = userService.getUserById(userId);
                commenterName = user.getName();
            } catch (Exception e) {
                try {
                    Leader leader = leaderService.getLeaderById(userId);
                    commenterName = leader.getName() + " (" + leader.getDesignation() + ")";
                } catch (Exception ex) {
                    throw new RuntimeException("User or Leader not found");
                }
            }
        }
        
        // Create comment with userId and role for future lookups
        TicketComment ticketComment = new TicketComment();
        ticketComment.setTicket(ticket);
        ticketComment.setComment(comment);
        ticketComment.setCommentedBy(commenterName);
        ticketComment.setUserId(userId);
        ticketComment.setUserRole(role);
        
        TicketComment saved = commentRepository.save(ticketComment);
        log.info("Comment added to ticket {} by {} (userId: {}, role: {})", ticket.getTicketId(), commenterName, userId, role);
        
        return saved;
    }
    
    public List<TicketCommentDTO> getTicketComments(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        List<TicketComment> comments = commentRepository.findByTicketOrderByCreatedAtDesc(ticket);
        return comments.stream()
            .map(c -> {
                String commenterName = c.getCommentedBy(); // Default to stored name
                
                // If userId exists, fetch current name from database
                if (c.getUserId() != null && c.getUserRole() != null) {
                    try {
                        if ("LEADER".equals(c.getUserRole())) {
                            Leader leader = leaderService.getLeaderById(c.getUserId());
                            commenterName = leader.getName() + " (" + leader.getDesignation() + ")";
                        } else {
                            try {
                                User user = userService.getUserById(c.getUserId());
                                commenterName = user.getName();
                            } catch (Exception e) {
                                // Fallback to Leader if user not found
                                Leader leader = leaderService.getLeaderById(c.getUserId());
                                commenterName = leader.getName() + " (" + leader.getDesignation() + ")";
                            }
                        }
                    } catch (Exception e) {
                        // If user/leader not found, keep stored name
                        log.warn("Could not fetch current name for userId {} role {}, using stored name", 
                                c.getUserId(), c.getUserRole());
                    }
                }
                
                return new TicketCommentDTO(
                    c.getId(),
                    c.getComment(),
                    commenterName,
                    c.getCreatedAt()
                );
            })
            .collect(Collectors.toList());
    }
    
    private TicketResponseDTO convertToDTO(Ticket ticket) {
        // Fetch citizen info fresh from database by ID (ensures latest data)
        User citizen = userService.getUserById(ticket.getCitizen().getId());
        TicketResponseDTO.CitizenInfo citizenInfo = new TicketResponseDTO.CitizenInfo(
            citizen.getId(),
            citizen.getName(),
            citizen.getPhone(),
            citizen.getEmail(),
            citizen.getAddress(),
            citizen.getWardNumber()
        );
        
        // Fetch leader info fresh from database by ID (ensures latest name, designation, etc.)
        Leader leader = leaderService.getLeaderById(ticket.getAssignedLeader().getId());
        TicketResponseDTO.LeaderInfo leaderInfo = new TicketResponseDTO.LeaderInfo(
            leader.getId(),
            leader.getName(),
            leader.getJurisdiction(),
            leader.getDesignation()
        );
        
        // Convert comments (with current names)
        List<TicketComment> comments = commentRepository.findByTicketOrderByCreatedAtDesc(ticket);
        List<TicketResponseDTO.CommentInfo> commentInfos = comments.stream()
            .map(c -> {
                String commenterName = c.getCommentedBy(); // Default to stored name
                
                // If userId exists, fetch current name from database
                if (c.getUserId() != null && c.getUserRole() != null) {
                    try {
                        if ("LEADER".equals(c.getUserRole())) {
                            Leader commentLeader = leaderService.getLeaderById(c.getUserId());
                            commenterName = commentLeader.getName() + " (" + commentLeader.getDesignation() + ")";
                        } else {
                            try {
                                User commentUser = userService.getUserById(c.getUserId());
                                commenterName = commentUser.getName();
                            } catch (Exception e) {
                                // Fallback to Leader if user not found
                                Leader commentLeader = leaderService.getLeaderById(c.getUserId());
                                commenterName = commentLeader.getName() + " (" + commentLeader.getDesignation() + ")";
                            }
                        }
                    } catch (Exception e) {
                        // If user/leader not found, keep stored name
                        log.warn("Could not fetch current name for userId {} role {}, using stored name", 
                                c.getUserId(), c.getUserRole());
                    }
                }
                
                return new TicketResponseDTO.CommentInfo(
                    c.getId(),
                    c.getComment(),
                    commenterName,
                    c.getCreatedAt()
                );
            })
            .collect(Collectors.toList());
        
        return new TicketResponseDTO(
            ticket.getId(),
            ticket.getTicketId(),
            ticket.getTitle(),
            ticket.getDescription(),
            ticket.getType().name(),
            ticket.getCategory().name(),
            ticket.getStatus().name(),
            ticket.getResolutionNote(),
            ticket.getImageUrls(),
            citizenInfo,
            leaderInfo,
            commentInfos,
            ticket.getCreatedAt(),
            ticket.getUpdatedAt(),
            ticket.getClosedAt()
        );
    }
}
