package com.smartcampus.resource.controller;

import com.smartcampus.resource.dto.ResourceRequestDTO;
import com.smartcampus.resource.dto.ResourceResponseDTO;
import com.smartcampus.resource.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/resources")
@PreAuthorize("hasRole('ADMIN')")  // ← ADD THIS - Only ADMIN can access
public class ResourceAdminController {

    private final ResourceService resourceService;

    public ResourceAdminController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResponseEntity<ResourceResponseDTO> createResource(
            @Valid @RequestBody ResourceRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER
        
        Long adminId = Long.parseLong(userDetails.getUsername());  // ← Get admin ID from JWT
        System.out.println("Admin ID: " + adminId + " is creating a resource");
        
        ResourceResponseDTO createdResource = resourceService.createResource(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdResource);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER
        
        Long adminId = Long.parseLong(userDetails.getUsername());
        System.out.println("Admin ID: " + adminId + " is updating resource " + id);
        
        ResourceResponseDTO updatedResource = resourceService.updateResource(id, requestDTO);
        return ResponseEntity.ok(updatedResource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER
        
        Long adminId = Long.parseLong(userDetails.getUsername());
        System.out.println("Admin ID: " + adminId + " is deleting resource " + id);
        
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}