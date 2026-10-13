package com.devverse.community.doubt.repo;

import com.devverse.community.doubt.model.DoubtComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoubtCommentRepo extends JpaRepository<DoubtComment, Long> {
    // Fetch top-level comments for a doubt (where parentComment is null)
    List<DoubtComment> findByDoubtIdAndParentCommentIsNullOrderByCreatedAtDesc(Long doubtId);
}
