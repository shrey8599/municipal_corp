package com.example.municipalcorp.service;

import com.example.municipalcorp.model.OTPVerification;
import com.example.municipalcorp.repository.OTPVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OTPService {
    
    private final OTPVerificationRepository otpRepository;
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;
    
    @Transactional
    public String generateAndSendOTP(String identifier) {
        // Generate 6-digit OTP
        String otp = generateOTP();
        
        // Save OTP to database
        OTPVerification otpVerification = new OTPVerification();
        otpVerification.setIdentifier(identifier);
        otpVerification.setOtp(otp);
        otpVerification.setVerified(false);
        otpVerification.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        
        otpRepository.save(otpVerification);
        log.info("✅ OTP generated and saved for {}: {} (expires in {} minutes)", identifier, otp, OTP_EXPIRY_MINUTES);
        
        // In production, integrate with SMS/Email service
        // For development, log the OTP
        log.info("📱 OTP for {}: {}", identifier, otp);
        log.debug("🔐 OTP Details - Identifier: {}, OTP: {}, Expiry: {} minutes", 
            identifier, otp, OTP_EXPIRY_MINUTES);
        
        // Mock sending OTP
        sendOTP(identifier, otp);
        
        return otp; // In production, don't return OTP in response
    }
    
    @Transactional
    public boolean verifyOTP(String identifier, String otp) {
        var otpRecord = otpRepository
            .findTopByIdentifierAndVerifiedFalseOrderByCreatedAtDesc(identifier)
            .orElse(null);
        
        if (otpRecord == null) {
            log.warn("No OTP found for identifier: {}", identifier);
            return false;
        }
        
        if (otpRecord.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("OTP expired for identifier: {}", identifier);
            return false;
        }
        
        if (!otpRecord.getOtp().equals(otp)) {
            log.warn("Invalid OTP for identifier: {}", identifier);
            return false;
        }
        
        // Mark as verified
        otpRecord.setVerified(true);
        otpRepository.save(otpRecord);
        
        log.info("OTP verified successfully for: {}", identifier);
        return true;
    }
    
    @Transactional
    public void cleanupExpiredOTPs() {
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
    
    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    
    private void sendOTP(String identifier, String otp) {
        // Mock implementation
        // In production, integrate with:
        // - SMS: Twilio, AWS SNS, etc.
        // - Email: SendGrid, AWS SES, etc.
        
        if (identifier.contains("@")) {
            log.info("Sending OTP via Email to: {}", identifier);
            // emailService.send(identifier, "Your OTP", "Your OTP is: " + otp);
        } else {
            log.info("Sending OTP via SMS to: {}", identifier);
            // smsService.send(identifier, "Your OTP is: " + otp);
        }
    }
}
