package com.devverse.community.doubt.dto;

import com.devverse.authentication.dto.UserDTO;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class DoubtResponseDTO {
    private Long id;
    private String title;
    private String description;
    private UserDTO author;
    private List<String> tags;
    private boolean isSolved;
    private Long acceptedCommentId;
    private int commentCount;
    private Instant createdAt;
    private Instant updatedAt;
}
