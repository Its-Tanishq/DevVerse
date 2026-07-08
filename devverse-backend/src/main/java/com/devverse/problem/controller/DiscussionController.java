package com.devverse.problem.controller;


import com.devverse.common.ApiResponse;
import com.devverse.problem.dto.DiscussionDTO;
import com.devverse.problem.service.DiscussionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problem/discussion")
public class DiscussionController {

    private final DiscussionService discussionService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createDiscussion(@Valid @RequestBody DiscussionDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Discussion created successfully", discussionService.createDiscussion(dto), Instant.now()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllDiscussions() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Discussions fetched successfully", discussionService.getAllDiscussions(), Instant.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getDiscussionById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Discussion fetched successfully", discussionService.getDiscussionById(id), Instant.now()));
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<ApiResponse<?>> getDiscussionsByProblemId(@PathVariable Long problemId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Discussions fetched successfully", discussionService.getDiscussionsByProblemId(problemId), Instant.now()));
    }

    @GetMapping("/problem/{problemId}/root")
    public ResponseEntity<ApiResponse<?>> getRootDiscussionsByProblemId(@PathVariable Long problemId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Root discussions fetched successfully", discussionService.getRootDiscussionsByProblemId(problemId), Instant.now()));
    }

    @GetMapping("/{discussionId}/replies")
    public ResponseEntity<ApiResponse<?>> getRepliesByDiscussionId(@PathVariable Long discussionId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Replies fetched successfully", discussionService.getRepliesByDiscussionId(discussionId), Instant.now()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteDiscussion(@PathVariable Long id) {
        discussionService.deleteDiscussion(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Discussion deleted successfully", null, Instant.now()));
    }
}
