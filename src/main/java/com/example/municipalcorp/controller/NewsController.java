package com.example.municipalcorp.controller;

import com.example.municipalcorp.dto.ApiResponse;
import com.example.municipalcorp.model.News;
import com.example.municipalcorp.service.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "News", description = "News and announcements management")
public class NewsController {
    
    private final NewsService newsService;
    
    @GetMapping
    @Operation(summary = "Get all news", description = "Retrieve all news ordered by most recent")
    public ResponseEntity<ApiResponse<List<News>>> getAllNews() {
        List<News> news = newsService.getAllNews();
        return ResponseEntity.ok(ApiResponse.success("News retrieved successfully", news));
    }
    
    @GetMapping("/leader/{leaderId}")
    @Operation(summary = "Get news by leader", description = "Retrieve all news posted by a specific leader")
    public ResponseEntity<ApiResponse<List<News>>> getNewsByLeader(@PathVariable Long leaderId) {
        List<News> news = newsService.getNewsByLeader(leaderId);
        return ResponseEntity.ok(ApiResponse.success("News retrieved successfully", news));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get news by ID", description = "Retrieve a specific news item")
    public ResponseEntity<ApiResponse<News>> getNewsById(@PathVariable Long id) {
        News news = newsService.getNewsById(id);
        return ResponseEntity.ok(ApiResponse.success("News retrieved successfully", news));
    }
    
    @PostMapping
    @Operation(summary = "Create news", description = "Create a new news item (Leaders only)")
    public ResponseEntity<ApiResponse<News>> createNews(@RequestBody Map<String, Object> request) {
        Long leaderId = Long.valueOf(request.get("leaderId").toString());
        String title = (String) request.get("title");
        String content = (String) request.get("content");
        
        @SuppressWarnings("unchecked")
        List<String> imageUrls = (List<String>) request.get("imageUrls");
        
        News news = newsService.createNews(leaderId, title, content, imageUrls);
        return ResponseEntity.ok(ApiResponse.success("News created successfully", news));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update news", description = "Update an existing news item")
    public ResponseEntity<ApiResponse<News>> updateNews(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        
        String title = (String) request.get("title");
        String content = (String) request.get("content");
        
        @SuppressWarnings("unchecked")
        List<String> imageUrls = (List<String>) request.get("imageUrls");
        
        News news = newsService.updateNews(id, title, content, imageUrls);
        return ResponseEntity.ok(ApiResponse.success("News updated successfully", news));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete news", description = "Delete a news item")
    public ResponseEntity<ApiResponse<Void>> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.ok(ApiResponse.success("News deleted successfully", null));
    }
    
    @PostMapping("/{id}/like")
    @Operation(summary = "Toggle like", description = "Like or unlike a news item")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleLike(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        
        Object userIdObj = request.get("userId");
        if (userIdObj == null) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("userId is required"));
        }
        Long userId = Long.valueOf(userIdObj.toString());
        String role = request.getOrDefault("role", "CITIZEN").toString();
        
        // Namespace IDs by role to avoid collision between leader and citizen ID spaces.
        // Leaders are stored as negative IDs, citizens as positive.
        Long storageId = "LEADER".equalsIgnoreCase(role) ? -userId : userId;
        
        News news = newsService.toggleLikeByStorageId(id, storageId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("newsId", news.getId());
        response.put("likesCount", news.getLikesCount());
        response.put("isLiked", news.getLikedByUserIds().contains(storageId));
        response.put("storageId", storageId);
        
        return ResponseEntity.ok(ApiResponse.success("Like toggled successfully", response));
    }
}
