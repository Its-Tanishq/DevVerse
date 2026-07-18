package com.devverse.authentication.controller;

import com.devverse.authentication.dto.ChangePasswordRequest;
import com.devverse.authentication.dto.UserDTO;
import com.devverse.authentication.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import com.devverse.common.ApiResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

//    @PostMapping
//    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDTO) {
//        return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerUser(userDTO));
//    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Users fetched successfully", userService.getAllUsers(page, size), Instant.now()));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(new ApiResponse<>(true, "User fetched successfully", userService.getUserByEmail(auth.getName()), Instant.now()));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<?>> updateCurrentUser(@RequestBody UserDTO userDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(new ApiResponse<>(true, "User updated successfully", userService.updateUser(auth.getName(), userDTO), Instant.now()));
    }

    @PatchMapping("/me/change-password")
    public ResponseEntity<ApiResponse<?>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        userService.changePassword(auth.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password changed successfully", null, Instant.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "User fetched successfully", userService.getUserById(id), Instant.now()));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse<?>> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(new ApiResponse<>(true, "User fetched successfully", userService.getUserByUsername(username), Instant.now()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteUserById(@PathVariable Long id, @RequestParam String reason) {
        userService.deleteUser(id, reason);
        return ResponseEntity.ok(new ApiResponse<>(true, "User deleted successfully", null, Instant.now()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/ban")
    public ResponseEntity<ApiResponse<?>> toggleUserBan(@PathVariable Long id, @RequestParam String reason) {
        userService.toggleBan(id, reason);
        return ResponseEntity.ok(new ApiResponse<>(true, "User ban status toggled", null, Instant.now()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/premium")
    public ResponseEntity<ApiResponse<?>> toggleUserPremium(@PathVariable Long id, @RequestParam String reason) {
        userService.togglePremium(id, reason);
        return ResponseEntity.ok(new ApiResponse<>(true, "User premium status toggled", null, Instant.now()));
    }

}