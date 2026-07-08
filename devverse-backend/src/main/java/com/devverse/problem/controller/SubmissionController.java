package com.devverse.problem.controller;

import com.devverse.common.ApiResponse;
import com.devverse.problem.dto.SubmissionDTO;
import com.devverse.problem.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problem/submission")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createSubmission(@Valid @RequestBody SubmissionDTO submissionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Submission created successfully", submissionService.createSubmission(submissionDTO), Instant.now()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllSubmissions() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Submissions fetched successfully", submissionService.getAllSubmissions(), Instant.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getSubmissionById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Submission fetched successfully", submissionService.getSubmissionById(id), Instant.now()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<?>> getSubmissionsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Submissions fetched successfully for user", submissionService.getSubmissionsByUserId(userId), Instant.now()));
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<ApiResponse<?>> getSubmissionsByProblemId(@PathVariable Long problemId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Submissions fetched successfully for problem", submissionService.getSubmissionsByProblemId(problemId), Instant.now()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Submission deleted successfully", null, Instant.now()));
    }
}
