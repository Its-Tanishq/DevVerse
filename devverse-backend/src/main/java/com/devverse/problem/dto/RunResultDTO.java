package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RunResultDTO {
    private String input;
    private String expectedOutput;
    private String yourOutput;
    private String compileError;
    private String runtimeError;
    private CodeboxStatus status;
    private boolean isCorrect;
}
