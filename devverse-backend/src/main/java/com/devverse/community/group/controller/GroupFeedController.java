package com.devverse.community.group.controller;

import com.devverse.common.ApiResponse;
import com.devverse.community.group.dto.CreatePostRequest;
import com.devverse.community.group.dto.GroupCommentResponseDTO;
import com.devverse.community.group.dto.GroupPostResponseDTO;
import com.devverse.community.group.dto.PostCommentRequest;
import com.devverse.community.group.service.GroupFeedService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups/{groupId}/posts")
@RequiredArgsConstructor
public class GroupFeedController {

    private final GroupFeedService groupFeedService;

    @PostMapping
    public ResponseEntity<ApiResponse<GroupPostResponseDTO>> createPost(
            @PathVariable Long groupId,
            @Valid @RequestBody CreatePostRequest request) {
        GroupPostResponseDTO response = groupFeedService.createPost(groupId, request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Post created successfully", response, Instant.now()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<GroupPostResponseDTO>>> getGroupFeed(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<GroupPostResponseDTO> feed = groupFeedService.getGroupFeed(groupId, pageRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Group feed retrieved", feed, Instant.now()));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<?>> deletePost(
            @PathVariable Long groupId,
            @PathVariable Long postId) {
        groupFeedService.deletePost(groupId, postId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Post deleted successfully", null, Instant.now()));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleLike(
            @PathVariable Long groupId,
            @PathVariable Long postId) {
        boolean liked = groupFeedService.toggleLike(groupId, postId);
        return ResponseEntity.ok(new ApiResponse<>(true, liked ? "Post liked" : "Post unliked", Map.of("liked", liked), Instant.now()));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<ApiResponse<GroupCommentResponseDTO>> addComment(
            @PathVariable Long groupId,
            @PathVariable Long postId,
            @Valid @RequestBody PostCommentRequest request) {
        GroupCommentResponseDTO comment = groupFeedService.addComment(groupId, postId, request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Comment added successfully", comment, Instant.now()), HttpStatus.CREATED);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<ApiResponse<List<GroupCommentResponseDTO>>> getComments(
            @PathVariable Long groupId,
            @PathVariable Long postId) {
        List<GroupCommentResponseDTO> comments = groupFeedService.getComments(groupId, postId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Comments retrieved", comments, Instant.now()));
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<ApiResponse<?>> deleteComment(
            @PathVariable Long groupId,
            @PathVariable Long postId,
            @PathVariable Long commentId) {
        groupFeedService.deleteComment(groupId, postId, commentId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Comment deleted successfully", null, Instant.now()));
    }
}
