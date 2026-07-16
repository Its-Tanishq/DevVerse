package com.devverse.admin.repo;

import com.devverse.admin.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepo extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findTop10ByOrderByCreatedAtDesc();
}
