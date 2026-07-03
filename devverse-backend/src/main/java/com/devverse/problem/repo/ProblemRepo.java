package com.devverse.problem.repo;

import com.devverse.problem.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.problem.model.Company;
import com.devverse.problem.model.Difficulty;
import java.util.List;
import java.util.Optional;
import com.devverse.problem.model.Tag;

public interface ProblemRepo extends JpaRepository<Problem, Long> {
    Optional<Problem> findBySlug(String slug);
    List<Problem> findByDifficulty(Difficulty difficulty);
    List<Problem> findByCompanies(Company company);
    Optional<Problem> findByTitle(String title);
    List<Problem> findByTags(Tag tags);
}
