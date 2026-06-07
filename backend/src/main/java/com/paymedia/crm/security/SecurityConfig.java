package com.paymedia.crm.security;

import com.paymedia.crm.security.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // ── CORS ──────────────────────────────────────────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Frontend origins
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // HTTP methods the browser is allowed to use
        config.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        );

        // Headers the browser may send
        config.setAllowedHeaders(
                List.of("Authorization", "Content-Type", "Accept")
        );

        // Headers the browser is allowed to read from the response
        config.setExposedHeaders(List.of("Authorization"));

        // Allow cookies / Authorization header to be forwarded
        config.setAllowCredentials(true);

        // How long the browser should cache a pre-flight response (1 hour)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // ── Security filter chain ─────────────────────────────────────────────────
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // 1. Apply the CORS config defined above.
                //    This also lets Spring Security pass OPTIONS pre-flight
                //    requests through without requiring authentication.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. CSRF not needed — stateless JWT API
                .csrf(csrf -> csrf.disable())

                // 3. No HTTP sessions
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 4. Route authorization
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )

                // 5. JWT filter runs before Spring's own auth filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}