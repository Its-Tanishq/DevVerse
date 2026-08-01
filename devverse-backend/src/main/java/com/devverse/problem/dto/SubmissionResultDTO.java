package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResultDTO {
    private SubmissionDTO submission;
    private RunResultDTO failedTestCase; // Will be null if ACCEPTED
    private int totalTestCases;
    private int passedTestCases;
}
