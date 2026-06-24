package com.devverse.profile.dto;


import jakarta.validation.constraints.NotBlank;

public record ProfilePhotoUpdateRequest(
        @NotBlank(message = "Photo URL is missing")
        String profilePic
) {
}
