package com.example.municipalcorp.controller;

import com.example.municipalcorp.dto.ApiResponse;
import com.example.municipalcorp.model.Leader;
import com.example.municipalcorp.service.LeaderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/leaders")
@RequiredArgsConstructor
@Slf4j
public class LeaderController {
    
    private final LeaderService leaderService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Leader>>> getAllLeaders(
            @RequestParam(required = false) String jurisdiction) {
        
        List<Leader> leaders;
        if (jurisdiction != null) {
            log.info("Fetching leaders for jurisdiction: {}", jurisdiction);
            leaders = leaderService.getLeadersByJurisdiction(jurisdiction);
        } else {
            log.info("Fetching all active leaders");
            leaders = leaderService.getAllActiveLeaders();
        }
        
        return ResponseEntity.ok(ApiResponse.success("Leaders retrieved successfully", leaders));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Leader>> getLeaderById(@PathVariable Long id) {
        log.info("Fetching leader: {}", id);
        Leader leader = leaderService.getLeaderById(id);
        
        return ResponseEntity.ok(ApiResponse.success("Leader retrieved successfully", leader));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Leader>> createLeader(@Valid @RequestBody Leader leader) {
        log.info("Creating leader: {}", leader.getName());
        Leader created = leaderService.createLeader(leader);
        
        return ResponseEntity.ok(ApiResponse.success("Leader created successfully", created));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Leader>> updateLeader(
            @PathVariable Long id,
            @Valid @RequestBody Leader leader) {
        
        log.info("Updating leader: {}", id);
        Leader updated = leaderService.updateLeader(id, leader);
        
        return ResponseEntity.ok(ApiResponse.success("Leader updated successfully", updated));
    }
    
    @PatchMapping("/{id}/profile-picture")
    public ResponseEntity<ApiResponse<Leader>> updateProfilePicture(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request) {
        
        String imageUrl = request.get("profilePictureUrl");
        log.info("Updating profile picture for leader: {} with URL: {}", id, imageUrl);
        Leader updated = leaderService.updateProfilePicture(id, imageUrl);
        
        return ResponseEntity.ok(ApiResponse.success("Profile picture updated successfully", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivateLeader(@PathVariable Long id) {
        log.info("Deactivating leader: {}", id);
        leaderService.deactivateLeader(id);
        
        return ResponseEntity.ok(ApiResponse.success("Leader deactivated successfully", null));
    }
}
