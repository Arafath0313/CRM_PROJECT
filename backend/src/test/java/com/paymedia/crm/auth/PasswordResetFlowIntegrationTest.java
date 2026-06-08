package com.paymedia.crm.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paymedia.crm.auth.entity.PasswordResetToken;
import com.paymedia.crm.auth.entity.User;
import com.paymedia.crm.auth.entity.VerificationToken;
import com.paymedia.crm.auth.repository.PasswordResetTokenRepository;
import com.paymedia.crm.auth.repository.UserRepository;
import com.paymedia.crm.auth.repository.VerificationTokenRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class PasswordResetFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String testEmail;
    private final String oldPassword = "OldPassword123!";
    private final String newPassword = "NewPassword123!";

    @BeforeEach
    void setUp() {
        testEmail = "test_" + UUID.randomUUID().toString() + "@integration.com";
    }

    @AfterEach
    void tearDown() {
        // Cleanup test data
        userRepository.findByEmail(testEmail).ifPresent(user -> {
            // Delete tokens first
            List<PasswordResetToken> resetTokens = passwordResetTokenRepository.findAll();
            for (PasswordResetToken t : resetTokens) {
                if (t.getUser().getId().equals(user.getId())) {
                    passwordResetTokenRepository.delete(t);
                }
            }
            List<VerificationToken> verTokens = verificationTokenRepository.findAll();
            for (VerificationToken t : verTokens) {
                if (t.getUser().getId().equals(user.getId())) {
                    verificationTokenRepository.delete(t);
                }
            }
            userRepository.delete(user);
        });
    }

    @Test
    void testCompletePasswordResetFlow() throws Exception {
        // 1. Register User
        Map<String, String> regRequest = new HashMap<>();
        regRequest.put("fullName", "Integration Test User");
        regRequest.put("email", testEmail);
        regRequest.put("mobileNumber", "+923009999999");
        regRequest.put("password", oldPassword);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Get user and OTP
        User user = userRepository.findByEmail(testEmail)
                .orElseThrow(() -> new AssertionError("User not found in database after registration"));

        // Retrieve Verification Token
        List<VerificationToken> tokens = verificationTokenRepository.findAll();
        VerificationToken verificationToken = tokens.stream()
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Verification token not found"));

        String otp = verificationToken.getOtp();
        assertNotNull(otp);

        // 2. Verify OTP
        Map<String, String> verifyRequest = new HashMap<>();
        verifyRequest.put("otp", otp);

        mockMvc.perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 3. Login with Old Password (Should work)
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", testEmail);
        loginRequest.put("password", oldPassword);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").exists());

        // 4. Request Password Reset
        Map<String, String> forgotRequest = new HashMap<>();
        forgotRequest.put("email", testEmail);

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forgotRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Retrieve Password Reset Token
        List<PasswordResetToken> resetTokens = passwordResetTokenRepository.findAll();
        PasswordResetToken resetTokenEntity = resetTokens.stream()
                .filter(t -> t.getUser().getId().equals(user.getId()) && !t.getUsed())
                .findFirst()
                .orElseThrow(() -> new AssertionError("Password reset token not found in database"));

        String resetToken = resetTokenEntity.getToken();
        assertNotNull(resetToken);

        // 5. Validate Password Reset Token
        mockMvc.perform(get("/api/auth/reset-password/validate")
                        .param("token", resetToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Token is valid"));

        // 6. Reset Password
        Map<String, String> resetRequest = new HashMap<>();
        resetRequest.put("token", resetToken);
        resetRequest.put("newPassword", newPassword);

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 7. Verify One-Time Token Usage (Second validation/reset should fail)
        mockMvc.perform(get("/api/auth/reset-password/validate")
                        .param("token", resetToken))
                .andExpect(status().isInternalServerError()); // Custom/default exception handler error

        // 8. Try to login with Old Password (Should fail)
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isInternalServerError()); // In case of failed login due to mismatch throw exception

        // 9. Login with New Password (Should succeed)
        Map<String, String> newLoginRequest = new HashMap<>();
        newLoginRequest.put("email", testEmail);
        newLoginRequest.put("password", newPassword);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newLoginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").exists());
    }
}
