package com.smartcampus.user.dto;

import java.time.LocalDate;

public class ProfileDTO {
    private String id;
    private String email; // From User model
    private String name;  // From User model
    
    private String fullLegalName;
    private LocalDate dateOfBirth;
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
    private String password;

    public ProfileDTO() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFullLegalName() { return fullLegalName; }
    public void setFullLegalName(String fullLegalName) { this.fullLegalName = fullLegalName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

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

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
