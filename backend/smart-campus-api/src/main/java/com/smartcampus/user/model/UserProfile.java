package com.smartcampus.user.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "user_profiles")
public class UserProfile {

    @Id
    private String id; // This will be the same as the User ID
    
    private String fullLegalName;
    private LocalDate dateOfBirth;
    private String profilePictureUrl;
    
    private String studentId;
    private String degreeProgram;
    private String currentYearSemester;
    
    private String phoneNumber;
    private String currentResidentialAddress;
    private String permanentHomeAddress;

    public UserProfile() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getCurrentResidentialAddress() { return currentResidentialAddress; }
    public void setCurrentResidentialAddress(String currentResidentialAddress) { this.currentResidentialAddress = currentResidentialAddress; }

    public String getPermanentHomeAddress() { return permanentHomeAddress; }
    public void setPermanentHomeAddress(String permanentHomeAddress) { this.permanentHomeAddress = permanentHomeAddress; }
}
