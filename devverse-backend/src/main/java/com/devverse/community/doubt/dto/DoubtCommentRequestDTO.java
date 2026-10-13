package com.devverse.community.doubt.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoubtCommentRequestDTO {
    @NotBlank(message = "Content is required")
    private String content;
    
    // Optional. If null, it's a top-level reply to the doubt.
    private Long parentCommentId;
}
