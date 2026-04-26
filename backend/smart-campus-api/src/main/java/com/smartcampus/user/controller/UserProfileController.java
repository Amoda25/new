package com.smartcampus.user.controller;

import com.smartcampus.user.dto.UserProfileDTO;
import com.smartcampus.user.service.UserProfileService;
import com.smartcampus.common.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final FileStorageService fileStorageService;

    public UserProfileController(UserProfileService userProfileService, FileStorageService fileStorageService) {
        this.userProfileService = userProfileService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    @SuppressWarnings("null")
    public ResponseEntity<UserProfileDTO> getProfile(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userProfileService.getProfile(authentication.getName()));
    }

    @PutMapping
    @SuppressWarnings("null")
    public ResponseEntity<UserProfileDTO> updateProfile(org.springframework.security.core.Authentication authentication, @RequestBody UserProfileDTO dto) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userProfileService.updateProfile(authentication.getName(), dto));
    }

    @PostMapping("/image")
    public ResponseEntity<String> uploadProfilePicture(org.springframework.security.core.Authentication authentication, @RequestParam("file") MultipartFile file) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        String imageUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(imageUrl);
    }

    @DeleteMapping
    @SuppressWarnings("null")
    public ResponseEntity<Void> deleteAccount(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        userProfileService.deleteAccount(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
