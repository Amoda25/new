package com.smartcampus.user.service;

import com.smartcampus.user.dto.UserProfileDTO;
import com.smartcampus.user.model.User;
import com.smartcampus.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.lang.NonNull;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    @Transactional
    public UserProfileDTO updateProfileByEmail(String email, UserProfileDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return updateProfile(user.getId(), dto);
    }

    @Transactional
    public void deleteAccountByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.deleteById(user.getId());
    }

    public UserProfileDTO getProfile(@NonNull String userId) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findByEmail(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with ID or Email: " + userId)));

        return mapToDTO(user);
    }

    @Transactional
    public UserProfileDTO updateProfile(@NonNull String userId, UserProfileDTO dto) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findByEmail(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with ID or Email: " + userId)));

        // Update core fields
        if (dto.getName() != null) {
            user.setName(dto.getName());
        }
        
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // Update profile fields in User model
        user.setFullLegalName(dto.getFullLegalName());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setProfilePictureUrl(dto.getProfilePictureUrl());
        user.setStudentId(dto.getStudentId());
        user.setDegreeProgram(dto.getDegreeProgram());
        user.setCurrentYearSemester(dto.getCurrentYearSemester());
        user.setModuleName(dto.getModuleName());
        user.setModuleId(dto.getModuleId());
        user.setLecturerId(dto.getLecturerId());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setCurrentResidentialAddress(dto.getCurrentResidentialAddress());
        user.setPermanentHomeAddress(dto.getPermanentHomeAddress());

        User savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }

    @Transactional
    public void deleteAccount(@NonNull String userId) {
        userRepository.deleteById(userId);
    }

    private UserProfileDTO mapToDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        
        dto.setFullLegalName(user.getFullLegalName());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setStudentId(user.getStudentId());
        dto.setDegreeProgram(user.getDegreeProgram());
        dto.setCurrentYearSemester(user.getCurrentYearSemester());
        
        dto.setModuleName(user.getModuleName());
        dto.setModuleId(user.getModuleId());
        dto.setLecturerId(user.getLecturerId());
        
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setCurrentResidentialAddress(user.getCurrentResidentialAddress());
        dto.setPermanentHomeAddress(user.getPermanentHomeAddress());
        
        return dto;
    }
}
