package com.devverse.config;

public class AppConstants {

    public static final String[] AUTH_PUBLIC_URLS = {
            "/api/auth/**",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**"
    };

    public static final String[] GET_PUBLIC_URLS = {
            "/api/problem",
            "/api/problem/count",
            "/api/problem/*",
            "/api/problem/company",
            "/api/problem/company/**",
            "/api/problem/tag",
            "/api/problem/tag/**",
            "/api/problem/dc",
            "/api/problem/dc/**",
            "/api/problem/discussion",
            "/api/problem/discussion/**",
            "/api/problem/boilerplate",
            "/api/problem/boilerplate/**",
            "/api/problem/testcase/problem/*/public"
    };

}
