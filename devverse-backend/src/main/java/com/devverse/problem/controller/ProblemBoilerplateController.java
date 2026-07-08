package com.devverse.problem.controller;

import com.devverse.common.ApiResponse;
import com.devverse.problem.dto.ProblemBoilerplateDTO;
import com.devverse.problem.model.Language;
import com.devverse.problem.service.ProblemBoilerplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problem/boilerplate")
public class ProblemBoilerplateController {

    private final ProblemBoilerplateService problemBoilerplateService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createProblemBoilerplate(@Valid @RequestBody ProblemBoilerplateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Problem boilerplate created successfully", problemBoilerplateService.createProblemBoilerplate(dto), Instant.now()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateProblemBoilerplate(@PathVariable Long id, @RequestBody ProblemBoilerplateDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem boilerplate updated successfully", problemBoilerplateService.updateProblemBoilerplate(id, dto), Instant.now()));
    }

    @GetMapping("/{id}")    
    public ResponseEntity<ApiResponse<?>> getBoilerplateById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem boilerplate fetched successfully", problemBoilerplateService.getBoilerplateById(id), Instant.now()));
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<ApiResponse<?>> getBoilerplatesByProblemId(@PathVariable Long problemId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem boilerplates fetched successfully", problemBoilerplateService.getBoilerplatesByProblemId(problemId), Instant.now()));
    }

    @GetMapping("/problem/{problemId}/language/{language}")
    public ResponseEntity<ApiResponse<?>> getBoilerplateByProblemIdAndLanguage(@PathVariable Long problemId, @PathVariable Language language) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem boilerplate fetched successfully", problemBoilerplateService.getBoilerplateByProblemIdAndLanguage(problemId, language), Instant.now()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteProblemBoilerplate(@PathVariable Long id) {
        problemBoilerplateService.deleteProblemBoilerplate(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem boilerplate deleted successfully", null, Instant.now()));
    }
}
