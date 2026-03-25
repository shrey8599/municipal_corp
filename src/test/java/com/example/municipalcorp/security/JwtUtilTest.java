package com.example.municipalcorp.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {
    
    private JwtUtil jwtUtil;
    
    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", 
            "mySecretKeyForJWTTokenGenerationMustBeLongEnoughForHS256Algorithm");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);
    }
    
    @Test
    void testGenerateToken_ShouldCreateValidToken() {
        // Given
        Long userId = 1L;
        String identifier = "9876543210";
        String role = "CITIZEN";
        
        // When
        String token = jwtUtil.generateToken(userId, identifier, role);
        
        // Then
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }
    
    @Test
    void testExtractIdentifier_ShouldReturnCorrectIdentifier() {
        // Given
        Long userId = 1L;
        String identifier = "9876543210";
        String role = "CITIZEN";
        String token = jwtUtil.generateToken(userId, identifier, role);
        
        // When
        String extractedIdentifier = jwtUtil.extractIdentifier(token);
        
        // Then
        assertEquals(identifier, extractedIdentifier);
    }
    
    @Test
    void testExtractUserId_ShouldReturnCorrectUserId() {
        // Given
        Long userId = 1L;
        String identifier = "9876543210";
        String role = "CITIZEN";
        String token = jwtUtil.generateToken(userId, identifier, role);
        
        // When
        Long extractedUserId = jwtUtil.extractUserId(token);
        
        // Then
        assertEquals(userId, extractedUserId);
    }
    
    @Test
    void testExtractRole_ShouldReturnCorrectRole() {
        // Given
        Long userId = 1L;
        String identifier = "9876543210";
        String role = "CITIZEN";
        String token = jwtUtil.generateToken(userId, identifier, role);
        
        // When
        String extractedRole = jwtUtil.extractRole(token);
        
        // Then
        assertEquals(role, extractedRole);
    }
    
    @Test
    void testValidateToken_WithValidToken_ShouldReturnTrue() {
        // Given
        Long userId = 1L;
        String identifier = "9876543210";
        String role = "CITIZEN";
        String token = jwtUtil.generateToken(userId, identifier, role);
        
        // When
        Boolean isValid = jwtUtil.validateToken(token);
        
        // Then
        assertTrue(isValid);
    }
    
    @Test
    void testValidateToken_WithInvalidToken_ShouldReturnFalse() {
        // Given
        String invalidToken = "invalid.token.here";
        
        // When
        Boolean isValid = jwtUtil.validateToken(invalidToken);
        
        // Then
        assertFalse(isValid);
    }
    
    @Test
    void testIsTokenExpired_WithFreshToken_ShouldReturnFalse() {
        // Given
        Long userId = 1L;
        String identifier = "9876543210";
        String role = "CITIZEN";
        String token = jwtUtil.generateToken(userId, identifier, role);
        
        // When
        Boolean isExpired = jwtUtil.isTokenExpired(token);
        
        // Then
        assertFalse(isExpired);
    }
}
