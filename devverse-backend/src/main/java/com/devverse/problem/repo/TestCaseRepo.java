package com.devverse.problem.repo;

import com.devverse.problem.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.problem.model.Problem;
import java.util.List;

public interface TestCaseRepo extends JpaRepository<TestCase, Long> {
    List<TestCase> findByProblems(Problem problems);
    List<TestCase> findByProblemsAndIsHiddenFalse(Problem problems);
}
