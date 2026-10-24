package com.devverse.community.group.dto;

import com.devverse.community.group.model.JoinRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoinRequestDTO {

    private Long id;
    private Long groupId;
    private String groupName;
    private Long userId;
    private String username;
    private String profilePic;
    private String message;
    private JoinRequestStatus status;
    private Instant createdAt;
    private Instant reviewedAt;
}
