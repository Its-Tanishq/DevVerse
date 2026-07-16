package com.devverse.admin.service;

import com.devverse.admin.model.ActivityLog;
import com.devverse.admin.repo.ActivityLogRepo;
import com.devverse.authentication.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepo activityLogRepo;
    private final UserRepo userRepo;

    @Transactional
    public void logActivity(String action, String entityType, Long entityId, String severity, String colorDot) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setSeverity(severity);
        log.setColorDot(colorDot);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        userRepo.findByEmail(auth.getName()).ifPresent(user -> log.setPerformedBy(user.getID()));

        activityLogRepo.save(log);
    }
}
