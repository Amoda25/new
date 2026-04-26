package com.smartcampus.user.controller;

import com.smartcampus.user.dto.ProfileDTO;
import com.smartcampus.user.service.UserService;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user/profile")
public class ProfileController {

    private final UserService userService;
    private final com.smartcampus.common.service.FileStorageService fileStorageService;

    public ProfileController(UserService userService, com.smartcampus.common.service.FileStorageService fileStorageService) {
        this.userService = userService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.getProfileByEmail(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<ProfileDTO> updateProfile(org.springframework.security.core.Authentication authentication, @RequestBody ProfileDTO dto) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.updateProfileByEmail(authentication.getName(), dto));
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
    public ResponseEntity<Void> deleteAccount(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        userService.deleteAccountByEmail(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
