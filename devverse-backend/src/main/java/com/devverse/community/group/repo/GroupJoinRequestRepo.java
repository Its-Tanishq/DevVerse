package com.devverse.community.group.repo;

import com.devverse.authentication.model.User;
import com.devverse.community.group.model.GroupJoinRequest;
import com.devverse.community.group.model.JoinRequestStatus;
import com.devverse.community.group.model.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupJoinRequestRepo extends JpaRepository<GroupJoinRequest, Long> {

    List<GroupJoinRequest> findByGroupAndStatusOrderByCreatedAtDesc(StudyGroup group, JoinRequestStatus status);

    Optional<GroupJoinRequest> findByGroupAndUserAndStatus(StudyGroup group, User user, JoinRequestStatus status);

    boolean existsByGroupAndUserAndStatus(StudyGroup group, User user, JoinRequestStatus status);

    List<GroupJoinRequest> findByUserOrderByCreatedAtDesc(User user);
}
