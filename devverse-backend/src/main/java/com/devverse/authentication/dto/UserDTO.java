package com.devverse.authentication.dto;

import com.devverse.authentication.model.Connections;
import com.devverse.authentication.model.Provider;
import com.devverse.authentication.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {

    private Long ID;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is not valid")
    private String email;

    @NotBlank(message = "Username is required")
    private String username;

    private String actualUsername;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 30, message = "Password must be between 6 and 30 characters")
    private String password;

    private String profilePic;
    private String bio;
    private Map<Connections, String> connections;
    private Integer level = 1;
    private Integer xpPoint = 0;
    private Integer streak = 0;
    private Boolean isOnline = false;
    private Boolean isPremium = false;
    private Boolean isEnabled = true;
    private String role = Role.USER.name();
    private Instant lastActive = Instant.now();
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
    private Provider provider = Provider.LOCAL;

}