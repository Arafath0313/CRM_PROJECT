package com.paymedia.crm.auth.controller;

import com.paymedia.crm.auth.dto.LoginResponse;
import com.paymedia.crm.auth.dto.LoginRequest;
import com.paymedia.crm.auth.dto.RegisterRequest;
import com.paymedia.crm.auth.dto.VerifyOtpRequest;
import com.paymedia.crm.auth.dto.ForgotPasswordRequest;
import com.paymedia.crm.auth.dto.ResetPasswordRequest;
import com.paymedia.crm.auth.service.AuthService;
import com.paymedia.crm.auth.service.PasswordResetService;
import com.paymedia.crm.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
public ApiResponse<String> register(
        @Valid @RequestBody RegisterRequest request) {

        authService.register(request);

        return new ApiResponse<>(
                true,
                "User registered successfully",
                null
        );
    }

    @PostMapping("/login")
public ResponseEntity<ApiResponse<LoginResponse>> login(
        @Valid @RequestBody LoginRequest request) {

    String token = authService.login(request);

    return ResponseEntity.ok(
            new ApiResponse<>(
                    true,
                    "Login successful",
                    new LoginResponse(token)
            )
    );
}

    @PostMapping("/verify-otp")
    public ApiResponse<String> verifyOtp(
        @Valid @RequestBody VerifyOtpRequest request) {

        authService.verifyOtp(request.getOtp());

        return new ApiResponse<>(
                true,
                "Email verified successfully",
                null
        );
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        passwordResetService.initiatePasswordReset(request.getEmail());

        return new ApiResponse<>(
                true,
                "If an account is registered with this email, a reset link has been sent.",
                null
        );
    }

    @GetMapping("/reset-password/validate")
    public ApiResponse<String> validateResetToken(
            @RequestParam String token) {

        passwordResetService.validateToken(token);

        return new ApiResponse<>(
                true,
                "Token is valid",
                null
        );
    }

    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        passwordResetService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );

        return new ApiResponse<>(
                true,
                "Password has been reset successfully",
                null
        );
    }
}