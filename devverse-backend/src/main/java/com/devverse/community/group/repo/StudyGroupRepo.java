package com.devverse.community.group.repo;

import com.devverse.authentication.model.User;
import com.devverse.community.group.model.GroupPrivacy;
import com.devverse.community.group.model.StudyGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudyGroupRepo extends JpaRepository<StudyGroup, Long> {

    Optional<StudyGroup> findByInviteCode(String inviteCode);

    boolean existsByInviteCode(String inviteCode);

    Page<StudyGroup> findByPrivacy(GroupPrivacy privacy, Pageable pageable);

    @Query("SELECT g FROM StudyGroup g WHERE g.privacy = :privacy AND " +
            "(LOWER(g.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(g.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<StudyGroup> searchByPrivacyAndKeyword(@Param("privacy") GroupPrivacy privacy,
                                              @Param("query") String query,
                                              Pageable pageable);

    @Query("SELECT gm.group FROM GroupMember gm WHERE gm.user = :user ORDER BY gm.joinedAt DESC")
    List<StudyGroup> findGroupsByUser(@Param("user") User user);
}
