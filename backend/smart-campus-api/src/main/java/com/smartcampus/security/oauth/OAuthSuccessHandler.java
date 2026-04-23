package com.smartcampus.security.oauth;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.smartcampus.security.jwt.JwtService;
import com.smartcampus.security.roles.Role;
import com.smartcampus.user.model.User;
import com.smartcampus.user.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public OAuthSuccessHandler(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");

        boolean adminExists = userRepository.findAll().stream()
                .anyMatch(user -> user.getRole() == Role.ADMIN);

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setGoogleId(googleId);

                    if (!adminExists && userRepository.count() == 0) {
                        newUser.setRole(Role.ADMIN);
                    } else {
                        newUser.setRole(Role.USER);
                    }

                    return userRepository.save(newUser);
                });

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String jwt = jwtService.generateToken(user);
        String role = user.getRole().name();

        String redirectUrl = "http://localhost:5173/oauth-success?token=" + jwt + "&role=" + role;

        System.out.println("JWT = " + jwt);
        System.out.println("ROLE = " + role);
        System.out.println("REDIRECT URL = " + redirectUrl);
        
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}