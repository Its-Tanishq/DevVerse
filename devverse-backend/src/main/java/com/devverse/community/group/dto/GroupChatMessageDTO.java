package com.devverse.community.group.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupChatMessageDTO {

    private Long id;
    private Long groupId;
    private Long senderId;
    private String senderUsername;
    private String senderProfilePic;
    private String content;
    private boolean isSender;
    private Instant createdAt;
}
