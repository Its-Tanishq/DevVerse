package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserProblemWorkspaceDTO {
    private Long ID;

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotNull(message = "Problem ID cannot be null")
    private Long problemsId;

    private boolean isBookmark;
    private String notes;
}
