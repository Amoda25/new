package com.smartcampus.user.model;

import com.smartcampus.security.roles.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {

    @Id
    private String id;


    public User() {
    }

    private String email;
    private String name;
    private String password;
    private Role role;
    private String googleId;
    private String specialization;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private String idNumber;
    private String department;
    
    // Profile Fields merged from UserProfile
    private String fullLegalName;
    private java.time.LocalDate dateOfBirth;
    private String profilePictureUrl;
    private String studentId;
    private String degreeProgram;
    private String currentYearSemester;
    private String moduleName;
    private String moduleId;
    private String lecturerId;
    private String phoneNumber;
    private String currentResidentialAddress;
    private String permanentHomeAddress;


    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public String getGoogleId() {
        return googleId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    // New Profile Getters and Setters
    public String getFullLegalName() { return fullLegalName; }
    public void setFullLegalName(String fullLegalName) { this.fullLegalName = fullLegalName; }

    public java.time.LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(java.time.LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getDegreeProgram() { return degreeProgram; }
    public void setDegreeProgram(String degreeProgram) { this.degreeProgram = degreeProgram; }

    public String getCurrentYearSemester() { return currentYearSemester; }
    public void setCurrentYearSemester(String currentYearSemester) { this.currentYearSemester = currentYearSemester; }

    public String getModuleName() { return moduleName; }
    public void setModuleName(String moduleName) { this.moduleName = moduleName; }

    public String getModuleId() { return moduleId; }
    public void setModuleId(String moduleId) { this.moduleId = moduleId; }

    public String getLecturerId() { return lecturerId; }
    public void setLecturerId(String lecturerId) { this.lecturerId = lecturerId; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getCurrentResidentialAddress() { return currentResidentialAddress; }
    public void setCurrentResidentialAddress(String currentResidentialAddress) { this.currentResidentialAddress = currentResidentialAddress; }

    public String getPermanentHomeAddress() { return permanentHomeAddress; }
    public void setPermanentHomeAddress(String permanentHomeAddress) { this.permanentHomeAddress = permanentHomeAddress; }
}