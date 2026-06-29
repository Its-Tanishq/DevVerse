package com.devverse.problem.repo;

import com.devverse.problem.model.Discussions;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.problem.model.Problems;
import java.util.List;

public interface DiscussionsRepo extends JpaRepository<Discussions, Long> {
    List<Discussions> findByProblems(Problems problems);
    List<Discussions> findByParentDiscussion(Discussions parentDiscussion);
    List<Discussions> findByProblemsAndParentDiscussionIsNull(Problems problems);
}
