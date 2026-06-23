package com.devverse.authentication.service;

import com.devverse.exception.ResourceNotFoundException;
import com.devverse.authentication.model.OTP;
import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.OTPRepo;
import com.devverse.authentication.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OTPService {

    private final OTPRepo otpRepo;
    private final UserRepo userRepo;
    private final EmailService emailService;

    public void generateAndSendOTP(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
        int attempts = otpRepo.countByUserAndCreatedAtAfter(user, oneHourAgo);

        if (attempts >= 3) {
            throw new RuntimeException("Rate limit exceeded. Please try again after an hour.");
        }

        List<OTP> activeOtps = otpRepo.findByUserAndRevokedFalse(user);
        activeOtps.forEach(otp -> otp.setRevoked(true));
        otpRepo.saveAll(activeOtps);

        String otpCode = String.valueOf(100000 + new Random().nextInt(900000));

        OTP otp = OTP.builder()
                .otpCode(otpCode)
                .user(user)
                .expiryDate(Instant.now().plus(10, ChronoUnit.MINUTES))
                .build();

        otpRepo.save(otp);

        Map<String, Object> variables = new HashMap<>();
        variables.put("otp", otpCode);
        emailService.sendMail(user.getEmail(), "Password Reset OTP", "forgot-password", variables);
    }

    public void verifyOTP(String email, String otpCode) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        OTP otp = otpRepo.findTopByUserAndRevokedFalseOrderByCreatedAtDesc(user)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

        if (!otp.getOtpCode().equals(otpCode)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (otp.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("OTP has expired");
        }
    }

    public void revokeOTP(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        OTP otp = otpRepo.findTopByUserAndRevokedFalseOrderByCreatedAtDesc(user)
                .orElse(null);

        if (otp != null) {
            otp.setRevoked(true);
            otpRepo.save(otp);
        }
    }
}
