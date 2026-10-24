package com.devverse.community.group.repo;

import com.devverse.authentication.model.User;
import com.devverse.community.group.model.GroupMember;
import com.devverse.community.group.model.GroupRole;
import com.devverse.community.group.model.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepo extends JpaRepository<GroupMember, Long> {

    Optional<GroupMember> findByGroupAndUser(StudyGroup group, User user);

    boolean existsByGroupAndUser(StudyGroup group, User user);

    List<GroupMember> findByGroupOrderByJoinedAtAsc(StudyGroup group);

    long countByGroup(StudyGroup group);

    long countByGroupAndRole(StudyGroup group, GroupRole role);

    Optional<GroupMember> findFirstByGroupAndRoleNotOrderByJoinedAtAsc(StudyGroup group, GroupRole role);

    void deleteByGroupAndUser(StudyGroup group, User user);
}
