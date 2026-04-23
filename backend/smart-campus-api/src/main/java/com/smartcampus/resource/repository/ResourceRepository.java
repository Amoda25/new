package com.smartcampus.resource.repository;

import com.smartcampus.resource.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
}