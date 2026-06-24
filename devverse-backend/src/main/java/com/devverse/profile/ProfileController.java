package com.devverse.profile;


import com.devverse.common.ApiResponse;
import com.devverse.profile.dto.ProfilePhotoUpdateRequest;
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

    @PatchMapping("/update-photo")
    public ResponseEntity<ApiResponse<?>> updateProfilePhoto(@RequestBody ProfilePhotoUpdateRequest profilePhotoUpdateRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile photo updated successfully", profileService.updateUserProfile(auth.getName() ,profilePhotoUpdateRequest), Instant.now()));
    }
}
