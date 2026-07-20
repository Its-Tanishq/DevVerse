package com.devverse.problem.repo;

import com.devverse.problem.model.DailyChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyChallengeRepo extends JpaRepository<DailyChallenge, Long> {
    Optional<DailyChallenge> findByDate(LocalDate date);
    List<DailyChallenge> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
