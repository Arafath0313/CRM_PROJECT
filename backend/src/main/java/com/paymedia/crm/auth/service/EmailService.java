package com.paymedia.crm.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String recipientEmail, String userName, String resetLink) {
        log.info("Initiating password reset email to: {}", recipientEmail);

        String emailBody = String.format(
            "Hello %s,\n\n" +
            "You have requested to reset your password. Please use the following link to reset your password:\n" +
            "%s\n\n" +
            "Note: This link is valid for 15 minutes.\n\n" +
            "If you did not request a password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "PayMedia CRM Team",
            userName, resetLink
        );

        if (mailSender == null) {
            log.warn("[DEVELOPMENT FALLBACK] JavaMailSender is not configured. Reset link logged below:");
            log.info("Reset Link for {}: {}", recipientEmail, resetLink);
            System.out.println("==================================================");
            System.out.println("DEVELOPMENT MODE: PASSWORD RESET EMAIL SIMULATION");
            System.out.println("To: " + recipientEmail);
            System.out.println("Subject: Password Reset Request");
            System.out.println("Link: " + resetLink);
            System.out.println("==================================================");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipientEmail);
            message.setSubject("Password Reset Request");
            message.setText(emailBody);
            mailSender.send(message);
            log.info("Password reset email sent successfully to {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send email via SMTP, falling back to console logging. Error: {}", e.getMessage());
            log.info("Reset Link for {}: {}", recipientEmail, resetLink);
            System.out.println("==================================================");
            System.out.println("DEVELOPMENT FALLBACK: PASSWORD RESET EMAIL");
            System.out.println("To: " + recipientEmail);
            System.out.println("Subject: Password Reset Request");
            System.out.println("Link: " + resetLink);
            System.out.println("==================================================");
        }
    }
}
