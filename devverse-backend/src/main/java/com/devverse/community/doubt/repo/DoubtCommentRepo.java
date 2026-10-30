package com.devverse.community.doubt.repo;

import com.devverse.community.doubt.model.DoubtComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoubtCommentRepo extends JpaRepository<DoubtComment, Long> {
    // Fetch top-level comments for a doubt (where parentComment is null)
    List<DoubtComment> findByDoubtIdAndParentCommentIsNullOrderByCreatedAtDesc(Long doubtId);

    // Count total comments and replies for a doubt
    long countByDoubtId(Long doubtId);

    // Fetch all comments and replies for a doubt
    List<DoubtComment> findByDoubtId(Long doubtId);
}
