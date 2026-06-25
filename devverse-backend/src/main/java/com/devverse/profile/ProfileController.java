package com.devverse.profile;


import com.devverse.authentication.dto.ChangePasswordRequest;
import com.devverse.authentication.service.UserService;
import com.devverse.common.ApiResponse;
import com.devverse.profile.dto.ProfilePhotoUpdateRequest;
import com.devverse.profile.dto.ProfileUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserService userService;

    @PatchMapping("/update-photo")
    public ResponseEntity<ApiResponse<?>> updateProfilePhoto(@RequestBody ProfilePhotoUpdateRequest profilePhotoUpdateRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile photo updated successfully", profileService.updateUserProfilePhoto(auth.getName() ,profilePhotoUpdateRequest), Instant.now()));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<?>> deleteProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        profileService.deleteUser(auth.getName());
        // TODO: Logout is not done here
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile Deleted Successfully", null, Instant.now()));
    }

    @PatchMapping("/update-profile")
    public ResponseEntity<ApiResponse<?>> updateProfile(@RequestBody ProfileUpdateRequest profileUpdateRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", profileService.updateUserProfile(auth.getName() ,profileUpdateRequest), Instant.now()));
    }
}
