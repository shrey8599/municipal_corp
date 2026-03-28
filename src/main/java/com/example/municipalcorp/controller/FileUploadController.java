package com.example.municipalcorp.controller;

import com.example.municipalcorp.dto.ApiResponse;
import com.example.municipalcorp.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "File Upload", description = "Image upload endpoints for complaints")
@SecurityRequirement(name = "Bearer Authentication")
public class FileUploadController {
    
    private final FileStorageService fileStorageService;
    
    @PostMapping("/upload")
    @Operation(summary = "Upload single image", description = "Upload a single image file for complaint")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file) {
        
        log.info("File upload request: {}", file.getOriginalFilename());
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Please select a file to upload"));
        }
        
        if (!fileStorageService.isValidImageFile(file)) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Only image files (JPEG, PNG, WebP, GIF) are allowed"));
        }
        
        String fileUrl = fileStorageService.storeFile(file);
        
        Map<String, String> data = new HashMap<>();
        data.put("url", fileUrl);
        data.put("originalName", file.getOriginalFilename());
        data.put("size", String.valueOf(file.getSize()));
        
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", data));
    }
    
    @PostMapping("/upload-multiple")
    @Operation(summary = "Upload multiple images", description = "Upload multiple image files for complaint")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> uploadMultipleFiles(
            @RequestParam("files") MultipartFile[] files) {
        
        log.info("Multiple file upload request: {} files", files.length);
        
        List<Map<String, String>> uploadedFiles = new ArrayList<>();
        
        for (MultipartFile file : files) {
            if (!file.isEmpty() && fileStorageService.isValidImageFile(file)) {
                String fileUrl = fileStorageService.storeFile(file);
                
                Map<String, String> fileInfo = new HashMap<>();
                fileInfo.put("url", fileUrl);
                fileInfo.put("originalName", file.getOriginalFilename());
                fileInfo.put("size", String.valueOf(file.getSize()));
                
                uploadedFiles.add(fileInfo);
            }
        }
        
        return ResponseEntity.ok(ApiResponse.success(
            uploadedFiles.size() + " files uploaded successfully", 
            uploadedFiles));
    }
}
