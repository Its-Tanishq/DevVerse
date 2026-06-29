package com.devverse.problem.repo;

import com.devverse.problem.model.UserProblemWorkspace;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devverse.authentication.model.User;
import com.devverse.problem.model.Problems;
import java.util.List;
import java.util.Optional;

public interface UserProblemWorkspaceRepo extends JpaRepository<UserProblemWorkspace, Long> {
    Optional<UserProblemWorkspace> findByUserAndProblems(User user, Problems problems);
    List<UserProblemWorkspace> findByUser(User user);
}
