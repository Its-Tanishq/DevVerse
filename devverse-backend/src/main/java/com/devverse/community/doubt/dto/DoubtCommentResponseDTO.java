package com.devverse.community.doubt.dto;

import com.devverse.authentication.dto.UserDTO;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class DoubtCommentResponseDTO {
    private Long id;
    private String content;
    private UserDTO author;
    private Long doubtId;
    private Long parentCommentId;
    private List<DoubtCommentResponseDTO> replies;
    private int upvotes;
    private int downvotes;
    private Instant createdAt;
    private Instant updatedAt;
}
