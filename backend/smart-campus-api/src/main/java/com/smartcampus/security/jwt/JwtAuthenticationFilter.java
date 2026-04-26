package com.smartcampus.security.jwt;

import org.springframework.lang.NonNull;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    
    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }
    
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        String path = request.getRequestURI();
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("DEBUG: JwtFilter detected Bearer token for path: " + path);
            
            if (jwtService.validateToken(token)) {
                String userId = jwtService.extractUserId(token);
                String role = jwtService.extractRole(token);
                
                if (userId != null) {
                    // Create authorities list
                    java.util.List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = new java.util.ArrayList<>();
                    if (role != null && !role.isEmpty()) {
                        String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(roleWithPrefix));
                    }

                    UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                        userId, "", authorities
                    );
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("DEBUG: JwtFilter set authentication for user: " + userId + " with role: " + role);
                }
            }

        }
        
        filterChain.doFilter(request, response);
    }
}