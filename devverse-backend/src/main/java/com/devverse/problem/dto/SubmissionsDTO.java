package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.devverse.problem.model.Language;
import com.devverse.problem.model.SubmissionStatus;
import java.time.Instant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SubmissionsDTO {
    private Long ID;

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotNull(message = "Problem ID cannot be null")
    private Long problemsId;

    @NotBlank(message = "Code cannot be blank")
    private String code;

    @NotNull(message = "Language cannot be null")
    private Language language;

    @NotNull(message = "Status cannot be null")
    private SubmissionStatus status;

    @NotNull(message = "Execution time cannot be null")
    private Integer executionTimeMs;

    @NotNull(message = "Memory used cannot be null")
    private Integer memoryUsedKb;

    private Instant createdAt;
}
