package com.example.municipalcorp.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import net.coobird.thumbnailator.Thumbnails;

@Service
@Slf4j
public class FileStorageService {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    public String storeFile(MultipartFile file) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = FilenameUtils.getExtension(originalFilename);
            String newFilename = UUID.randomUUID().toString() + "." + extension;
            
            // Store file with compression
            Path targetLocation = uploadPath.resolve(newFilename);
            compressAndStoreImage(file.getInputStream(), targetLocation, extension);
            
            long fileSizeKB = Files.size(targetLocation) / 1024;
            log.info("File stored and compressed: {} (Size: {}KB)", newFilename, fileSizeKB);
            
            // Return relative URL to access the file (works with localhost, IP, and domain names)
            return "/uploads/" + newFilename;
            
        } catch (IOException e) {
            log.error("Failed to store file: {}", e.getMessage());
            throw new RuntimeException("Failed to store file", e);
        }
    }
    
    /**
     * Compress and store image with quality optimization
     * Reduces image size significantly while maintaining visual quality
     */
    private void compressAndStoreImage(InputStream inputStream, Path targetLocation, String extension) {
        try {
            // Determine format and quality based on extension
            String format = extension.toLowerCase().equals("png") ? "png" : "jpg";
            float quality = extension.toLowerCase().equals("png") ? 1.0f : 0.75f;
            
            // Resize and compress: max width/height 1500px
            // JPG quality 0.75 reduces size 70-80%, PNG at full quality
            Thumbnails.of(inputStream)
                .size(1500, 1500)
                .outputFormat(format)
                .outputQuality(quality)
                .toFile(targetLocation.toFile());
                
        } catch (IOException e) {
            log.error("Failed to compress image: {}", e.getMessage());
            // Fallback: save without compression if compression fails
            try {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
                log.warn("Image saved without compression due to error");
            } catch (IOException fallbackError) {
                throw new RuntimeException("Failed to store image", fallbackError);
            }
        }
    }
    
    public void deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
            log.info("File deleted: {}", filename);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", e.getMessage());
        }
    }
    
    public boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && 
               (contentType.equals("image/jpeg") || 
                contentType.equals("image/png") || 
                contentType.equals("image/jpg") ||
                contentType.equals("image/gif"));
    }
}
