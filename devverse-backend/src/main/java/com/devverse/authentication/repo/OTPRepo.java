package com.devverse.authentication.repo;

import com.devverse.authentication.model.OTP;
import com.devverse.authentication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface OTPRepo extends JpaRepository<OTP, Long> {
    Optional<OTP> findTopByUserAndRevokedFalseOrderByCreatedAtDesc(User user);
    int countByUserAndCreatedAtAfter(User user, Instant time);
    List<OTP> findByUserAndRevokedFalse(User user);
}
