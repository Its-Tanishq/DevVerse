package com.devverse.problem.repo;

import com.devverse.problem.model.DailyChallenges;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyChallengeRepo extends JpaRepository<DailyChallenges, Long> {
    Optional<DailyChallenges> findByDate(LocalDate date);
}
