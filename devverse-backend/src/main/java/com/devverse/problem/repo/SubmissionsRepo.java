package com.devverse.problem.repo;

import com.devverse.problem.model.Submissions;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.authentication.model.User;
import com.devverse.problem.model.Problems;
import java.util.List;

public interface SubmissionsRepo extends JpaRepository<Submissions, Long> {
    List<Submissions> findByUserAndProblems(User user, Problems problems);
    List<Submissions> findByUser(User user);
    List<Submissions> findByProblems(Problems problems);
}
