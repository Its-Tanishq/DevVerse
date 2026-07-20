package com.devverse.problem.controller;

import com.devverse.common.ApiResponse;
import com.devverse.problem.dto.DailyChallengeDTO;
import com.devverse.problem.service.DailyChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.Instant;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problem/dc")
public class DailyChallengeController {

    private final DailyChallengeService dailyChallengeService;

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<?>> getTodayDailyChallenge() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Today's daily challenge fetched successfully", dailyChallengeService.getDailyChallengeByDate(LocalDate.now()), Instant.now()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> createDailyChallenge(@Valid @RequestBody DailyChallengeDTO dailyChallengeDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Daily challenge created successfully", dailyChallengeService.createDailyChallenge(dailyChallengeDTO), Instant.now()));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> updateDailyChallenge(@PathVariable Long id, @RequestBody DailyChallengeDTO dailyChallengeDTO) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Daily challenge updated successfully", dailyChallengeService.updateDailyChallenge(id, dailyChallengeDTO), Instant.now()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteDailyChallenge(@PathVariable Long id) {
        dailyChallengeService.deleteDailyChallenge(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Daily challenge deleted successfully", null, Instant.now()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllDailyChallenges(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Daily challenges fetched successfully", dailyChallengeService.getAllDailyChallenges(page, size), Instant.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getDailyChallengeById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Daily challenge fetched successfully", dailyChallengeService.getDailyChallengeById(id), Instant.now()));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<?>> getDailyChallengeByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Daily challenge fetched successfully", dailyChallengeService.getDailyChallengeByDate(date), Instant.now()));
    }

    @PostMapping("/auto-assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> autoAssignDailyChallenge(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Daily challenge auto-assigned successfully", dailyChallengeService.autoAssign(date), Instant.now()));
    }

    @GetMapping("/schedule")
    public ResponseEntity<ApiResponse<?>> getSchedule(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Daily challenge schedule fetched successfully", dailyChallengeService.getSchedule(startDate, endDate), Instant.now()));
    }
}
