package com.example.municipalcorp.service;

import com.example.municipalcorp.model.OTPVerification;
import com.example.municipalcorp.repository.OTPVerificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OTPServiceTest {
    
    @Mock
    private OTPVerificationRepository otpRepository;
    
    @InjectMocks
    private OTPService otpService;
    
    @Test
    void testGenerateAndSendOTP_ShouldReturnSixDigitOTP() {
        // Given
        String identifier = "9876543210";
        when(otpRepository.save(any(OTPVerification.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // When
        String otp = otpService.generateAndSendOTP(identifier);
        
        // Then
        assertNotNull(otp);
        assertEquals(6, otp.length());
        assertTrue(otp.matches("\\d{6}"));
        verify(otpRepository, times(1)).save(any(OTPVerification.class));
    }
    
    @Test
    void testVerifyOTP_WithValidOTP_ShouldReturnTrue() {
        // Given
        String identifier = "9876543210";
        String otp = "123456";
        
        OTPVerification otpRecord = new OTPVerification();
        otpRecord.setIdentifier(identifier);
        otpRecord.setOtp(otp);
        otpRecord.setVerified(false);
        otpRecord.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        
        when(otpRepository.findTopByIdentifierAndVerifiedFalseOrderByCreatedAtDesc(identifier))
            .thenReturn(Optional.of(otpRecord));
        when(otpRepository.save(any(OTPVerification.class))).thenReturn(otpRecord);
        
        // When
        boolean result = otpService.verifyOTP(identifier, otp);
        
        // Then
        assertTrue(result);
        verify(otpRepository, times(1)).save(otpRecord);
    }
    
    @Test
    void testVerifyOTP_WithExpiredOTP_ShouldReturnFalse() {
        // Given
        String identifier = "9876543210";
        String otp = "123456";
        
        OTPVerification otpRecord = new OTPVerification();
        otpRecord.setIdentifier(identifier);
        otpRecord.setOtp(otp);
        otpRecord.setVerified(false);
        otpRecord.setExpiresAt(LocalDateTime.now().minusMinutes(5)); // Expired
        
        when(otpRepository.findTopByIdentifierAndVerifiedFalseOrderByCreatedAtDesc(identifier))
            .thenReturn(Optional.of(otpRecord));
        
        // When
        boolean result = otpService.verifyOTP(identifier, otp);
        
        // Then
        assertFalse(result);
        verify(otpRepository, never()).save(any(OTPVerification.class));
    }
    
    @Test
    void testVerifyOTP_WithInvalidOTP_ShouldReturnFalse() {
        // Given
        String identifier = "9876543210";
        String correctOtp = "123456";
        String wrongOtp = "654321";
        
        OTPVerification otpRecord = new OTPVerification();
        otpRecord.setIdentifier(identifier);
        otpRecord.setOtp(correctOtp);
        otpRecord.setVerified(false);
        otpRecord.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        
        when(otpRepository.findTopByIdentifierAndVerifiedFalseOrderByCreatedAtDesc(identifier))
            .thenReturn(Optional.of(otpRecord));
        
        // When
        boolean result = otpService.verifyOTP(identifier, wrongOtp);
        
        // Then
        assertFalse(result);
        verify(otpRepository, never()).save(any(OTPVerification.class));
    }
    
    @Test
    void testVerifyOTP_WithNoOTPRecord_ShouldReturnFalse() {
        // Given
        String identifier = "9876543210";
        String otp = "123456";
        
        when(otpRepository.findTopByIdentifierAndVerifiedFalseOrderByCreatedAtDesc(identifier))
            .thenReturn(Optional.empty());
        
        // When
        boolean result = otpService.verifyOTP(identifier, otp);
        
        // Then
        assertFalse(result);
        verify(otpRepository, never()).save(any(OTPVerification.class));
    }
    
    @Test
    void testCleanupExpiredOTPs_ShouldCallRepository() {
        // When
        otpService.cleanupExpiredOTPs();
        
        // Then
        verify(otpRepository, times(1)).deleteByExpiresAtBefore(any(LocalDateTime.class));
    }
}
