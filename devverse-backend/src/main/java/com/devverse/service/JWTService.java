package com.devverse.service;

import com.devverse.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
@Data
public class JWTService {

    private SecretKey secretKey;
    private long accessTTLSec;
    private long refreshTTLSec;

    public JWTService(@Value("${jwt.secret-key}") String secretKey,
                      @Value("${jwt.access-ttl-sec}") long accessTTLSec,
                      @Value("${jwt.refresh-ttl-sec}") long refreshTTLSec) {

        if (secretKey == null) {
            throw new IllegalArgumentException("Secret key cannot be null");
        }

        this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.accessTTLSec = accessTTLSec;
        this.refreshTTLSec = refreshTTLSec;
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessTTLSec)))
                .claim("userID", user.getID())
                .claim("username", user.getActualUsername())
                .claim("role", user.getRole() != null ? user.getRole() : "USER")
                .claim("type", "access")
                .signWith(secretKey)
                .compact();
    }

    public String generateRefreshToken(User user, String jti) {
        Instant now = Instant.now();
        return Jwts.builder()
                .id(jti)
                .subject(user.getEmail())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(refreshTTLSec)))
                .claim("type", "refresh")
                .signWith(secretKey)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
    }

    public boolean isAccessToken(String token) {
        Claims claims = parse(token).getPayload();
        return "access".equals(claims.get("type"));
    }

    public boolean isRefreshToken(String token) {
        Claims claims = parse(token).getPayload();
        return "refresh".equals(claims.get("type"));
    }

    public UUID getUserID(String token) {
        return UUID.fromString(parse(token).getPayload().getId());
    }

    public String getUserEmail(String token) {
        return parse(token).getPayload().getSubject();
    }

    public String getUserRole(String token) {
        return parse(token).getPayload().get("role", String.class);
    }

    public String getJTI(String token) {
        return parse(token).getPayload().getId();
    }

}
