package com.devverse.problem.repo;

import com.devverse.problem.model.Companies;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompaniesRepo extends JpaRepository<Companies, Long> {
    Optional<Companies> findByName(String name);
}
