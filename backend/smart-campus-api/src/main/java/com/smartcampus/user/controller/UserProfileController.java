package com.smartcampus.user.controller;

import com.smartcampus.user.dto.UserProfileDTO;
import com.smartcampus.user.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userProfileService.getProfile(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<UserProfileDTO> updateProfile(org.springframework.security.core.Authentication authentication, @RequestBody UserProfileDTO dto) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userProfileService.updateProfile(authentication.getName(), dto));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        userProfileService.deleteAccount(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
