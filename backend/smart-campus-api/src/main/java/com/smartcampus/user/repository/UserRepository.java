package com.smartcampus.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartcampus.security.roles.Role;
import com.smartcampus.user.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByRole(Role role);
    long countByRole(Role role);

    Optional<User> findFirstByRole(Role role);  /////new
    List<User> findByRole(Role role);   ///
}