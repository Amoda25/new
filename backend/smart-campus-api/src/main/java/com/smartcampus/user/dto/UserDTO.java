package com.smartcampus.user.dto;

public class UserDTO {
    private String id;
    private String name;
    private String email;
    private String role;
    private String idNumber;
    private String department;

    public UserDTO() {}

    public UserDTO(String id, String name, String email, String role, String idNumber, String department) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.idNumber = idNumber;
        this.department = department;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
