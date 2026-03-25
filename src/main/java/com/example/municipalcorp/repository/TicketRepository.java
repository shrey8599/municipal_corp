package com.example.municipalcorp.repository;

import com.example.municipalcorp.model.Ticket;
import com.example.municipalcorp.model.User;
import com.example.municipalcorp.model.Leader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketId(String ticketId);
    List<Ticket> findByCitizen(User citizen);
    List<Ticket> findByAssignedLeader(Leader leader);
    List<Ticket> findByStatus(Ticket.TicketStatus status);
    List<Ticket> findByAssignedLeaderAndStatus(Leader leader, Ticket.TicketStatus status);
    List<Ticket> findByCategory(Ticket.ComplaintCategory category);
}
