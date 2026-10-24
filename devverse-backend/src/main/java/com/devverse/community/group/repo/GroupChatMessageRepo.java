package com.devverse.community.group.repo;

import com.devverse.community.group.model.GroupChatMessage;
import com.devverse.community.group.model.StudyGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupChatMessageRepo extends JpaRepository<GroupChatMessage, Long> {

    Page<GroupChatMessage> findByGroupOrderByCreatedAtDesc(StudyGroup group, Pageable pageable);

    Page<GroupChatMessage> findByGroupOrderByCreatedAtAsc(StudyGroup group, Pageable pageable);
}
