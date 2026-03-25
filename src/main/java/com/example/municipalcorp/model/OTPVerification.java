package com.example.municipalcorp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTPVerification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String identifier; // phone or email
    
    @Column(nullable = false)
    private String otp;
    
    @Column(nullable = false)
    private Boolean verified = false;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    
    @PrePersist
    public void setExpiry() {
        if (this.expiresAt == null) {
            this.expiresAt = LocalDateTime.now().plusMinutes(10); // OTP valid for 10 minutes
        }
    }
}
