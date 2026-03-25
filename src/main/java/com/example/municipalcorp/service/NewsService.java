package com.example.municipalcorp.service;

import com.example.municipalcorp.model.Leader;
import com.example.municipalcorp.model.News;
import com.example.municipalcorp.repository.LeaderRepository;
import com.example.municipalcorp.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {
    
    private final NewsRepository newsRepository;
    private final LeaderRepository leaderRepository;
    
    public List<News> getAllNews() {
        return newsRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<News> getNewsByLeader(Long leaderId) {
        return newsRepository.findByAuthorIdOrderByCreatedAtDesc(leaderId);
    }
    
    public News getNewsById(Long id) {
        return newsRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("News not found with id: " + id));
    }
    
    @Transactional
    public News createNews(Long leaderId, String title, String content, List<String> imageUrls) {
        Leader leader = leaderRepository.findById(leaderId)
            .orElseThrow(() -> new RuntimeException("Leader not found with id: " + leaderId));
        
        News news = new News();
        news.setTitle(title);
        news.setContent(content);
        if (imageUrls != null && !imageUrls.isEmpty()) {
            news.setImageUrls(imageUrls);
        }
        news.setAuthor(leader);
        
        return newsRepository.save(news);
    }
    
    @Transactional
    public News updateNews(Long newsId, String title, String content, List<String> imageUrls) {
        News news = getNewsById(newsId);
        news.setTitle(title);
        news.setContent(content);
        if (imageUrls != null && !imageUrls.isEmpty()) {
            news.setImageUrls(imageUrls);
        }
        return newsRepository.save(news);
    }
    
    @Transactional
    public void deleteNews(Long newsId) {
        newsRepository.deleteById(newsId);
    }
    
    @Transactional
    public News toggleLikeByStorageId(Long newsId, Long storageId) {
        News news = getNewsById(newsId);
        
        if (news.getLikedByUserIds().contains(storageId)) {
            news.removeLike(storageId);
        } else {
            news.addLike(storageId);
        }
        
        return newsRepository.save(news);
    }
}
