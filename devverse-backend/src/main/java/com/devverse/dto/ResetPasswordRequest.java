package com.devverse.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest (
    @NotBlank(message = "Email is required")
    @Email(message = "Email is not valid")
    String email,

    @NotBlank(message = "OTP is required")
    String otp,

    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 30, message = "Password must be between 6 and 30 characters")
    String newPassword
) {}
