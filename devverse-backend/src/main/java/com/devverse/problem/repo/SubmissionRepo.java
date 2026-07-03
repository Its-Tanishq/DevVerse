package com.devverse.problem.repo;

import com.devverse.problem.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.authentication.model.User;
import com.devverse.problem.model.Problem;
import java.util.List;

public interface SubmissionRepo extends JpaRepository<Submission, Long> {
    List<Submission> findByUserAndProblems(User user, Problem problems);
    List<Submission> findByUser(User user);
    List<Submission> findByProblems(Problem problems);
}
