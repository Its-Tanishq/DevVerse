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
    long countByDifficulty(Difficulty difficulty);
    Optional<Problem> findBySlug(String slug);
    List<Problem> findByDifficulty(Difficulty difficulty);
    List<Problem> findByCompanies(Company company);
    Optional<Problem> findByTitle(String title);
    List<Problem> findByTags(Tag tags);

    @Query("SELECT p FROM Problem p " +
           "WHERE (:difficulty IS NULL OR p.difficulty = :difficulty) " +
           "AND (:tag IS NULL OR EXISTS (SELECT 1 FROM p.tags t WHERE t.name = :tag)) " +
           "AND (:company IS NULL OR EXISTS (SELECT 1 FROM p.companies c WHERE c.name = :company)) " +
           "AND (:status IS NULL OR :userId IS NULL OR " +
           "(:status = 'solved' AND EXISTS (SELECT 1 FROM Submission s WHERE s.problems = p AND s.user.ID = :userId AND s.status = 'ACCEPTED')) OR " +
           "(:status = 'attempted' AND EXISTS (SELECT 1 FROM Submission s WHERE s.problems = p AND s.user.ID = :userId AND s.status != 'ACCEPTED')) OR " +
           "(:status = 'unsolved' AND NOT EXISTS (SELECT 1 FROM Submission s WHERE s.problems = p AND s.user.ID = :userId)))")
    Page<Problem> findFilteredProblems(
            @Param("difficulty") Difficulty difficulty,
            @Param("tag") String tag,
            @Param("company") String company,
            @Param("status") String status,
            @Param("userId") Long userId,
            Pageable pageable);
}
