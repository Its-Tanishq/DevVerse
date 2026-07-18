package com.devverse.admin;

import com.devverse.admin.model.ActivityLog;
import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.common.ApiResponse;
import com.devverse.admin.repo.ActivityLogRepo;
import com.devverse.exception.ResourceNotFoundException;
import com.devverse.problem.repo.CompanyRepo;
import com.devverse.problem.repo.ProblemRepo;
import com.devverse.problem.repo.TestCaseRepo;
import com.devverse.problem.repo.SubmissionRepo;
import com.devverse.authentication.repo.RefreshTokenRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.transaction.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepo userRepo;
    private final ProblemRepo problemRepo;
    private final CompanyRepo companyRepo;
    private final TestCaseRepo testCaseRepo;
    private final ActivityLogRepo activityLogRepo;
    private final SubmissionRepo submissionRepo;
    private final RefreshTokenRepo refreshTokenRepo;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<?>> getStats() {
        Map<String, Long> stats = Map.of(
                "totalUsers", userRepo.count(),
                "totalProblems", problemRepo.count(),
                "totalCompanies", companyRepo.count(),
                "totalTestCases", testCaseRepo.count()
        );
        return ResponseEntity.ok(new ApiResponse<>(true, "Admin stats fetched successfully", stats, Instant.now()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<?>> getRecentActivity() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Recent activity fetched", activityLogRepo.findTop10ByOrderByCreatedAtDesc(), Instant.now()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/activity/{entityType}/{entityId}")
    public ResponseEntity<ApiResponse<?>> getEntityActivity(
            @PathVariable String entityType, 
            @PathVariable Long entityId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Entity activity fetched", 
                activityLogRepo.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType.toUpperCase(), entityId), Instant.now()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{id}/problem-stats")
    public ResponseEntity<ApiResponse<?>> getUserProblemStats(@PathVariable Long id) {
        List<Object[]> statsRaw = submissionRepo.countAcceptedProblemsByDifficulty(id);
        Map<String, Long> stats = new HashMap<>();
        stats.put("EASY", 0L);
        stats.put("MEDIUM", 0L);
        stats.put("HARD", 0L);
        for (Object[] row : statsRaw) {
            String diff = row[0].toString();
            Long count = ((Number) row[1]).longValue();
            stats.put(diff, count);
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "User problem stats fetched", stats, Instant.now()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/user/{id}/sessions")
    @Transactional
    public ResponseEntity<ApiResponse<?>> revokeUserSessions(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "No reason provided") String reason) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        refreshTokenRepo.deleteByUser(user);
        
        activityLogRepo.save(ActivityLog.builder()
                .action("All sessions revoked for user: " + user.getActualUsername() + ". Reason: " + reason)
                .entityType("USER")
                .entityId(user.getID())
                .severity("WARNING")
                .colorDot("orange")
                .createdAt(Instant.now())
                .build());
                
        return ResponseEntity.ok(new ApiResponse<>(true, "All active sessions revoked for user", null, Instant.now()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/user/{id}/moderation")
    @Transactional
    public ResponseEntity<ApiResponse<?>> updateModeration(
            @PathVariable Long id, 
            @RequestBody Map<String, String> updates) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        if (updates.containsKey("bio")) {
            user.setBio(updates.get("bio"));
        }
        if (updates.containsKey("profilePic")) {
            user.setProfilePic(updates.get("profilePic"));
        }
        
        userRepo.save(user);
        
        activityLogRepo.save(ActivityLog.builder()
                .action("Admin modified user profile (Bio/Avatar) for: " + user.getActualUsername())
                .entityType("USER")
                .entityId(user.getID())
                .severity("INFO")
                .colorDot("blue")
                .createdAt(Instant.now())
                .build());
                
        return ResponseEntity.ok(new ApiResponse<>(true, "User profile updated successfully", user, Instant.now()));
    }
}
