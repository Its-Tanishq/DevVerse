package com.devverse.problem.repo;

import com.devverse.problem.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepo extends JpaRepository<Company, Long> {
    Optional<Company> findByName(String name);
}
