package com.paymedia.crm.auth.service;

import com.paymedia.crm.auth.dto.LoginRequest;
import com.paymedia.crm.auth.dto.RegisterRequest;
import com.paymedia.crm.auth.entity.User;
import com.paymedia.crm.auth.entity.VerificationToken;
import com.paymedia.crm.auth.enums.Role;
import com.paymedia.crm.auth.enums.UserStatus;
import com.paymedia.crm.auth.repository.UserRepository;
import com.paymedia.crm.auth.repository.VerificationTokenRepository;
import com.paymedia.crm.security.jwt.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository verificationTokenRepository;
    private final JwtService jwtService;

    // ==========================
    // REGISTER
    // ==========================
    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());

        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        user.setStatus(UserStatus.PENDING_VERIFICATION);

        // Default Role
        user.setRole(Role.SALES);

        userRepository.save(user);

        // Generate OTP
        String otp = generateOtp();

        VerificationToken token = new VerificationToken();

        token.setOtp(otp);
        token.setUser(user);
        token.setExpiryTime(
                LocalDateTime.now().plusMinutes(10)
        );

        verificationTokenRepository.save(token);

        System.out.println("================================");
        System.out.println("USER REGISTERED");
        System.out.println("OTP: " + otp);
        System.out.println("EMAIL: " + user.getEmail());
        System.out.println("ROLE: " + user.getRole());
        System.out.println("STATUS: " + user.getStatus());
        System.out.println("================================");
    }

    // ==========================
    // LOGIN
    // ==========================
    public String login(LoginRequest request) {

        System.out.println("================================");
        System.out.println("LOGIN ATTEMPT");
        System.out.println("EMAIL: " + request.getEmail());
        System.out.println("================================");

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPasswordHash());

        if (!passwordMatches) {

            System.out.println("PASSWORD MISMATCH");

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        if (user.getStatus() != UserStatus.ACTIVE) {

            System.out.println(
                    "USER NOT VERIFIED. STATUS = "
                            + user.getStatus()
            );

            throw new RuntimeException(
                    "Please verify your email before login"
            );
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        System.out.println("LOGIN SUCCESS");
        System.out.println("JWT GENERATED");

        return token;
    }

    // ==========================
    // VERIFY OTP
    // ==========================
    @Transactional
    public void verifyOtp(String otp) {

        System.out.println("================================");
        System.out.println("VERIFY OTP CALLED");
        System.out.println("OTP RECEIVED: " + otp);
        System.out.println("================================");

        VerificationToken token =
                verificationTokenRepository
                        .findByOtp(otp)
                        .orElseThrow(() ->
                                new RuntimeException("Invalid OTP"));

        System.out.println("TOKEN FOUND");

        if (token.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "OTP has expired"
            );
        }

        User user = token.getUser();

        System.out.println(
                "USER FOUND: " + user.getEmail()
        );

        System.out.println(
                "CURRENT STATUS: " + user.getStatus()
        );

        user.setStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        System.out.println(
                "USER STATUS UPDATED TO ACTIVE"
        );

        verificationTokenRepository.delete(token);

        System.out.println("TOKEN DELETED");

        System.out.println("================================");
        System.out.println(
                "EMAIL VERIFIED: " + user.getEmail()
        );
        System.out.println(
                "NEW STATUS: " + user.getStatus()
        );
        System.out.println("================================");
    }

    // ==========================
    // OTP GENERATOR
    // ==========================
    private String generateOtp() {

        return String.valueOf(
                100000 + new Random().nextInt(900000)
        );
    }
}