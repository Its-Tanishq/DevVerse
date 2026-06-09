package com.devverse.service;

import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@Data
public class CookieService {

    private String refreshTokenCookieName;
    private boolean cookieSecure;
    private boolean cookieHTTPOnly;
    private String cookieSameSite;
    private String cookieDomain;

    public CookieService(
            @Value("${jwt.refresh-token-cookie-name}") String refreshTokenCookieName,
            @Value("${jwt.cookie-secure}") boolean cookieSecure,
            @Value("${jwt.cookie-http-only}") boolean cookieHTTPOnly,
            @Value("${jwt.cookie-same-site}") String cookieSameSite,
            @Value("${jwt.cookie-domain}") String cookieDomain) {
        this.refreshTokenCookieName = refreshTokenCookieName;
        this.cookieSecure = cookieSecure;
        this.cookieHTTPOnly = cookieHTTPOnly;
        this.cookieSameSite = cookieSameSite;
        this.cookieDomain = cookieDomain;
    }

    public void attachRefreshCookie(HttpServletResponse response, String value, int maxAge) {
        var responseCookieBuilder = ResponseCookie.from(refreshTokenCookieName, value)
                .httpOnly(cookieHTTPOnly)
                .secure(cookieSecure)
                .path("/")
                .maxAge(maxAge)
                .sameSite(cookieSameSite);

        if (cookieDomain != null && !cookieDomain.isBlank()) {
            responseCookieBuilder.domain(cookieDomain);
        }
        ResponseCookie responseCookie = responseCookieBuilder.build();
        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }

    public void clearRefreshCookie(HttpServletResponse response) {
        var responseCookieBuilder = ResponseCookie.from(refreshTokenCookieName, "")
                .httpOnly(cookieHTTPOnly)
                .secure(cookieSecure)
                .maxAge(0)
                .path("/")
                .sameSite(cookieSameSite);

        if (cookieDomain != null && !cookieDomain.isBlank()) {
            responseCookieBuilder.domain(cookieDomain);
        }
        ResponseCookie responseCookie = responseCookieBuilder.build();
        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }

    public void addNoStoreHeaders(HttpServletResponse response) {
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        response.setHeader("Pragma", "no-cache");
    }
}
