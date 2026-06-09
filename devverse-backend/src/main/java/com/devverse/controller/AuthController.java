package com.devverse.controller;

import com.devverse.dto.LoginRequest;
import com.devverse.dto.TokenResponse;
import com.devverse.dto.UserDTO;
import com.devverse.exception.InvalidCredentialsException;
import com.devverse.model.RefreshToken;
import com.devverse.model.User;
import com.devverse.repo.RefreshTokenRepo;
import com.devverse.service.CookieService;
import com.devverse.service.JWTService;
import com.devverse.service.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final ModelMapper modelMapper;
    private final RefreshTokenRepo refreshTokenRepo;
    private final CookieService cookieService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerUser(userDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        Authentication authentication;

        try {

            authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));

        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        UserDTO userDTO = userService.getUserByEmail(loginRequest.email());
        if (!userDTO.getIsEnabled())
            throw new DisabledException("User is disabled");

        User user = modelMapper.map(userDTO, User.class);

        String jti = UUID.randomUUID().toString();
        var refreshTokenDB = RefreshToken.builder()
                .jti(jti)
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTTLSec()))
                .revoked(false)
                .build();

        refreshTokenRepo.save(refreshTokenDB);


        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user, refreshTokenDB.getJti());

        cookieService.attachRefreshCookie(response, refreshToken, (int) jwtService.getRefreshTTLSec());
        cookieService.addNoStoreHeaders(response);

        TokenResponse tokenResponse = TokenResponse.of(accessToken, refreshToken, jwtService.getAccessTTLSec(), userDTO);

        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletResponse response, HttpServletRequest request) {
        String refreshToken = getRefreshTokenFromCookie(request)
                .orElseThrow(() -> new BadCredentialsException("Refresh token not found"));

        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        String jti = jwtService.getJTI(refreshToken);
        String email = jwtService.getUserEmail(refreshToken);

        RefreshToken refreshTokenDB = refreshTokenRepo.findByJti(jti)
                .orElseThrow(() -> new BadCredentialsException("Refresh token not found in database"));

        if (refreshTokenDB.isRevoked()) {
            throw new BadCredentialsException("Refresh token has been revoked");
        }

        if (refreshTokenDB.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Refresh token has expired");
        }

        if (!refreshTokenDB.getUser().getID().equals(userService.getUserByEmail(email).getID())) {
            throw new BadCredentialsException("Refresh token does not belong to this user");
        }

        refreshTokenDB.setRevoked(true);

        String newJti = UUID.randomUUID().toString();
        refreshTokenDB.setReplacedByToken(newJti);
        refreshTokenRepo.save(refreshTokenDB);

        User user = refreshTokenDB.getUser();

        var newRefreshTokenDB = RefreshToken.builder()
                .jti(newJti)
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTTLSec()))
                .revoked(false)
                .build();

        refreshTokenRepo.save(newRefreshTokenDB);

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user, newJti);

        cookieService.attachRefreshCookie(response, newRefreshToken, (int) jwtService.getRefreshTTLSec());
        cookieService.addNoStoreHeaders(response);

        TokenResponse tokenResponse = TokenResponse.of(newAccessToken, newRefreshToken, jwtService.getAccessTTLSec(), userService.getUserByEmail(user.getEmail()));
        return ResponseEntity.ok(tokenResponse);
    }

    public Optional<String> getRefreshTokenFromCookie(HttpServletRequest request) {
        if (request == null) return Optional.empty();

//        1. From Cookie
        if (request.getCookies() != null) {
            Optional<String> fromCookie = Arrays.stream(
                    request.getCookies()
            ).filter(c -> cookieService.getRefreshTokenCookieName().equals(c.getName()))
                    .map(c -> c.getValue())
                    .filter(v -> !v.isBlank())
                    .findFirst();


            if (fromCookie.isPresent())
                return fromCookie;
        }

//        2. From Custom Header
        String refreshHeader = request.getHeader("X-Refresh-Token");
        if (refreshHeader != null && !refreshHeader.isBlank()) {
            return Optional.of(refreshHeader.trim());
        }

//        3. From Authorization -> Bearer <token>
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.regionMatches(true, 0, "Bearer ", 0, 7)) {
            String candidate = authHeader.substring(7).trim();
            if (!candidate.isEmpty()) {
                try {
                    if (jwtService.isRefreshToken(candidate)) {
                        return Optional.of(candidate);
                    }
                } catch (Exception ignored) {
                }
            }
        }

        return Optional.empty();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        getRefreshTokenFromCookie(request).ifPresent(token -> {
            try {
                if (jwtService.isRefreshToken(token)) {
                    String jti = jwtService.getJTI(token);
                    refreshTokenRepo.findByJti(jti).ifPresent(rt -> {
                        rt.setRevoked(true);
                        refreshTokenRepo.save(rt);
                    });
                }
            } catch (JwtException ignored) {
            }
        });

        // Use CookieUtil (same behavior)
        cookieService.clearRefreshCookie(response);
        cookieService.addNoStoreHeaders(response);
        SecurityContextHolder.clearContext();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}