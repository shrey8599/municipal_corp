package com.example.municipalcorp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "leaders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"assignedTickets"})
public class Leader {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String phone;
    
    @Column(unique = true)
    private String email;
    
    @NotBlank(message = "Jurisdiction is required")
    private String jurisdiction; // Ward or area
    
    private String state; // State like Rajasthan, Maharashtra, etc.
    
    private String city; // City like Jaipur, Mumbai, etc.
    
    private String designation;
    
    private String profilePictureUrl;

    /**
     * GeoJSON polygon string defining the ward boundary for geo-fencing.
     * Example: {"type":"Polygon","coordinates":[[[lon,lat],...]]}
     */
    @Column(columnDefinition = "TEXT")
    private String geoFence;

    @Column(nullable = false)
    private Boolean active = true;
    
    @OneToMany(mappedBy = "assignedLeader", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ticket> assignedTickets = new ArrayList<>();
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
