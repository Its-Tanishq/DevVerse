package com.devverse.admin;

import com.devverse.authentication.repo.UserRepo;
import com.devverse.common.ApiResponse;
import com.devverse.admin.repo.ActivityLogRepo;
import com.devverse.problem.repo.CompanyRepo;
import com.devverse.problem.repo.ProblemRepo;
import com.devverse.problem.repo.TestCaseRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
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
}
