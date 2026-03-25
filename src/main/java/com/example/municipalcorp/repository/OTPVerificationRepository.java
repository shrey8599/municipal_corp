package com.example.municipalcorp.repository;

import com.example.municipalcorp.model.OTPVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OTPVerificationRepository extends JpaRepository<OTPVerification, Long> {
    Optional<OTPVerification> findTopByIdentifierAndVerifiedFalseOrderByCreatedAtDesc(String identifier);
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
