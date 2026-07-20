package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DailyChallengeDTO {
    private Long ID;

    @NotNull(message = "Problem ID cannot be null")
    private Long problemsId;

    @NotNull(message = "Date cannot be null")
    private LocalDate date;

    private Instant createdAt;
    
    private ProblemDTO problems;
}
