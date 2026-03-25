package com.example.municipalcorp.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "news")
@Data
public class News {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 2000)
    private String content;
    
    @ElementCollection
    @CollectionTable(name = "news_images", joinColumns = @JoinColumn(name = "news_id"))
    @Column(name = "image_url", length = 500)
    private List<String> imageUrls = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "leader_id", nullable = false)
    private Leader author;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "news_likes", joinColumns = @JoinColumn(name = "news_id"))
    @Column(name = "user_id")
    private Set<Long> likedByUserIds = new HashSet<>();
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public int getLikesCount() {
        return likedByUserIds != null ? likedByUserIds.size() : 0;
    }
    
    public boolean isLikedBy(Long userId) {
        return likedByUserIds != null && likedByUserIds.contains(userId);
    }
    
    public void addLike(Long userId) {
        if (likedByUserIds == null) {
            likedByUserIds = new HashSet<>();
        }
        likedByUserIds.add(userId);
    }
    
    public void removeLike(Long userId) {
        if (likedByUserIds != null) {
            likedByUserIds.remove(userId);
        }
    }
}
