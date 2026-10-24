package com.devverse.community.group.controller;

import com.devverse.common.ApiResponse;
import com.devverse.community.group.dto.GroupChatMessageDTO;
import com.devverse.community.group.dto.SendChatMessageRequest;
import com.devverse.community.group.service.GroupChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/groups/{groupId}/chat")
@RequiredArgsConstructor
public class GroupChatController {

    private final GroupChatService groupChatService;

    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<GroupChatMessageDTO>> sendMessage(
            @PathVariable Long groupId,
            @Valid @RequestBody SendChatMessageRequest request) {
        GroupChatMessageDTO response = groupChatService.sendMessage(groupId, request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Message sent successfully", response, Instant.now()), HttpStatus.CREATED);
    }

    @GetMapping("/messages")
    public ResponseEntity<ApiResponse<Page<GroupChatMessageDTO>>> getMessages(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<GroupChatMessageDTO> messages = groupChatService.getMessageHistory(groupId, pageRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Chat messages retrieved", messages, Instant.now()));
    }
}
