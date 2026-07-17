package com.devverse.authentication.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;

    @Column(unique = true)
    @NotNull
    private String email;

    @Column(unique = true)
    @NotNull
    private String username;

    @NotNull
    private String password;

    private String profilePic;

    private String bio;

    @ElementCollection
    @CollectionTable(name = "user_connections", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "platform")
    @Column(name = "username")
    private Map<Connections, String> connections = new HashMap<>();

    @Builder.Default
    private Integer level = 1;

    @Builder.Default
    private Integer xpPoint = 0;

    @Builder.Default
    private Integer streak = 0;

    @Builder.Default
    private Boolean isOnline = false;

    @Builder.Default
    private Boolean isPremium = false;

    @Builder.Default
    private Boolean isEnabled = true;

    @Builder.Default
    private String role = Role.USER.name();

    private Instant lastActive;

    private Instant createdAt;

    private Instant updatedAt;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Provider provider;

    private String providerId;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        updatedAt = Instant.now();
        lastActive = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role));
    }

    @Override
    public String getUsername() {
        return this.email; // We use email for login not username
    }

    public String getActualUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() { // TODO: Ban expired accounts
        return true;
    }

    @Override
    public boolean isAccountNonLocked() { // TODO: Lock the account after failed attempts
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() { // TODO: Force password reset
        return true;
    }

    @Override
    public boolean isEnabled() { // TODO: Used to ban the user or similar functionality
        return this.isEnabled;
    }

}