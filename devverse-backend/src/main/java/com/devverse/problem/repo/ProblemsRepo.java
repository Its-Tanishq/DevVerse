package com.devverse.problem.repo;

import com.devverse.problem.model.Problems;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.problem.model.Company;
import com.devverse.problem.model.Difficulty;
import java.util.List;
import java.util.Optional;
import com.devverse.problem.model.Tags;

public interface ProblemsRepo extends JpaRepository<Problems, Long> {
    Optional<Problems> findBySlug(String slug);
    List<Problems> findByDifficulty(Difficulty difficulty);
    List<Problems> findByCompanies(Company company);
    Optional<Problems> findByTitle(String title);
    List<Problems> findByTags(Tags tags);
}
