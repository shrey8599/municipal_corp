package com.example.municipalcorp.service;

import com.example.municipalcorp.dto.UserRegistrationDTO;
import com.example.municipalcorp.model.Leader;
import com.example.municipalcorp.model.User;
import com.example.municipalcorp.repository.LeaderRepository;
import com.example.municipalcorp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final LeaderRepository leaderRepository;
    
    @Transactional
    public User registerCitizen(UserRegistrationDTO dto, String identifier) {
        // Check if user already exists
        Optional<User> existing = identifier.contains("@") 
            ? userRepository.findByEmail(identifier)
            : userRepository.findByPhone(identifier);
        
        if (existing.isPresent()) {
            throw new RuntimeException("User already registered");
        }
        
        User user = new User();
        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
        user.setAddress(dto.getAddress());
        user.setWardNumber(dto.getWardNumber());
        user.setRole(User.UserRole.CITIZEN);
        user.setActive(true);
        
        // Associate with leader if provided
        if (dto.getLeaderId() != null) {
            Leader leader = leaderRepository.findById(dto.getLeaderId())
                .orElseThrow(() -> new RuntimeException("Leader not found"));
            user.setAssociatedLeader(leader);
        }
        
        User savedUser = userRepository.save(user);
        log.info("Citizen registered: {} ({})", savedUser.getName(), identifier);
        
        return savedUser;
    }
    
    public User getUserByIdentifier(String identifier) {
        return identifier.contains("@")
            ? userRepository.findByEmail(identifier)
                .orElseThrow(() -> new RuntimeException("User not found"))
            : userRepository.findByPhone(identifier)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Transactional
    public User updateUserProfile(Long userId, UserRegistrationDTO dto) {
        User user = getUserById(userId);
        
        user.setName(dto.getName());
        user.setAddress(dto.getAddress());
        // Ward number cannot be changed after registration for security reasons
        // user.setWardNumber(dto.getWardNumber());
        
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(dto.getEmail());
        }
        
        if (dto.getPhone() != null && !dto.getPhone().equals(user.getPhone())) {
            if (userRepository.existsByPhone(dto.getPhone())) {
                throw new RuntimeException("Phone already in use");
            }
            user.setPhone(dto.getPhone());
        }
        
        return userRepository.save(user);
    }
    
    @Transactional
    public User updateAssociatedLeader(Long userId, Long leaderId) {
        User user = getUserById(userId);
        Leader leader = leaderRepository.findById(leaderId)
            .orElseThrow(() -> new RuntimeException("Leader not found"));
        
        user.setAssociatedLeader(leader);
        log.info("User {} associated with leader {}", userId, leaderId);
        
        return userRepository.save(user);
    }
    
    public boolean isRegistered(String identifier) {
        return identifier.contains("@")
            ? userRepository.existsByEmail(identifier)
            : userRepository.existsByPhone(identifier);
    }
    
    @Transactional
    public User updateProfilePicture(Long userId, String imageUrl) {
        User user = getUserById(userId);
        user.setProfilePictureUrl(imageUrl);
        log.info("Profile picture updated for user: {}", userId);
        return userRepository.save(user);
    }
}
