package com.devverse.problem.repo;

import com.devverse.problem.model.ProblemTags;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.problem.model.Problems;
import com.devverse.problem.model.Tags;
import java.util.List;

public interface ProblemTagsRepo extends JpaRepository<ProblemTags, Long> {
    List<ProblemTags> findByProblems(Problems problems);
    List<ProblemTags> findByTags(Tags tags);
}
