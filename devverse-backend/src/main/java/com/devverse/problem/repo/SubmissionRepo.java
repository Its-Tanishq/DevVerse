package com.devverse.problem.repo;

import com.devverse.problem.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.authentication.model.User;
import com.devverse.problem.model.Problem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubmissionRepo extends JpaRepository<Submission, Long> {
    List<Submission> findByUserAndProblems(User user, Problem problems);
    List<Submission> findByUser(User user);
    List<Submission> findByProblems(Problem problems);

    @Query("SELECT p.difficulty, COUNT(DISTINCT p.id) FROM Submission s JOIN s.problems p WHERE s.user.id = :userId AND s.status = 'ACCEPTED' GROUP BY p.difficulty")
    List<Object[]> countAcceptedProblemsByDifficulty(@Param("userId") Long userId);
}
