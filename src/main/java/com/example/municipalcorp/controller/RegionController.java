package com.example.municipalcorp.controller;

import com.example.municipalcorp.model.Region;
import com.example.municipalcorp.repository.RegionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/region")
@RequiredArgsConstructor
public class RegionController {

    private final RegionRepository regionRepository;

    /**
     * GET /api/region?state=Rajasthan&city=Kota
     * Returns the region row for the given city (unsaved/empty if not yet configured).
     */
    @GetMapping
    public ResponseEntity<?> getRegion(@RequestParam String state, @RequestParam String city) {
        Region region = regionRepository.findByStateAndCity(state, city)
                .orElseGet(() -> {
                    Region r = new Region();
                    r.setCountry("India");
                    r.setState(state);
                    r.setCity(city);
                    return r; // not persisted, just returned as empty
                });
        return ResponseEntity.ok(Map.of("success", true, "data", region));
    }

    /**
     * PUT /api/region?state=Rajasthan&city=Kota
     * Upserts region data for the given city.
     *
     * Propagation rules:
     *  - mlaImageUrl / mlaName : saved only for this city
     *  - cmImageUrl  / cmName  : saved for this city AND propagated to all other cities in the same state
     *  - pmImageUrl  / pmName  : saved for this city AND propagated to all regions in the country
     */
    @PutMapping
    @Transactional
    public ResponseEntity<?> saveRegion(@RequestParam String state,
                                        @RequestParam String city,
                                        @RequestBody Region incoming) {

        // Find or create region for this city
        Region region = regionRepository.findByStateAndCity(state, city)
                .orElseGet(() -> {
                    Region r = new Region();
                    r.setCountry("India");
                    r.setState(state);
                    r.setCity(city);
                    return r;
                });

        // MLA/MP — city-specific only
        region.setMlaName(incoming.getMlaName());
        region.setMlaImageUrl(incoming.getMlaImageUrl());

        // CM — this city + propagate to all other cities in same state
        region.setCmName(incoming.getCmName());
        region.setCmImageUrl(incoming.getCmImageUrl());

        // PM — this city + propagate to all other regions
        region.setPmName(incoming.getPmName());
        region.setPmImageUrl(incoming.getPmImageUrl());

        regionRepository.save(region);

        // Propagate CM to all other cities in the same state
        if (incoming.getCmImageUrl() != null || incoming.getCmName() != null) {
            regionRepository.findByState(state).stream()
                    .filter(r -> !r.getCity().equals(city))
                    .forEach(r -> {
                        r.setCmImageUrl(incoming.getCmImageUrl());
                        r.setCmName(incoming.getCmName());
                        regionRepository.save(r);
                    });
        }

        // Propagate PM to all other regions in the country
        if (incoming.getPmImageUrl() != null || incoming.getPmName() != null) {
            regionRepository.findAll().stream()
                    .filter(r -> !r.getCity().equals(city))
                    .forEach(r -> {
                        r.setPmImageUrl(incoming.getPmImageUrl());
                        r.setPmName(incoming.getPmName());
                        regionRepository.save(r);
                    });
        }

        return ResponseEntity.ok(Map.of("success", true, "data", region));
    }
}
