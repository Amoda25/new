package com.smartcampus.resource.controller;

import com.smartcampus.resource.dto.ResourceResponseDTO;
import com.smartcampus.resource.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.List;

@RestController
@RequestMapping("/api/user/resources")
public class ResourceUserController {

    private final ResourceService resourceService;

    public ResourceUserController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources(
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER (optional)
        
        String userId = userDetails.getUsername();  // ← Get user ID from JWT
        System.out.println("User ID: " + userId + " is viewing all resources");
        
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(
            @PathVariable @NonNull String id,
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER (optional)
        
        String userId = userDetails.getUsername();
        System.out.println("User ID: " + userId + " is viewing resource " + id);
        
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }
}
