package com.devverse.problem.repo;

import com.devverse.problem.model.ProblemCodeBoilerplate;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.problem.model.Language;
import com.devverse.problem.model.Problems;
import java.util.List;
import java.util.Optional;

public interface ProblemCodeBoilerplateRepo extends JpaRepository<ProblemCodeBoilerplate, Long> {
    Optional<ProblemCodeBoilerplate> findByProblemsAndLanguage(Problems problems, Language language);
    List<ProblemCodeBoilerplate> findByProblems(Problems problems);
}
