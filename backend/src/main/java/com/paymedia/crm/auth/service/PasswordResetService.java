package com.paymedia.crm.auth.service;

import com.paymedia.crm.auth.entity.PasswordResetToken;
import com.paymedia.crm.auth.entity.User;
import com.paymedia.crm.auth.repository.PasswordResetTokenRepository;
import com.paymedia.crm.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void initiatePasswordReset(String email) {
        log.info("Initiating password reset request for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account registered with this email address"));

        // Invalidate any previous unused tokens for the user
        List<PasswordResetToken> activeTokens = tokenRepository.findByUserAndUsedFalse(user);
        for (PasswordResetToken activeToken : activeTokens) {
            activeToken.setUsed(true);
        }
        tokenRepository.saveAll(activeTokens);

        // Generate secure reset token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);

        tokenRepository.save(resetToken);

        // Send reset email (contains frontend Reset Password path)
        String resetLink = "http://localhost:5173/reset-password/" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), resetLink);

        log.info("Successfully registered password reset token for {}", email);
    }

    public User validateToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid password reset token"));

        if (Boolean.TRUE.equals(resetToken.getUsed())) {
            throw new RuntimeException("This password reset token has already been used");
        }

        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This password reset token has expired (valid for 15 minutes)");
        }

        return resetToken.getUser();
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        log.info("Attempting password reset using token");
        
        // This validates existence, usage, and expiration
        User user = validateToken(token);

        // Update password using BCrypt encoder
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark the token as used so it cannot be reused
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token not found during update"));
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        log.info("Successfully updated password for user: {}", user.getEmail());
    }
}
