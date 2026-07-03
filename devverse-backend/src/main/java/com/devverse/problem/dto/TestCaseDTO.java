package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TestCaseDTO {
    private Long ID;

    @NotNull(message = "Problem ID cannot be null")
    private Long problemsId;

    @NotBlank(message = "Input cannot be blank")
    private String input;

    @NotBlank(message = "Output cannot be blank")
    private String output;

    private boolean isHidden;
}
