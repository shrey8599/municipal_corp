package com.example.municipalcorp.repository;

import com.example.municipalcorp.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    
    List<News> findByAuthorIdOrderByCreatedAtDesc(Long leaderId);
    
    List<News> findAllByOrderByCreatedAtDesc();
}
