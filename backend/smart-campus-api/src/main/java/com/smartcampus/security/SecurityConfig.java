package com.smartcampus.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


import com.smartcampus.security.jwt.JwtAuthEntryPoint;
import com.smartcampus.security.jwt.JwtAuthenticationFilter;
import com.smartcampus.security.jwt.JwtService;
import com.smartcampus.security.oauth.OAuthSuccessHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtService jwtService;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final OAuthSuccessHandler oAuthSuccessHandler;

    public SecurityConfig(JwtService jwtService,
                          JwtAuthEntryPoint jwtAuthEntryPoint,
                          OAuthSuccessHandler oAuthSuccessHandler) {
        this.jwtService = jwtService;
        this.jwtAuthEntryPoint = jwtAuthEntryPoint;
        this.oAuthSuccessHandler = oAuthSuccessHandler;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/oauth2/**", "/login/**").permitAll()
                .requestMatchers("/api/test/**", "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Be very explicit about the profile endpoint
                .requestMatchers("/api/user/profile/image").authenticated()
                .requestMatchers("/api/user/profile/**").authenticated()
                .requestMatchers("/api/user/profile").authenticated()
                
                // Generic rules
                .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN", "LECTURER")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/technician/**").hasRole("TECHNICIAN")
                
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2.successHandler(oAuthSuccessHandler))
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000", "http://localhost:5173", "http://localhost:5174", 
            "http://localhost:5175", "http://localhost:5176",
            "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174", 
            "http://127.0.0.1:5175", "http://127.0.0.1:5176"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}