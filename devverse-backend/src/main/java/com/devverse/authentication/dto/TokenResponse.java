package com.devverse.authentication.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken,
        long expireIn,
        String tokenType,
        UserDTO userDTO
) {

    public static TokenResponse of(String accessToken, String refreshToken, long expireIn, UserDTO userDTO) {
        return new TokenResponse(accessToken, refreshToken, expireIn, "Bearer", userDTO);
    }
}
