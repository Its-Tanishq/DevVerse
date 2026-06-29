package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProblemsTagsDTO {
    private Long ID;

    @NotNull(message = "Problem ID cannot be null")
    private Long problemsId;

    @NotNull(message = "Tag ID cannot be null")
    private Long tagsId;
}
