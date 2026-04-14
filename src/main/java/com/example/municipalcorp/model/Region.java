package com.example.municipalcorp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Stores the political representative hierarchy for a city.
 *
 * Hierarchy:
 *  - mlaImageUrl / mlaName : MP or MLA — specific to this city only
 *  - cmImageUrl  / cmName  : Chief Minister — propagated to all cities in the same state
 *  - pmImageUrl  / pmName  : Prime Minister — propagated to all regions in the country
 */
@Entity
@Table(name = "region",
       uniqueConstraints = @UniqueConstraint(columnNames = {"country", "state", "city"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String country = "India";

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String city;

    // MP / MLA — city-specific
    private String mlaName;
    @Lob
    private String mlaImageUrl;

    // Chief Minister — state-level (auto-propagated to all cities in same state on save)
    private String cmName;
    @Lob
    private String cmImageUrl;

    // Prime Minister — national (auto-propagated to all regions on save)
    private String pmName;
    @Lob
    private String pmImageUrl;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
