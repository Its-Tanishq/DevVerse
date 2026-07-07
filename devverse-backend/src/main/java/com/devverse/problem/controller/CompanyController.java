package com.devverse.problem.controller;

import com.devverse.common.ApiResponse;
import com.devverse.problem.dto.CompanyDTO;
import com.devverse.problem.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problem/company")
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createCompany(@Valid @RequestBody CompanyDTO companyDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Company created successfully", companyService.createCompany(companyDTO), Instant.now()));
    }

    @PatchMapping("/{companyId}")
    public ResponseEntity<ApiResponse<?>> updateCompany(@PathVariable Long companyId, @RequestBody CompanyDTO companyDTO) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Company updated successfully", companyService.updateCompany(companyId, companyDTO), Instant.now()));
    }

    @DeleteMapping("/{companyId}")
    public ResponseEntity<ApiResponse<?>> deleteCompany(@PathVariable Long companyId) {
        companyService.deleteCompany(companyId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Company deleted successfully", null, Instant.now()));
    }

    @PutMapping("/{companyId}/problem/{problemId}") 
    public ResponseEntity<ApiResponse<?>> updateProblemCompany(@PathVariable Long problemId, @PathVariable Long companyId) {
        companyService.updateProblemCompany(problemId, companyId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem associated with company successfully", null, Instant.now()));
    }

    @DeleteMapping("/{companyId}/problem/{problemId}") 
    public ResponseEntity<ApiResponse<?>> deleteProblemCompany(@PathVariable Long problemId, @PathVariable Long companyId) {
        companyService.deleteProblemCompany(problemId, companyId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Problem disassociated from company successfully", null, Instant.now()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllCompanies() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Companies fetched successfully", companyService.getAllCompanies(), Instant.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getCompanyById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Company fetched successfully", companyService.getCompanyById(id), Instant.now()));
    }
}
