package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.devverse.problem.model.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProblemDTO {
    private Long ID;

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Slug cannot be blank")
    private String slug;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotNull(message = "Difficulty cannot be null")
    private Difficulty difficulty;

    @NotBlank(message = "Hints cannot be blank")
    private String hints;

    private Boolean isPremium;
    private List<CompanyDTO> companies;
    private List<TagsDTO> tags;
    private String status;
    private Boolean bookmarked;
}
