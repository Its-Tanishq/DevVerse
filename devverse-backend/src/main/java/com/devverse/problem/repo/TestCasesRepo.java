package com.devverse.problem.repo;

import com.devverse.problem.model.TestCases;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.problem.model.Problems;
import java.util.List;

public interface TestCasesRepo extends JpaRepository<TestCases, Long> {
    List<TestCases> findByProblems(Problems problems);
    List<TestCases> findByProblemsAndIsHiddenFalse(Problems problems);
}
