package com.devverse.controller;

import com.devverse.dto.ChangePasswordRequest;
import com.devverse.dto.UserDTO;
import com.devverse.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

//    @PostMapping
//    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDTO) {
//        return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerUser(userDTO));
//    }

    @GetMapping
    public ResponseEntity<?> getAllUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getAllUsers(page, size));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userService.getUserByEmail(auth.getName()));
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody UserDTO userDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userService.updateUser(auth.getName(), userDTO));
    }

    @PatchMapping("/me/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        userService.changePassword(auth.getName(), request);
        return ResponseEntity.ok("Password changed successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

}