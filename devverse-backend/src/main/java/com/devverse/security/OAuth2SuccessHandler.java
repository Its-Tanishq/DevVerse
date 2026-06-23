package com.devverse.security;

import com.devverse.authentication.model.Provider;
import com.devverse.authentication.model.RefreshToken;
import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.RefreshTokenRepo;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.authentication.service.JWTService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepo userRepo;
    private final JWTService jwtService;
    private final RefreshTokenRepo refreshTokenRepo;
    private final CookieService cookieService;

    @Value("${app.auth.frontend.success-redirect-url}")
    private String frontendSuccessUrl;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String registrationId = "unknown";

        if (authentication instanceof OAuth2AuthenticationToken token) {
            registrationId = token.getAuthorizedClientRegistrationId();
        }

        User user = null;

        switch (registrationId) {
            case "google" -> {

                String googleId = oAuth2User.getAttributes().getOrDefault("sub", "").toString();
                String email = oAuth2User.getAttributes().getOrDefault("email", "").toString();
                String name = oAuth2User.getAttributes().getOrDefault("name", "").toString();
                String picture = oAuth2User.getAttributes().getOrDefault("picture", "").toString();

                String uniqueUsername = name.replaceAll("\\s+", "").toLowerCase() + "_" + googleId.substring(0, Math.min(googleId.length(), 5));

                User newUser = User.builder()
                        .email(email)
                        .username(uniqueUsername)
                        .password("Google Login")
                        .profilePic(picture)
                        .provider(Provider.GOOGLE)
                        .providerId(googleId)
                        .build();

                user = userRepo.findByEmail(email)
                        .orElseGet(() -> userRepo.save(newUser));
            }

            case "github" -> {

                String githubId = oAuth2User.getAttributes().getOrDefault("id", "").toString();
                String name = oAuth2User.getAttributes().getOrDefault("login", "").toString();
                String picture = oAuth2User.getAttributes().getOrDefault("avatar_url", "").toString();

                String email = (String) oAuth2User.getAttributes().get("email");
                if (email == null) {
                    email = name + "@github.com";
                }

                String uniqueUsername = name.replaceAll("\\s+", "").toLowerCase() + "_" + githubId.substring(0, Math.min(githubId.length(), 5));

                User newUser = User.builder()
                        .email(email)
                        .username(uniqueUsername)
                        .password("Github Login")
                        .profilePic(picture)
                        .provider(Provider.GITHUB)
                        .providerId(githubId)
                        .build();

                user = userRepo.findByEmail(email)
                        .orElseGet(() -> userRepo.save(newUser));
            }

            default -> {
                break;
            }
        }

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

//        response.getWriter().write("Login Successfull");
        response.sendRedirect(frontendSuccessUrl);
    }
}