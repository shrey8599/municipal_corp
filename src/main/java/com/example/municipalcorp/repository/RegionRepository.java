package com.example.municipalcorp.repository;

import com.example.municipalcorp.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
    Optional<Region> findByStateAndCity(String state, String city);
    List<Region> findByState(String state);
    List<Region> findByCountry(String country);
}
