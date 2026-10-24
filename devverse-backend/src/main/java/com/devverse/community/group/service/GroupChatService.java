package com.devverse.community.group.service;

import com.devverse.authentication.model.User;
import com.devverse.community.group.dto.GroupChatMessageDTO;
import com.devverse.community.group.dto.SendChatMessageRequest;
import com.devverse.community.group.model.GroupChatMessage;
import com.devverse.community.group.model.StudyGroup;
import com.devverse.community.group.repo.GroupChatMessageRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GroupChatService {

    private final GroupChatMessageRepo groupChatMessageRepo;
    private final StudyGroupService studyGroupService;

    @Transactional
    public GroupChatMessageDTO sendMessage(Long groupId, SendChatMessageRequest request) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        studyGroupService.verifyGroupMember(group, currentUser);

        GroupChatMessage message = GroupChatMessage.builder()
                .group(group)
                .sender(currentUser)
                .content(request.getContent().trim())
                .build();

        GroupChatMessage savedMessage = groupChatMessageRepo.save(message);
        return mapToChatMessageDTO(savedMessage, currentUser);
    }

    @Transactional(readOnly = true)
    public Page<GroupChatMessageDTO> getMessageHistory(Long groupId, Pageable pageable) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        studyGroupService.verifyGroupMember(group, currentUser);

        Page<GroupChatMessage> messages = groupChatMessageRepo.findByGroupOrderByCreatedAtDesc(group, pageable);
        return messages.map(msg -> mapToChatMessageDTO(msg, currentUser));
    }

    private GroupChatMessageDTO mapToChatMessageDTO(GroupChatMessage msg, User currentUser) {
        boolean isSender = currentUser != null && msg.getSender().getID().equals(currentUser.getID());

        return GroupChatMessageDTO.builder()
                .id(msg.getId())
                .groupId(msg.getGroup().getId())
                .senderId(msg.getSender().getID())
                .senderUsername(msg.getSender().getActualUsername())
                .senderProfilePic(msg.getSender().getProfilePic())
                .content(msg.getContent())
                .isSender(isSender)
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
