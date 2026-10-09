package com.devverse.community.follow.controller;

import com.devverse.common.ApiResponse;
import com.devverse.community.follow.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{username}")
    public ResponseEntity<ApiResponse<?>> followUser(@PathVariable String username) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        followService.followUser(auth.getName(), username);
        return ResponseEntity.ok(new ApiResponse<>(true, "Successfully followed user", null, Instant.now()));
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<ApiResponse<?>> unfollowUser(@PathVariable String username) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        followService.unfollowUser(auth.getName(), username);
        return ResponseEntity.ok(new ApiResponse<>(true, "Successfully unfollowed user", null, Instant.now()));
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<ApiResponse<?>> getFollowers(@PathVariable String username) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Followers retrieved", followService.getFollowers(username), Instant.now()));
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<ApiResponse<?>> getFollowing(@PathVariable String username) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Following retrieved", followService.getFollowing(username), Instant.now()));
    }

    @GetMapping("/{username}/status")
    public ResponseEntity<ApiResponse<?>> getFollowStatus(@PathVariable String username) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isFollowing = followService.isFollowing(auth.getName(), username);
        return ResponseEntity.ok(new ApiResponse<>(true, "Follow status retrieved", isFollowing, Instant.now()));
    }
}
