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
public class DiscussionsDTO {
    private Long ID;

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotNull(message = "Problem ID cannot be null")
    private Long problemsId;

    private Long parentId;

    @NotBlank(message = "Content cannot be blank")
    private String content;

    private boolean isEditorial;
    private Instant createdAt;
}
