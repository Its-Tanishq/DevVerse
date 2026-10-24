package com.devverse.community.group.controller;

import com.devverse.common.ApiResponse;
import com.devverse.community.group.dto.*;
import com.devverse.community.group.service.StudyGroupService;
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

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class StudyGroupController {

    private final StudyGroupService studyGroupService;

    @PostMapping
    public ResponseEntity<ApiResponse<GroupResponseDTO>> createGroup(@Valid @RequestBody CreateGroupRequest request) {
        GroupResponseDTO response = studyGroupService.createGroup(request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Study group created successfully", response, Instant.now()), HttpStatus.CREATED);
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<ApiResponse<GroupResponseDTO>> updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody UpdateGroupRequest request) {
        GroupResponseDTO response = studyGroupService.updateGroup(groupId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Group updated successfully", response, Instant.now()));
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<ApiResponse<?>> deleteGroup(@PathVariable Long groupId) {
        studyGroupService.deleteGroup(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Group deleted successfully", null, Instant.now()));
    }

    @PostMapping("/{groupId}/regenerate-invite")
    public ResponseEntity<ApiResponse<GroupResponseDTO>> regenerateInviteCode(@PathVariable Long groupId) {
        GroupResponseDTO response = studyGroupService.regenerateInviteCode(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Invite code regenerated successfully", response, Instant.now()));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<GroupResponseDTO>> getGroupById(@PathVariable Long groupId) {
        GroupResponseDTO response = studyGroupService.getGroupById(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Group details retrieved", response, Instant.now()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<GroupResponseDTO>>> getPublicGroups(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<GroupResponseDTO> result = studyGroupService.getPublicGroups(query, pageRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Public groups retrieved", result, Instant.now()));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<GroupResponseDTO>>> getMyGroups() {
        List<GroupResponseDTO> result = studyGroupService.getMyGroups();
        return ResponseEntity.ok(new ApiResponse<>(true, "My groups retrieved", result, Instant.now()));
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<ApiResponse<GroupResponseDTO>> joinPublicGroup(@PathVariable Long groupId) {
        GroupResponseDTO response = studyGroupService.joinPublicGroup(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Successfully joined group", response, Instant.now()));
    }

    @PostMapping("/join/code/{inviteCode}")
    public ResponseEntity<ApiResponse<GroupResponseDTO>> joinByInviteCode(@PathVariable String inviteCode) {
        GroupResponseDTO response = studyGroupService.joinByInviteCode(inviteCode);
        return ResponseEntity.ok(new ApiResponse<>(true, "Successfully joined group using invite code", response, Instant.now()));
    }

    // Join Requests for Private Groups
    @PostMapping("/{groupId}/requests")
    public ResponseEntity<ApiResponse<JoinRequestDTO>> requestToJoin(
            @PathVariable Long groupId,
            @RequestBody(required = false) CreateJoinRequestDTO request) {
        JoinRequestDTO response = studyGroupService.requestToJoinGroup(groupId, request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Join request submitted successfully", response, Instant.now()), HttpStatus.CREATED);
    }

    @GetMapping("/{groupId}/requests")
    public ResponseEntity<ApiResponse<List<JoinRequestDTO>>> getPendingJoinRequests(@PathVariable Long groupId) {
        List<JoinRequestDTO> result = studyGroupService.getPendingJoinRequests(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending join requests retrieved", result, Instant.now()));
    }

    @PutMapping("/{groupId}/requests/{requestId}/accept")
    public ResponseEntity<ApiResponse<?>> acceptJoinRequest(
            @PathVariable Long groupId,
            @PathVariable Long requestId) {
        studyGroupService.handleJoinRequest(groupId, requestId, true);
        return ResponseEntity.ok(new ApiResponse<>(true, "Join request accepted", null, Instant.now()));
    }

    @PutMapping("/{groupId}/requests/{requestId}/reject")
    public ResponseEntity<ApiResponse<?>> rejectJoinRequest(
            @PathVariable Long groupId,
            @PathVariable Long requestId) {
        studyGroupService.handleJoinRequest(groupId, requestId, false);
        return ResponseEntity.ok(new ApiResponse<>(true, "Join request rejected", null, Instant.now()));
    }

    @PostMapping("/{groupId}/invite")
    public ResponseEntity<ApiResponse<?>> inviteUser(
            @PathVariable Long groupId,
            @Valid @RequestBody InviteUserRequest request) {
        studyGroupService.inviteUser(groupId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "User added to group successfully", null, Instant.now()));
    }
}
