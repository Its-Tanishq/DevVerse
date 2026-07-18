package com.devverse.authentication.repo;


import com.devverse.authentication.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import com.devverse.authentication.model.User;

public interface RefreshTokenRepo extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByJti(String jti);
    
    void deleteByUser(User user);
}
