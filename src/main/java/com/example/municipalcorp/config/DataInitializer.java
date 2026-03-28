package com.example.municipalcorp.config;

import com.example.municipalcorp.model.*;
import com.example.municipalcorp.model.Ticket.*;
import com.example.municipalcorp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LeaderRepository leaderRepository;
    private final TicketRepository ticketRepository;
    private final OTPVerificationRepository otpRepository;

    @Override
    public void run(String... args) {
        log.info("🔄 Starting test data initialization...");
        
        try {
            // Create Leaders
            Leader leader1 = createLeader(
                "1111111111",
                "Ward Officer - Ward 5",
                "officer.ward5@municipal.gov",
                "5",
                "Ward Officer"
            );
            
            Leader leader2 = createLeader(
                "3333333333",
                "Ward Officer - Ward 10",
                "officer.ward10@municipal.gov",
                "10",
                "Ward Officer"
            );
            
            log.info("✅ Created {} leaders", leaderRepository.count());
            
            // Create Citizens
            User citizen1 = createCitizen(
                "2222222222",
                "Test Citizen",
                "citizen1@test.com",
                "123 Main Street",
                "5",
                leader1
            );
            
            User citizen2 = createCitizen(
                "5555555555",
                "John Doe",
                "john.doe@test.com",
                "456 Park Avenue",
                "5",
                leader1
            );
            
            User citizen3 = createCitizen(
                "6666666666",
                "Jane Smith",
                "jane.smith@test.com",
                "789 Oak Road",
                "10",
                leader2
            );
            
            User citizen4 = createCitizen(
                "7777777777",
                "Bob Johnson",
                "bob.johnson@test.com",
                "321 Elm Street",
                "10",
                leader2
            );
            
            log.info("✅ Created {} citizens", userRepository.count());
            
            // Create Sample Tickets
            createTicket(
                citizen1,
                "Street Light Not Working",
                "The street light near my house has been out for 3 days",
                ComplaintType.COMPLAINT,
                ComplaintCategory.STREET_LIGHTS,
                TicketStatus.OPEN
            );
            
            createTicket(
                citizen1,
                "Pothole on Main Street",
                "Large pothole causing traffic issues",
                ComplaintType.COMPLAINT,
                ComplaintCategory.ROADS,
                TicketStatus.IN_PROGRESS
            );
            
            createTicket(
                citizen2,
                "Garbage Collection Missed",
                "Garbage has not been collected for 2 days in my area",
                ComplaintType.COMPLAINT,
                ComplaintCategory.GARBAGE_COLLECTION,
                TicketStatus.OPEN
            );
            
            createTicket(
                citizen2,
                "New Park Request",
                "Request for a new park in Ward 5",
                ComplaintType.SUGGESTION,
                ComplaintCategory.OTHER,
                TicketStatus.OPEN
            );
            
            createTicket(
                citizen3,
                "Water Leakage",
                "Water pipe leaking near Bus Stop 10",
                ComplaintType.COMPLAINT,
                ComplaintCategory.WATER_SUPPLY,
                TicketStatus.RESOLVED
            );
            
            createTicket(
                citizen3,
                "Drainage Issue",
                "Water logging during rain",
                ComplaintType.COMPLAINT,
                ComplaintCategory.DRAINAGE,
                TicketStatus.IN_PROGRESS
            );
            
            createTicket(
                citizen4,
                "Tree Trimming Required",
                "Overgrown trees blocking street view",
                ComplaintType.SUGGESTION,
                ComplaintCategory.OTHER,
                TicketStatus.OPEN
            );
            
            log.info("✅ Created {} tickets", ticketRepository.count());
            
            log.info("🎉 Test data initialization completed successfully!");
            log.info("📱 Test Accounts:");
            log.info("   Leader 1: Phone 1111111111 (Ward 5)");
            log.info("   Leader 2: Phone 3333333333 (Ward 10)");
            log.info("   Citizen 1: Phone 2222222222 (Ward 5, with tickets)");
            log.info("   Citizen 2: Phone 5555555555 (Ward 5, with tickets)");
            log.info("   Citizen 3: Phone 6666666666 (Ward 10, with tickets)");
            log.info("   Citizen 4: Phone 7777777777 (Ward 10, with ticket)");
            
        } catch (Exception e) {
            log.error("❌ Error during test data initialization: {}", e.getMessage(), e);
        }
    }
    
    private Leader createLeader(String phone, String name, String email, String jurisdiction, String designation) {
        Leader leader = new Leader();
        leader.setPhone(phone);
        leader.setName(name);
        leader.setEmail(email);
        leader.setJurisdiction(jurisdiction);
        leader.setDesignation(designation);
        leader.setActive(true);
        leader.setCreatedAt(LocalDateTime.now());
        leader.setUpdatedAt(LocalDateTime.now());
        return leaderRepository.save(leader);
    }
    
    private User createCitizen(String phone, String name, String email, String address, String wardNumber, Leader leader) {
        User user = new User();
        user.setPhone(phone);
        user.setName(name);
        user.setEmail(email);
        user.setAddress(address);
        user.setWardNumber(wardNumber);
        user.setRole(User.UserRole.CITIZEN);
        user.setAssociatedLeader(leader);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    private Ticket createTicket(User citizen, String title, String description, 
                               ComplaintType type, ComplaintCategory category, 
                               TicketStatus status) {
        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setType(type);
        ticket.setCategory(category);
        ticket.setStatus(status);
        ticket.setCitizen(citizen);
        ticket.setAssignedLeader(citizen.getAssociatedLeader());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        
        if (status == TicketStatus.RESOLVED) {
            ticket.setClosedAt(LocalDateTime.now());
            ticket.setResolutionNote("Resolved during test data initialization");
        }
        
        return ticketRepository.save(ticket);
    }
}
