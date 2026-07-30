package com.devverse.problem.dto;

public record CodeboxTestRequest(
        String code,
        int languageId,
        String stdin
) {
}
