package com.paymedia.crm.test;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/profile")
    public String profile(Authentication authentication) {

        UserDetails user =
                (UserDetails) authentication.getPrincipal();

        return "Logged User: " + user.getUsername();
    }

    @GetMapping("/role")
    public String role(Authentication authentication) {

        return authentication.getAuthorities()
                .toString();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminEndpoint() {

        return "Admin Access Granted";
    }

    @GetMapping("/sales")
    @PreAuthorize("hasRole('SALES')")
    public String salesEndpoint() {

        return "Sales Access Granted";
    }
}