package com.devverse.problem.repo;

import com.devverse.problem.model.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.problem.model.Problem;
import java.util.List;

public interface DiscussionRepo extends JpaRepository<Discussion, Long> {
    List<Discussion> findByProblems(Problem problems);
    List<Discussion> findByParentDiscussion(Discussion parentDiscussion);
    List<Discussion> findByProblemsAndParentDiscussionIsNull(Problem problems);
}
