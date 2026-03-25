package com.example.municipalcorp.service;

import com.example.municipalcorp.dto.UserRegistrationDTO;
import com.example.municipalcorp.model.Leader;
import com.example.municipalcorp.model.User;
import com.example.municipalcorp.repository.LeaderRepository;
import com.example.municipalcorp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private LeaderRepository leaderRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void testRegisterCitizen_WithValidData_ShouldCreateUser() {
        // Given
        String identifier = "9876543210";
        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setName("John Doe");
        dto.setPhone("9876543210");
        dto.setEmail("john@example.com");
        dto.setAddress("123 Main St");
        dto.setWardNumber("Ward-15");
        dto.setLeaderId(1L);
        
        Leader leader = new Leader();
        leader.setId(1L);
        leader.setName("Rajesh Kumar");
        
        when(userRepository.findByPhone(identifier)).thenReturn(Optional.empty());
        when(leaderRepository.findById(1L)).thenReturn(Optional.of(leader));
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User user = i.getArgument(0);
            user.setId(1L);
            return user;
        });
        
        // When
        User result = userService.registerCitizen(dto, identifier);
        
        // Then
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("9876543210", result.getPhone());
        assertEquals(User.UserRole.CITIZEN, result.getRole());
        assertTrue(result.getActive());
        assertNotNull(result.getAssociatedLeader());
        verify(userRepository, times(1)).save(any(User.class));
    }
    
    @Test
    void testRegisterCitizen_WithExistingUser_ShouldThrowException() {
        // Given
        String identifier = "9876543210";
        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setPhone("9876543210");
        
        User existingUser = new User();
        existingUser.setId(1L);
        
        when(userRepository.findByPhone(identifier)).thenReturn(Optional.of(existingUser));
        
        // When & Then
        assertThrows(RuntimeException.class, () -> userService.registerCitizen(dto, identifier));
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void testGetUserById_WithValidId_ShouldReturnUser() {
        // Given
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        user.setName("John Doe");
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        
        // When
        User result = userService.getUserById(userId);
        
        // Then
        assertNotNull(result);
        assertEquals(userId, result.getId());
        assertEquals("John Doe", result.getName());
    }
    
    @Test
    void testGetUserById_WithInvalidId_ShouldThrowException() {
        // Given
        Long userId = 999L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(RuntimeException.class, () -> userService.getUserById(userId));
    }
    
    @Test
    void testIsRegistered_WithPhoneNumber_ShouldReturnTrue() {
        // Given
        String phone = "9876543210";
        when(userRepository.existsByPhone(phone)).thenReturn(true);
        
        // When
        boolean result = userService.isRegistered(phone);
        
        // Then
        assertTrue(result);
    }
    
    @Test
    void testIsRegistered_WithEmail_ShouldReturnTrue() {
        // Given
        String email = "john@example.com";
        when(userRepository.existsByEmail(email)).thenReturn(true);
        
        // When
        boolean result = userService.isRegistered(email);
        
        // Then
        assertTrue(result);
    }
    
    @Test
    void testUpdateAssociatedLeader_WithValidIds_ShouldUpdateLeader() {
        // Given
        Long userId = 1L;
        Long leaderId = 2L;
        
        User user = new User();
        user.setId(userId);
        
        Leader newLeader = new Leader();
        newLeader.setId(leaderId);
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leaderRepository.findById(leaderId)).thenReturn(Optional.of(newLeader));
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // When
        User result = userService.updateAssociatedLeader(userId, leaderId);
        
        // Then
        assertNotNull(result);
        assertEquals(newLeader, result.getAssociatedLeader());
        verify(userRepository, times(1)).save(user);
    }
}
