package com.example.municipalcorp.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileUploadService {
    
    @Value("${file.upload.dir:uploads/profile-pictures}")
    private String uploadDir;
    
    @Value("${file.upload.max-size:5242880}") // 5MB default
    private long maxFileSize;
    
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif"
    );
    
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        ".jpg", ".jpeg", ".png", ".webp", ".gif"
    );
    
    @PostConstruct
    public void init() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory: {}", uploadPath.toAbsolutePath());
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }
    
    public String uploadFile(MultipartFile file) throws IOException {
        // Validate file
        validateFile(file);
        
        // Generate unique filename with proper extension
        String originalFilename = file.getOriginalFilename();
        String extension = ".jpg";  // Default extension
        
        if (originalFilename != null && originalFilename.contains(".")) {
            String ext = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            // Use the original extension if it's valid
            if (ALLOWED_EXTENSIONS.contains(ext)) {
                extension = ext;
            } else {
                // For files without extension or invalid extension, determine from MIME type
                String contentType = file.getContentType();
                if (contentType != null) {
                    contentType = contentType.toLowerCase();
                    if (contentType.contains("png")) {
                        extension = ".png";
                    } else if (contentType.contains("webp")) {
                        extension = ".webp";
                    } else if (contentType.contains("gif")) {
                        extension = ".gif";
                    }
                    // default to .jpg for any JPEG type
                }
            }
        }
        
        String filename = UUID.randomUUID().toString() + extension;
        
        // Save file
        Path targetLocation = Paths.get(uploadDir).resolve(filename);
        long bytesCopied = Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        log.info("File uploaded successfully: {} ({}bytes, extension: {})", filename, bytesCopied, extension);
        
        // Return URL path
        return "/" + uploadDir + "/" + filename;
    }
    
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("File size exceeds maximum allowed size of " + (maxFileSize / 1024 / 1024) + "MB");
        }
        
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename();
        
        // Check content type (primary validation)
        boolean isValidContentType = contentType != null && ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase());
        
        // Check file extension as fallback (important for mobile camera captures)
        boolean isValidExtension = false;
        if (filename != null) {
            String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
            isValidExtension = ALLOWED_EXTENSIONS.contains(extension);
        }
        
        // Accept if either content type OR extension is valid (handles mobile camera quirks)
        if (!isValidContentType && !isValidExtension) {
            throw new RuntimeException("File type not allowed. Only JPEG, PNG, WebP, and GIF images are accepted. (File: " + filename + ", Type: " + contentType + ")");
        }
    }
    
    public boolean isValidImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }
        
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename();
        
        // Check content type (primary validation)
        boolean isValidContentType = contentType != null && ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase());
        
        // Check file extension as fallback (important for mobile camera captures)
        boolean isValidExtension = false;
        if (filename != null) {
            String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
            isValidExtension = ALLOWED_EXTENSIONS.contains(extension);
        }
        
        // Accept if either content type OR extension is valid
        return isValidContentType || isValidExtension;
    }
    
    // Alias method for consistency with controller calls
    public String storeFile(MultipartFile file) throws IOException {
        return uploadFile(file);
    }
    
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }
        
        try {
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
            log.info("File deleted: {}", filename);
        } catch (IOException e) {
            log.error("Error deleting file: {}", fileUrl, e);
        }
    }
}
