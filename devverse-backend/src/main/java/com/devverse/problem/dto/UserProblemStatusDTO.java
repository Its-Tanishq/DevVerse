package com.devverse.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProblemStatusDTO {
    private List<Long> solvedProblemIds;
    private List<Long> attemptedProblemIds;
}
