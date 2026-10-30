package com.devverse.community.group.dto;

import com.devverse.community.group.model.GroupPrivacy;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("isMember")
    private boolean isMember;

    @JsonProperty("isAdmin")
    private boolean isAdmin;

    @JsonProperty("isCreator")
    private boolean isCreator;

    @JsonProperty("hasPendingRequest")
    private boolean hasPendingRequest;

    private Long createdById;
    private String createdByUsername;
    private Instant createdAt;
    private Instant updatedAt;

    @JsonProperty("member")
    public boolean getMember() {
        return isMember;
    }

    @JsonProperty("admin")
    public boolean getAdmin() {
        return isAdmin;
    }

    @JsonProperty("creator")
    public boolean getCreator() {
        return isCreator;
    }

    @JsonProperty("pendingRequest")
    public boolean getPendingRequest() {
        return hasPendingRequest;
    }
}
