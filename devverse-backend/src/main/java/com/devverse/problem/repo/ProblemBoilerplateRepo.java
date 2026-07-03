package com.devverse.problem.repo;

import com.devverse.problem.model.ProblemBoilerplate;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.problem.model.Language;
import com.devverse.problem.model.Problem;
import java.util.List;
import java.util.Optional;

public interface ProblemBoilerplateRepo extends JpaRepository<ProblemBoilerplate, Long> {
    Optional<ProblemBoilerplate> findByProblemsAndLanguage(Problem problems, Language language);
    List<ProblemBoilerplate> findByProblems(Problem problems);
}
