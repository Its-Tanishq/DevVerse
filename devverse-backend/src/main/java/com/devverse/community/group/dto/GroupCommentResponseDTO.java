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
public class GroupCommentResponseDTO {

    private Long id;
    private Long postId;
    private String content;
    private Long authorId;
    private String authorUsername;
    private String authorProfilePic;
    private boolean isAuthor;
    private Instant createdAt;
    private Instant updatedAt;
}
