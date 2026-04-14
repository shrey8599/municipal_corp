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
    private final RegionRepository regionRepository;

    @Override
    public void run(String... args) {
        log.info("🔄 Checking test data...");        try {
            // Create Leaders only if they don't already exist (idempotent)
            Leader leader1 = leaderRepository.findByPhone("1111111111").orElseGet(() -> createLeader(
                "1111111111",
                "Ward Officer - Ward 5",
                "officer.ward5@municipal.gov",
                "5",
                "Ward Officer",
                "Rajasthan",
                "Kota"
            ));
            
            Leader leader2 = leaderRepository.findByPhone("3333333333").orElseGet(() -> createLeader(
                "3333333333",
                "Ward Officer - Ward 10",
                "officer.ward10@municipal.gov",
                "10",
                "Ward Officer",
                "Rajasthan",
                "Jaipur"
            ));
            
            log.info("✅ Leaders: {}", leaderRepository.count());
            
            // Create Citizens only if they don't already exist
            User citizen1 = userRepository.findByPhone("2222222222").orElseGet(() -> createCitizen(
                "2222222222",
                "Test Citizen",
                "citizen1@test.com",
                "123 Main Street",
                "5",
                leader1,
                "Rajasthan",
                "Kota"
            ));
            
            User citizen2 = userRepository.findByPhone("5555555555").orElseGet(() -> createCitizen(
                "5555555555",
                "John Doe",
                "john.doe@test.com",
                "456 Park Avenue",
                "5",
                leader1,
                "Rajasthan",
                "Kota"
            ));
            
            User citizen3 = userRepository.findByPhone("6666666666").orElseGet(() -> createCitizen(
                "6666666666",
                "Jane Smith",
                "jane.smith@test.com",
                "789 Oak Road",
                "10",
                leader2,
                "Rajasthan",
                "Jaipur"
            ));
            
            User citizen4 = userRepository.findByPhone("7777777777").orElseGet(() -> createCitizen(
                "7777777777",
                "Bob Johnson",
                "bob.johnson@test.com",
                "321 Elm Street",
                "10",
                leader2,
                "Rajasthan",
                "Jaipur"
            ));
            
            log.info("✅ Users: {}", userRepository.count());
            
            // Only seed sample tickets if none exist yet (preserves any runtime-created tickets)
            if (ticketRepository.count() == 0) {
                createTicket(citizen1, "Street Light Not Working", "The street light near my house has been out for 3 days",
                    ComplaintType.COMPLAINT, ComplaintCategory.STREET_LIGHTS, TicketStatus.OPEN);
                createTicket(citizen1, "Pothole on Main Street", "Large pothole causing traffic issues",
                    ComplaintType.COMPLAINT, ComplaintCategory.ROADS, TicketStatus.IN_PROGRESS);
                createTicket(citizen2, "Garbage Collection Missed", "Garbage has not been collected for 2 days in my area",
                    ComplaintType.COMPLAINT, ComplaintCategory.GARBAGE_COLLECTION, TicketStatus.OPEN);
                createTicket(citizen2, "New Park Request", "Request for a new park in Ward 5",
                    ComplaintType.SUGGESTION, ComplaintCategory.OTHER, TicketStatus.OPEN);
                createTicket(citizen3, "Water Leakage", "Water pipe leaking near Bus Stop 10",
                    ComplaintType.COMPLAINT, ComplaintCategory.WATER_SUPPLY, TicketStatus.RESOLVED);
                createTicket(citizen3, "Drainage Issue", "Water logging during rain",
                    ComplaintType.COMPLAINT, ComplaintCategory.DRAINAGE, TicketStatus.IN_PROGRESS);
                createTicket(citizen4, "Tree Trimming Required", "Overgrown trees blocking street view",
                    ComplaintType.SUGGESTION, ComplaintCategory.OTHER, TicketStatus.OPEN);
                log.info("✅ Seeded {} sample tickets", ticketRepository.count());
            } else {
                log.info("✅ Tickets already exist ({}), skipping seed", ticketRepository.count());
            }
            
            // Create Super Admin only if not already present
            User superAdmin = userRepository.findByPhone("9999999999").orElseGet(() -> createSuperAdmin(
                "9999999999",
                "Super Admin",
                "superadmin@municipal.gov"
            ));
            // Ensure existing super admin has state/city set (idempotent)
            if (superAdmin.getState() == null || superAdmin.getState().isEmpty()) {
                superAdmin.setState("Rajasthan");
                superAdmin.setCity("Kota");
                userRepository.save(superAdmin);
            }
            
            // Seed region rows (idempotent — only creates if missing)
            seedRegion("India", "Rajasthan", "Kota");
            seedRegion("India", "Rajasthan", "Jaipur");
            log.info("✅ Regions: {}", regionRepository.count());

            log.info("🎉 Data initialization complete.");
            log.info("📱 Test Accounts:");
            log.info("   Super Admin: Phone 9999999999 (Email: superadmin@municipal.gov)");
            log.info("   Leader 1: Phone 1111111111 (Ward 5)");
            log.info("   Leader 2: Phone 3333333333 (Ward 10)");
            log.info("   Citizen 1: Phone 2222222222 (Ward 5, with tickets)");
            log.info("   Citizen 2: Phone 5555555555 (Ward 5, with tickets)");
            log.info("   Citizen 3: Phone 6666666666 (Ward 10, with tickets)");
            log.info("   Citizen 4: Phone 7777777777 (Ward 10, with ticket)");
            
        } catch (Exception e) {
            log.error("❌ Error during data initialization: {}", e.getMessage(), e);
        }
    }
    
    private Leader createLeader(String phone, String name, String email, String jurisdiction, String designation, String state, String city) {
        Leader leader = new Leader();
        leader.setPhone(phone);
        leader.setName(name);
        leader.setEmail(email);
        leader.setJurisdiction(jurisdiction);
        leader.setDesignation(designation);
        leader.setState(state);
        leader.setCity(city);
        leader.setActive(true);
        leader.setCreatedAt(LocalDateTime.now());
        leader.setUpdatedAt(LocalDateTime.now());
        return leaderRepository.save(leader);
    }
    
    private User createCitizen(String phone, String name, String email, String address, String wardNumber, Leader leader, String state, String city) {
        User user = new User();
        user.setPhone(phone);
        user.setName(name);
        user.setEmail(email);
        user.setAddress(address);
        user.setWardNumber(wardNumber);
        user.setRole(User.UserRole.CITIZEN);
        user.setAssociatedLeader(leader);
        user.setState(state);
        user.setCity(city);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    private User createSuperAdmin(String phone, String name, String email) {
        User superAdmin = new User();
        superAdmin.setPhone(phone);
        superAdmin.setName(name);
        superAdmin.setEmail(email);
        superAdmin.setRole(User.UserRole.SUPER_ADMIN);
        superAdmin.setState("Rajasthan");
        superAdmin.setCity("Kota");
        superAdmin.setActive(true);
        superAdmin.setCreatedAt(LocalDateTime.now());
        superAdmin.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(superAdmin);
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

    private void seedRegion(String country, String state, String city) {
        regionRepository.findByStateAndCity(state, city).orElseGet(() -> {
            Region r = new Region();
            r.setCountry(country);
            r.setState(state);
            r.setCity(city);
            return regionRepository.save(r);
        });
    }
}
