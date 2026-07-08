package com.devverse.problem.controller;

import com.devverse.common.ApiResponse;
import com.devverse.problem.dto.TestCaseDTO;
import com.devverse.problem.service.TestCaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problem/testcase")
public class TestCaseController {

    private final TestCaseService testCaseService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createTestCase(@Valid @RequestBody TestCaseDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "TestCase created successfully", testCaseService.createTestCase(dto), Instant.now()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateTestCase(@PathVariable Long id, @RequestBody TestCaseDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "TestCase updated successfully", testCaseService.updateTestCase(id, dto), Instant.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getTestCaseById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "TestCase fetched successfully", testCaseService.getTestCaseById(id), Instant.now()));
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<ApiResponse<?>> getTestCasesByProblemId(@PathVariable Long problemId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "TestCases fetched successfully", testCaseService.getTestCasesByProblemId(problemId), Instant.now()));
    }

    @GetMapping("/problem/{problemId}/public")
    public ResponseEntity<ApiResponse<?>> getPublicTestCasesByProblemId(@PathVariable Long problemId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Public TestCases fetched successfully", testCaseService.getPublicTestCasesByProblemId(problemId), Instant.now()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteTestCase(@PathVariable Long id) {
        testCaseService.deleteTestCase(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "TestCase deleted successfully", null, Instant.now()));
    }
}
