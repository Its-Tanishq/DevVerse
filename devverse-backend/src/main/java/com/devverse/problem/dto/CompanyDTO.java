package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CompanyDTO {
    private Long ID;

    @NotBlank(message = "Name cannot be blank")
    private String name;
}
