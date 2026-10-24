package com.devverse.community.group.repo;

import com.devverse.authentication.model.User;
import com.devverse.community.group.model.GroupPost;
import com.devverse.community.group.model.GroupPostLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupPostLikeRepo extends JpaRepository<GroupPostLike, Long> {

    Optional<GroupPostLike> findByPostAndUser(GroupPost post, User user);

    boolean existsByPostAndUser(GroupPost post, User user);

    long countByPost(GroupPost post);

    void deleteByPostAndUser(GroupPost post, User user);
}
