package com.devverse.security;

import com.devverse.authentication.repo.UserRepo;
import com.devverse.authentication.service.JWTService;
import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserRepo userRepo;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {

                if (!jwtService.isAccessToken(token)) {
                    request.setAttribute("error", "Invalid token type. Expected access token, got refresh token");
                    filterChain.doFilter(request, response);
                    return;
                }

                Jws<Claims> parse = jwtService.parse(token);
                Claims payload = parse.getPayload();
                String email = payload.getSubject();

                userRepo.findByEmail(email)
                        .ifPresentOrElse(
                                user -> {
                                    if (user.getIsEnabled()) {
                                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                                user.getEmail(),
                                                null,
                                                user.getAuthorities()
                                        );

                                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                                        if (SecurityContextHolder.getContext().getAuthentication() == null)
                                            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                                    } else {
                                        request.setAttribute("error", "User account is disabled");
                                    }
                                },
                                () -> request.setAttribute("error", "User not found: " + email)
                        );




            } catch (ExpiredJwtException e) {
                request.setAttribute("error", "Token Expired");
            } catch (Exception e) {
                request.setAttribute("error", "Invalid Token: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
