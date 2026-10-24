package com.devverse.community.group.controller;

import com.devverse.common.ApiResponse;
import com.devverse.community.group.dto.GroupMemberDTO;
import com.devverse.community.group.service.GroupMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/members")
@RequiredArgsConstructor
public class GroupMemberController {

    private final GroupMemberService groupMemberService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupMemberDTO>>> getMembers(@PathVariable Long groupId) {
        List<GroupMemberDTO> members = groupMemberService.getMembers(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Group members retrieved", members, Instant.now()));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<?>> leaveGroup(@PathVariable Long groupId) {
        groupMemberService.leaveGroup(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Successfully left the group", null, Instant.now()));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<?>> removeMember(
            @PathVariable Long groupId,
            @PathVariable Long userId) {
        groupMemberService.removeMember(groupId, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Member removed successfully", null, Instant.now()));
    }

    @PutMapping("/{userId}/admin")
    public ResponseEntity<ApiResponse<GroupMemberDTO>> promoteToAdmin(
            @PathVariable Long groupId,
            @PathVariable Long userId) {
        GroupMemberDTO updated = groupMemberService.promoteToAdmin(groupId, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Member promoted to admin successfully", updated, Instant.now()));
    }
}
