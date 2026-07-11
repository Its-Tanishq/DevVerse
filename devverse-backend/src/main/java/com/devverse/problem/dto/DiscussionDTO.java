package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DiscussionDTO {
    private Long ID;

    private Long userId;
    
    private String username;

    @NotNull(message = "Problem ID cannot be null")
    private Long problemsId;

    private Long parentId;

    @NotBlank(message = "Content cannot be blank")
    private String content;

    private Boolean isEditorial;
    private Integer likeCount;
    private Instant createdAt;
}
