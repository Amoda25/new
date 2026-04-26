package com.smartcampus.resource.service;

import org.springframework.lang.NonNull;


import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.resource.dto.ResourceRequestDTO;
import com.smartcampus.resource.dto.ResourceResponseDTO;
import com.smartcampus.resource.model.Resource;
import com.smartcampus.resource.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<ResourceResponseDTO> getAllResources() {
        List<Resource> resources = resourceRepository.findAll();

        return resources.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public ResourceResponseDTO getResourceById(@NonNull String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        return mapToResponseDTO(resource);
    }

    public ResourceResponseDTO createResource(ResourceRequestDTO requestDTO) {
        Resource resource = new Resource();
        resource.setName(requestDTO.getName());
        resource.setType(requestDTO.getType());
        resource.setLocation(requestDTO.getLocation());
        resource.setCapacity(requestDTO.getCapacity());
        resource.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : "ACTIVE");
        resource.setDescription(requestDTO.getDescription());
        resource.setImageUrl(requestDTO.getImageUrl());

        Resource savedResource = resourceRepository.save(resource);

        return mapToResponseDTO(savedResource);
    }

    public ResourceResponseDTO updateResource(@NonNull String id, ResourceRequestDTO requestDTO) {
        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        existingResource.setName(requestDTO.getName());
        existingResource.setType(requestDTO.getType());
        existingResource.setLocation(requestDTO.getLocation());
        existingResource.setCapacity(requestDTO.getCapacity());
        existingResource.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : existingResource.getStatus());
        existingResource.setDescription(requestDTO.getDescription());
        existingResource.setImageUrl(requestDTO.getImageUrl());

        Resource updatedResource = resourceRepository.save(existingResource);

        return mapToResponseDTO(updatedResource);
    }

    public void deleteResource(@NonNull String id) {
        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resourceRepository.delete(existingResource);
    }

    private ResourceResponseDTO mapToResponseDTO(Resource resource) {
        return new ResourceResponseDTO(
                resource.getId(),
                resource.getName(),
                resource.getType(),
                resource.getLocation(),
                resource.getCapacity(),
                resource.getStatus(),
                resource.getDescription(),
                resource.getImageUrl()
        );
    }
}
