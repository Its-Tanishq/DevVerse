package com.devverse.profile.dto;

import com.devverse.authentication.model.Connections;

import java.util.Map;

public record ProfileUpdateRequest(
        String username,
        String bio,
        Map<Connections, String> connections
) {
}
