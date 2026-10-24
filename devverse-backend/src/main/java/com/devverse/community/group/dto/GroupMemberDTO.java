package com.devverse.community.group.dto;

import com.devverse.community.group.model.GroupRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberDTO {

    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String profilePic;
    private String bio;
    private GroupRole role;
    private Instant joinedAt;
}
