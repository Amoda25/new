package com.smartcampus.user.controller;

import com.smartcampus.security.jwt.JwtService;


import com.smartcampus.user.model.User;
import com.smartcampus.user.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostConstruct
    public void init() {
        System.out.println("DEBUG: AuthController has been successfully loaded into the Spring Context.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody com.smartcampus.user.dto.LoginRequest loginRequest) {
        System.out.println("AUTH: Login request received for " + loginRequest.getEmail());
        try {
            User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtService.generateToken(user);
            System.out.println("AUTH: Login successful for " + loginRequest.getEmail());
            return ResponseEntity.ok(new com.smartcampus.user.dto.AuthResponse(token, user.getRole().name()));
        } catch (RuntimeException e) {
            System.err.println("AUTH: Login failed for " + loginRequest.getEmail() + " : " + e.getMessage());
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody com.smartcampus.user.dto.RegisterRequest registerRequest) {
        System.out.println("AUTH: Register request received for " + registerRequest.getEmail());
        try {
            User user = new User();
            user.setName(registerRequest.getName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setIdNumber(registerRequest.getIdNumber());
            user.setDepartment(registerRequest.getDepartment());
            
            if (registerRequest.getRole() != null && !registerRequest.getRole().isEmpty()) {

                try {
                    user.setRole(com.smartcampus.security.roles.Role.valueOf(registerRequest.getRole().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    System.err.println("AUTH: Invalid role provided: " + registerRequest.getRole());
                }
            }
            
            userService.registerUser(user);
            System.out.println("AUTH: Registration successful for " + registerRequest.getEmail());
            return ResponseEntity.ok("User registered successfully");
        } catch (RuntimeException e) {
            System.err.println("AUTH: Registration failed for " + registerRequest.getEmail() + " : " + e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
