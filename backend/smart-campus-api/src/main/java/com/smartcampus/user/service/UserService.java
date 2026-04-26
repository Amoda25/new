package com.smartcampus.user.service;

import java.util.List;
import java.util.Optional;

import com.smartcampus.user.dto.UserProfileDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;

import com.smartcampus.security.roles.Role;
import com.smartcampus.user.model.User;
import com.smartcampus.user.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllTechnicians() {
        return userRepository.findByRole(Role.TECHNICIAN);
    }

    @Transactional(readOnly = true)
    public User authenticate(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            if (!rawPassword.equals(user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }
        }

        return user;
    }

    @Transactional
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        if (user.getRole() == null) {
            boolean adminExists = userRepository.existsByRole(Role.ADMIN);
            user.setRole(adminExists ? Role.USER : Role.ADMIN);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Unified Profile Methods
    @Transactional(readOnly = true)
    public UserProfileDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    @Transactional
    public UserProfileDTO updateProfileByEmail(String email, UserProfileDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // Update unified fields
        user.setFullLegalName(dto.getFullLegalName());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setProfilePictureUrl(dto.getProfilePictureUrl());
        user.setIdNumber(dto.getStudentId() != null ? dto.getStudentId() : dto.getLecturerId());
        user.setDegreeProgram(dto.getDegreeProgram());
        user.setCurrentYearSemester(dto.getCurrentYearSemester());
        user.setModuleName(dto.getModuleName());
        user.setModuleId(dto.getModuleId());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setCurrentResidentialAddress(dto.getCurrentResidentialAddress());
        user.setPermanentHomeAddress(dto.getPermanentHomeAddress());

        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteAccountByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.deleteById(user.getId());
    }

    private UserProfileDTO mapToDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setFullLegalName(user.getFullLegalName());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        
        // Map idNumber back to appropriate DTO fields
        if (user.getRole() == Role.LECTURER) {
            dto.setLecturerId(user.getIdNumber());
        } else {
            dto.setStudentId(user.getIdNumber());
        }
        
        dto.setDegreeProgram(user.getDegreeProgram());
        dto.setCurrentYearSemester(user.getCurrentYearSemester());
        dto.setModuleName(user.getModuleName());
        dto.setModuleId(user.getModuleId());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setCurrentResidentialAddress(user.getCurrentResidentialAddress());
        dto.setPermanentHomeAddress(user.getPermanentHomeAddress());
        
        return dto;
    }
}
