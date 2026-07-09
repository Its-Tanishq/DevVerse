package com.devverse.problem.controller;

import com.devverse.common.ApiResponse;
import com.devverse.problem.dto.UserProblemWorkspaceDTO;
import com.devverse.problem.service.UserProblemWorkspaceService;
import com.devverse.authentication.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problem/workspace")
public class UserProblemWorkspaceController {

    private final UserProblemWorkspaceService workspaceService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createOrUpdateWorkspace(@Valid @RequestBody UserProblemWorkspaceDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = userService.getUserByEmail(auth.getName()).getID();
        dto.setUserId(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Workspace saved successfully", workspaceService.createOrUpdateWorkspace(dto), Instant.now()));
    }

    @GetMapping("/user/problem/{problemId}")
    public ResponseEntity<ApiResponse<?>> getWorkspace(@PathVariable Long problemId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = userService.getUserByEmail(auth.getName()).getID();
        return ResponseEntity.ok(new ApiResponse<>(true, "Workspace fetched successfully", workspaceService.getWorkspace(userId, problemId), Instant.now()));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<?>> getUserWorkspaces() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = userService.getUserByEmail(auth.getName()).getID();
        return ResponseEntity.ok(new ApiResponse<>(true, "Workspaces fetched successfully", workspaceService.getUserWorkspaces(userId), Instant.now()));
    }

    @GetMapping("/user/bookmarks")
    public ResponseEntity<ApiResponse<?>> getBookmarkedWorkspaces() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = userService.getUserByEmail(auth.getName()).getID();
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookmarked workspaces fetched successfully", workspaceService.getBookmarkedWorkspaces(userId), Instant.now()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteWorkspace(@PathVariable Long id) {
        workspaceService.deleteWorkspace(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Workspace deleted successfully", null, Instant.now()));
    }
}
