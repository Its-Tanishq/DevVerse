package com.devverse.community.group.dto;

import com.devverse.community.group.model.GroupPrivacy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private GroupPrivacy privacy;
    private String inviteCode; // Null or hidden if not admin/member
    private long memberCount;
    private boolean isMember;
    private boolean isAdmin;
    private boolean isCreator;
    private boolean hasPendingRequest;
    private Long createdById;
    private String createdByUsername;
    private Instant createdAt;
    private Instant updatedAt;
}
