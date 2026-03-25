package com.example.municipalcorp.repository;

import com.example.municipalcorp.model.Leader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaderRepository extends JpaRepository<Leader, Long> {
    Optional<Leader> findByPhone(String phone);
    Optional<Leader> findByEmail(String email);
    List<Leader> findByActiveTrue();
    List<Leader> findByJurisdiction(String jurisdiction);
}
