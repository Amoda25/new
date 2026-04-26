package com.smartcampus.user.service;

import com.smartcampus.user.dto.UserProfileDTO;
import com.smartcampus.user.model.User;
import com.smartcampus.user.model.UserProfile;
import com.smartcampus.user.repository.UserProfileRepository;
import com.smartcampus.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    public UserProfileDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getProfile(user.getId());
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
        deleteAccount(user.getId());
    }

    public UserProfileDTO getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findByEmail(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with ID or Email: " + userId)));

        UserProfile profile = userProfileRepository.findById(user.getId())
                .orElseGet(() -> {
                    // Create a blank profile if it doesn't exist
                    UserProfile newProfile = new UserProfile();
                    newProfile.setId(user.getId());
                    return userProfileRepository.save(newProfile);
                });

        return mapToDTO(user, profile);
    }

    @Transactional
    public UserProfileDTO updateProfile(String userId, UserProfileDTO dto) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findByEmail(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with ID or Email: " + userId)));

        UserProfile profile = userProfileRepository.findById(user.getId())
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile();
                    newProfile.setId(user.getId());
                    return newProfile;
                });

        // Update User fields (Email is usually fixed or requires special verification, so we only update name here)
        if (dto.getName() != null) {
            user.setName(dto.getName());
            userRepository.save(user);
        }

        // Update Profile fields
        profile.setFullLegalName(dto.getFullLegalName());
        profile.setDateOfBirth(dto.getDateOfBirth());
        profile.setProfilePictureUrl(dto.getProfilePictureUrl());
        profile.setStudentId(dto.getStudentId());
        profile.setDegreeProgram(dto.getDegreeProgram());
        profile.setCurrentYearSemester(dto.getCurrentYearSemester());
        profile.setPhoneNumber(dto.getPhoneNumber());
        profile.setCurrentResidentialAddress(dto.getCurrentResidentialAddress());
        profile.setPermanentHomeAddress(dto.getPermanentHomeAddress());

        UserProfile savedProfile = userProfileRepository.save(profile);
        return mapToDTO(user, savedProfile);
    }

    @Transactional
    public void deleteAccount(String userId) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findByEmail(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with ID or Email: " + userId)));
        
        userRepository.deleteById(user.getId());
        userProfileRepository.deleteById(user.getId());
    }

    private UserProfileDTO mapToDTO(User user, UserProfile profile) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        
        dto.setFullLegalName(profile.getFullLegalName());
        dto.setDateOfBirth(profile.getDateOfBirth());
        dto.setProfilePictureUrl(profile.getProfilePictureUrl());
        dto.setStudentId(profile.getStudentId());
        dto.setDegreeProgram(profile.getDegreeProgram());
        dto.setCurrentYearSemester(profile.getCurrentYearSemester());
        dto.setPhoneNumber(profile.getPhoneNumber());
        dto.setCurrentResidentialAddress(profile.getCurrentResidentialAddress());
        dto.setPermanentHomeAddress(profile.getPermanentHomeAddress());
        
        return dto;
    }

}
