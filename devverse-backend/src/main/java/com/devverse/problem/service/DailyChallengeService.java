package com.devverse.problem.service;

import com.devverse.common.PageResponse;
import com.devverse.exception.ResourceNotFoundException;
import com.devverse.problem.dto.DailyChallengeDTO;
import com.devverse.problem.model.DailyChallenge;
import com.devverse.problem.model.Problem;
import com.devverse.problem.repo.DailyChallengeRepo;
import com.devverse.problem.repo.ProblemRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyChallengeService {

    private final DailyChallengeRepo dailyChallengeRepo;
    private final ProblemRepo problemsRepo;
    private final ModelMapper modelMapper;

    @Transactional
    public DailyChallengeDTO createDailyChallenge(DailyChallengeDTO dailyChallengeDTO) {
        Problem problem = problemsRepo.findById(dailyChallengeDTO.getProblemsId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + dailyChallengeDTO.getProblemsId()));

        DailyChallenge dailyChallenge = modelMapper.map(dailyChallengeDTO, DailyChallenge.class);
        dailyChallenge.setProblems(problem);

        DailyChallenge saved = dailyChallengeRepo.save(dailyChallenge);
        return modelMapper.map(saved, DailyChallengeDTO.class);
    }

    @Transactional
    public DailyChallengeDTO updateDailyChallenge(Long dailyChallengeId, DailyChallengeDTO dailyChallengeDTO) {
        DailyChallenge existing = dailyChallengeRepo.findById(dailyChallengeId)
                .orElseThrow(() -> new ResourceNotFoundException("DailyChallenge not found with id: " + dailyChallengeId));

        if (dailyChallengeDTO.getProblemsId() != null) {
            Problem problem = problemsRepo.findById(dailyChallengeDTO.getProblemsId())
                    .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + dailyChallengeDTO.getProblemsId()));
            existing.setProblems(problem);
        }
        
        if (dailyChallengeDTO.getDate() != null) {
            existing.setDate(dailyChallengeDTO.getDate());
        }

        DailyChallenge updated = dailyChallengeRepo.save(existing);
        return modelMapper.map(updated, DailyChallengeDTO.class);
    }

    @Transactional
    public void deleteDailyChallenge(Long dailyChallengeId) {
        DailyChallenge existing = dailyChallengeRepo.findById(dailyChallengeId)
                .orElseThrow(() -> new ResourceNotFoundException("DailyChallenge not found with id: " + dailyChallengeId));
        dailyChallengeRepo.delete(existing);
    }

    public PageResponse<DailyChallengeDTO> getAllDailyChallenges(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DailyChallenge> dailyChallengesPage = dailyChallengeRepo.findAll(pageable);

        List<DailyChallengeDTO> content = dailyChallengesPage.getContent().stream()
                .map(challenge -> modelMapper.map(challenge, DailyChallengeDTO.class))
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                dailyChallengesPage.getNumber(),
                dailyChallengesPage.getTotalPages(),
                dailyChallengesPage.getTotalElements(),
                dailyChallengesPage.isLast()
        );
    }

    public DailyChallengeDTO getDailyChallengeById(Long dailyChallengeId) {
        DailyChallenge dailyChallenge = dailyChallengeRepo.findById(dailyChallengeId)
                .orElseThrow(() -> new ResourceNotFoundException("DailyChallenge not found with id: " + dailyChallengeId));
        return modelMapper.map(dailyChallenge, DailyChallengeDTO.class);
    }

    public DailyChallengeDTO getDailyChallengeByDate(LocalDate date) {
        DailyChallenge dailyChallenge = dailyChallengeRepo.findByDate(date)
                .orElseThrow(() -> new ResourceNotFoundException("DailyChallenge not found for date: " + date));
        return modelMapper.map(dailyChallenge, DailyChallengeDTO.class);
    }

    @Transactional
    public DailyChallengeDTO autoAssign(LocalDate date) {
        if (dailyChallengeRepo.findByDate(date).isPresent()) {
            throw new IllegalArgumentException("Daily challenge already exists for date: " + date);
        }

        Problem randomProblem = problemsRepo.findRandomUnusedProblem()
                .orElseThrow(() -> new ResourceNotFoundException("No unused problems available for auto-assignment"));

        DailyChallenge dailyChallenge = DailyChallenge.builder()
                .problems(randomProblem)
                .date(date)
                .build();

        DailyChallenge saved = dailyChallengeRepo.save(dailyChallenge);
        return modelMapper.map(saved, DailyChallengeDTO.class);
    }

    public List<DailyChallengeDTO> getSchedule(LocalDate startDate, LocalDate endDate) {
        List<DailyChallenge> challenges = dailyChallengeRepo.findByDateBetween(startDate, endDate);
        return challenges.stream()
                .map(challenge -> modelMapper.map(challenge, DailyChallengeDTO.class))
                .collect(Collectors.toList());
    }
}
