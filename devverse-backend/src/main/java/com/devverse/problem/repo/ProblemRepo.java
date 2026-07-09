package com.devverse.problem.repo;

import com.devverse.problem.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.problem.model.Company;
import com.devverse.problem.model.Difficulty;
import java.util.List;
import java.util.Optional;
import com.devverse.problem.model.Tag;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProblemRepo extends JpaRepository<Problem, Long> {
    Optional<Problem> findBySlug(String slug);
    List<Problem> findByDifficulty(Difficulty difficulty);
    List<Problem> findByCompanies(Company company);
    Optional<Problem> findByTitle(String title);
    List<Problem> findByTags(Tag tags);

    @Query("SELECT DISTINCT p FROM Problem p " +
           "LEFT JOIN p.tags t " +
           "LEFT JOIN p.companies c " +
           "WHERE (:difficulty IS NULL OR p.difficulty = :difficulty) " +
           "AND (:tag IS NULL OR t.name = :tag) " +
           "AND (:company IS NULL OR c.name = :company)")
    Page<Problem> findFilteredProblems(
            @Param("difficulty") Difficulty difficulty,
            @Param("tag") String tag,
            @Param("company") String company,
            Pageable pageable);
}
