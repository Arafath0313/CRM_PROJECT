package com.paymedia.crm.auth.repository;

import com.paymedia.crm.auth.entity.PasswordResetToken;
import com.paymedia.crm.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findByToken(String token);

    List<PasswordResetToken> findByUserAndUsedFalse(User user);
}
