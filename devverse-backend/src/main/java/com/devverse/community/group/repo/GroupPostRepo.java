package com.devverse.community.group.repo;

import com.devverse.community.group.model.GroupPost;
import com.devverse.community.group.model.StudyGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupPostRepo extends JpaRepository<GroupPost, Long> {

    Page<GroupPost> findByGroupOrderByCreatedAtDesc(StudyGroup group, Pageable pageable);
}
