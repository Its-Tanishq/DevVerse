package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CodeboxResponseDTO {

    private String stdout;
    private String stderr;
    private String compile_output;
    private CodeboxStatus status;
    private String time;
    private Integer memory;
    private String message;
}
