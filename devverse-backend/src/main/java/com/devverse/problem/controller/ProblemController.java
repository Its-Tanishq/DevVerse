package com.devverse.problem.controller;

import com.devverse.common.ApiResponse;
import com.devverse.problem.dto.ProblemDTO;
import com.devverse.problem.service.ProblemService;
import com.devverse.problem.service.SubmissionService;
import com.devverse.authentication.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problem")
public class ProblemController {

    private final ProblemService problemService;
    private final SubmissionService submissionService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createProblem(@Valid @RequestBody ProblemDTO problemDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Problem created successfully", problemService.createProblem(problemDTO), Instant.now()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateProblem(@PathVariable Long id, @RequestBody ProblemDTO problemDTO) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem updated successfully", problemService.updateProblem(id, problemDTO), Instant.now()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem deleted successfully", null, Instant.now()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getProblems(
            @RequestParam(required = false) com.devverse.problem.model.Difficulty difficulty,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Problems fetched successfully", problemService.getProblems(difficulty, tag, company, status, page, size), Instant.now()));
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<ApiResponse<?>> getProblem(@PathVariable String identifier) {
        if (identifier.matches("\\d+")) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Problem fetched successfully", problemService.getProblemById(Long.parseLong(identifier)), Instant.now()));
        } else {
            return ResponseEntity.ok(new ApiResponse<>(true, "Problem fetched successfully", problemService.getProblemBySlug(identifier), Instant.now()));
        }
    }

    @GetMapping("/user/status")
    public ResponseEntity<ApiResponse<?>> getUserProblemStatus() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = userService.getUserByEmail(auth.getName()).getID();
        return ResponseEntity.ok(new ApiResponse<>(true, "User problem status fetched successfully", submissionService.getUserProblemStatus(userId), Instant.now()));
    }
}
