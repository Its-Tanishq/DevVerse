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
public class GroupPostResponseDTO {

    private Long id;
    private Long groupId;
    private String content;
    private String mediaUrl;
    private Long authorId;
    private String authorUsername;
    private String authorProfilePic;
    private long likeCount;
    private long commentCount;
    private boolean hasLiked;
    private boolean isAuthor;
    private Instant createdAt;
    private Instant updatedAt;
}
