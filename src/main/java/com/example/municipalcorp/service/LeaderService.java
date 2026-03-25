package com.example.municipalcorp.service;

import com.example.municipalcorp.model.Leader;
import com.example.municipalcorp.repository.LeaderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderService {
    
    private final LeaderRepository leaderRepository;
    
    public List<Leader> getAllActiveLeaders() {
        return leaderRepository.findByActiveTrue();
    }
    
    public Leader getLeaderById(Long id) {
        return leaderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Leader not found"));
    }
    
    public Leader getLeaderByIdentifier(String identifier) {
        return identifier.contains("@")
            ? leaderRepository.findByEmail(identifier)
                .orElseThrow(() -> new RuntimeException("Leader not found"))
            : leaderRepository.findByPhone(identifier)
                .orElseThrow(() -> new RuntimeException("Leader not found"));
    }
    
    public List<Leader> getLeadersByJurisdiction(String jurisdiction) {
        return leaderRepository.findByJurisdiction(jurisdiction);
    }
    
    @Transactional
    public Leader createLeader(Leader leader) {
        leader.setActive(true);
        Leader savedLeader = leaderRepository.save(leader);
        log.info("Leader created: {} ({})", savedLeader.getName(), savedLeader.getJurisdiction());
        return savedLeader;
    }
    
    @Transactional
    public Leader updateLeader(Long id, Leader leaderData) {
        Leader existing = getLeaderById(id);
        
        existing.setName(leaderData.getName());
        existing.setPhone(leaderData.getPhone());
        existing.setEmail(leaderData.getEmail());
        existing.setJurisdiction(leaderData.getJurisdiction());
        existing.setDesignation(leaderData.getDesignation());
        
        return leaderRepository.save(existing);
    }
    
    @Transactional
    public Leader updateProfilePicture(Long id, String imageUrl) {
        Leader existing = getLeaderById(id);
        existing.setProfilePictureUrl(imageUrl);
        Leader updated = leaderRepository.save(existing);
        log.info("Profile picture updated for leader: {}", id);
        return updated;
    }
    
    @Transactional
    public void deactivateLeader(Long id) {
        Leader leader = getLeaderById(id);
        leader.setActive(false);
        leaderRepository.save(leader);
        log.info("Leader deactivated: {}", id);
    }
}
