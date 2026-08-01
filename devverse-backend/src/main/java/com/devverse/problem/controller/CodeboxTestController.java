package com.devverse.problem.controller;

import com.devverse.common.ApiResponse;
import com.devverse.problem.dto.CodeboxResponseDTO;
import com.devverse.problem.dto.CodeboxTestRequest;
import com.devverse.problem.service.CodeboxService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/codebox")
public class CodeboxTestController {

    private final CodeboxService codeboxService;

    @PostMapping("/test")
    public ResponseEntity<ApiResponse<?>> testCodebox(@RequestBody CodeboxTestRequest request) {
        CodeboxResponseDTO response = codeboxService.executeCode(
                request.code(),
                request.languageId(),
                request.stdin(),
                null
        );
        return ResponseEntity.ok(new ApiResponse<>(true, "Code execution completed", response, Instant.now()));
    }
}
