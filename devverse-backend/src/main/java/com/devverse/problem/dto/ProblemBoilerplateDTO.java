package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.devverse.problem.model.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProblemBoilerplateDTO {
    private Long ID;

    @NotNull(message = "Problem ID cannot be null")
    private Long problemsId;

    @NotNull(message = "Language cannot be null")
    private Language language;

    @NotBlank(message = "Boilerplate cannot be blank")
    private String boilerplate;
}
