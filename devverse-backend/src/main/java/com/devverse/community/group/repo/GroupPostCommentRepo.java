package com.devverse.community.group.repo;

import com.devverse.community.group.model.GroupPost;
import com.devverse.community.group.model.GroupPostComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupPostCommentRepo extends JpaRepository<GroupPostComment, Long> {

    List<GroupPostComment> findByPostOrderByCreatedAtAsc(GroupPost post);

    long countByPost(GroupPost post);
}
