package com.devverse.problem.controller;

import com.devverse.common.ApiResponse;
import com.devverse.problem.dto.TagsDTO;
import com.devverse.problem.service.TagsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problem/tag")
public class TagsController {

    private final TagsService tagsService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createTag(@Valid @RequestBody TagsDTO tagsDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Tag created successfully", tagsService.createTag(tagsDTO), Instant.now()));
    }

    @PatchMapping("/{tagId}")
    public ResponseEntity<ApiResponse<?>> updateTag(@PathVariable Long tagId, @RequestBody TagsDTO tagsDTO) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Tag updated successfully", tagsService.updateTag(tagId, tagsDTO), Instant.now()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteTag(@PathVariable Long id) {
        tagsService.deleteTag(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tag deleted successfully", null, Instant.now()));
    }

    @PutMapping("/{tagId}/problem/{problemId}") 
    public ResponseEntity<ApiResponse<?>> updateProblemTag(@PathVariable Long problemId, @PathVariable Long tagId) {
        tagsService.updateProblemTag(problemId, tagId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem associated with tag successfully", null, Instant.now()));
    }

    @DeleteMapping("/{tagId}/problem/{problemId}") 
    public ResponseEntity<ApiResponse<?>> deleteProblemTag(@PathVariable Long problemId, @PathVariable Long tagId) {
        tagsService.deleteProblemTag(problemId, tagId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem disassociated from tag successfully", null, Instant.now()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllTags() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Tags fetched successfully", tagsService.getAllTags(), Instant.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getTagById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Tag fetched successfully", tagsService.getTagById(id), Instant.now()));
    }
}
