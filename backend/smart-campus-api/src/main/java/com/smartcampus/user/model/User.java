package com.smartcampus.user.model;

import com.smartcampus.security.roles.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String email;
    private String name;
    private String password;
    private Role role;
    private String googleId;
    private String specialization;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    
    // Academic & Personal Details (Merged from UserProfile)
    private String idNumber; // Used for Student ID or Lecturer ID
    private String department;
    private String fullLegalName;
    private LocalDate dateOfBirth;
    private String profilePictureUrl;
    
    private String degreeProgram;
    private String currentYearSemester;
    
    // Lecturer specific fields
    private String moduleName;
    private String moduleId;
    
    private String phoneNumber;
    private String currentResidentialAddress;
    private String permanentHomeAddress;

    public User() {
    }

    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getFullLegalName() { return fullLegalName; }
    public void setFullLegalName(String fullLegalName) { this.fullLegalName = fullLegalName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getDegreeProgram() { return degreeProgram; }
    public void setDegreeProgram(String degreeProgram) { this.degreeProgram = degreeProgram; }

    public String getCurrentYearSemester() { return currentYearSemester; }
    public void setCurrentYearSemester(String currentYearSemester) { this.currentYearSemester = currentYearSemester; }

    public String getModuleName() { return moduleName; }
    public void setModuleName(String moduleName) { this.moduleName = moduleName; }

    public String getModuleId() { return moduleId; }
    public void setModuleId(String moduleId) { this.moduleId = moduleId; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getCurrentResidentialAddress() { return currentResidentialAddress; }
    public void setCurrentResidentialAddress(String currentResidentialAddress) { this.currentResidentialAddress = currentResidentialAddress; }

    public String getPermanentHomeAddress() { return permanentHomeAddress; }
    public void setPermanentHomeAddress(String permanentHomeAddress) { this.permanentHomeAddress = permanentHomeAddress; }
}