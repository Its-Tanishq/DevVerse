package com.devverse.problem.service;

import com.devverse.common.PageResponse;
import com.devverse.problem.dto.ProblemDTO;
import com.devverse.problem.model.Problem;
import com.devverse.problem.repo.ProblemRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.devverse.problem.model.Company;
import com.devverse.problem.model.Tag;
import com.devverse.problem.model.Difficulty;

import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import com.devverse.problem.dto.UserProblemStatusDTO;
import com.devverse.problem.dto.UserProblemWorkspaceDTO;
import java.util.Set;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepo problemsRepo;
    private final ModelMapper modelMapper;
    private final SubmissionService submissionService;
    private final UserProblemWorkspaceService workspaceService;

    @Transactional
    public ProblemDTO createProblem(ProblemDTO problemsDTO) {

        if (problemsRepo.findByTitle(problemsDTO.getTitle()).isPresent()) {
            throw new IllegalArgumentException("Problem with title " + problemsDTO.getTitle() + " already exists");
        }

        String slug = problemsDTO.getTitle().replace(" ", "-");

        if (problemsRepo.findBySlug(slug).isPresent()) {
            throw new IllegalArgumentException("Problem with slug " + slug + " already exists");
        }

        Problem problem = modelMapper.map(problemsDTO, Problem.class);
        problem.setSlug(slug);

        Problem saveProblem = problemsRepo.save(problem);

        return modelMapper.map(saveProblem, ProblemDTO.class);
    }

    @Transactional
    public ProblemDTO updateProblem(Long id, ProblemDTO problemsDTO) {
        Problem problem = problemsRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + id + " not found"));

        if (problemsDTO.getTitle() != null) problem.setTitle(problemsDTO.getTitle());
        if (problemsDTO.getDescription() != null) problem.setDescription(problemsDTO.getDescription());
        if (problemsDTO.getDifficulty() != null) problem.setDifficulty(problemsDTO.getDifficulty());
        if (problemsDTO.getHints() != null) problem.setHints(problemsDTO.getHints());
        if (problemsDTO.getIsPremium() != null) problem.setPremium(Boolean.TRUE.equals(problemsDTO.getIsPremium()));

        if (problemsDTO.getCompanies() != null && !problemsDTO.getCompanies().isEmpty()) {
            problem.setCompanies(problemsDTO.getCompanies().stream()
                    .map(companyDTO -> modelMapper.map(companyDTO, Company.class))
                    .collect(Collectors.toList()));
        }

        if (problemsDTO.getTags() != null && !problemsDTO.getTags().isEmpty()) {
            problem.setTags(problemsDTO.getTags().stream()
                    .map(tagDTO -> modelMapper.map(tagDTO, Tag.class))
                    .collect(Collectors.toList()));
        }

        Problem updatedProblem = problemsRepo.save(problem);
        return modelMapper.map(updatedProblem, ProblemDTO.class);
    }

    @Transactional
    public void deleteProblem(Long id) {
        Problem problem = problemsRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + id + " not found"));
        problemsRepo.delete(problem);
    }

    public PageResponse<ProblemDTO> getProblems(Difficulty difficulty, String tag, String company, String status, Long userId, int page, int size) {
        Page<ProblemDTO> problemsPage = problemsRepo.findFilteredProblems(difficulty, tag, company, status, userId, PageRequest.of(page, size))
                .map(p -> modelMapper.map(p, ProblemDTO.class));
        
        if (userId != null) {
            UserProblemStatusDTO userStatus = submissionService.getUserProblemStatus(userId);
            List<UserProblemWorkspaceDTO> bookmarkedWorkspaces = workspaceService.getBookmarkedWorkspaces(userId);
            Set<Long> bookmarkedIds = bookmarkedWorkspaces.stream().map(UserProblemWorkspaceDTO::getProblemsId).collect(Collectors.toSet());

            problemsPage.getContent().forEach(p -> {
                if (userStatus.getSolvedProblemIds() != null && userStatus.getSolvedProblemIds().contains(p.getID())) {
                    p.setStatus("solved");
                } else if (userStatus.getAttemptedProblemIds() != null && userStatus.getAttemptedProblemIds().contains(p.getID())) {
                    p.setStatus("attempted");
                } else {
                    p.setStatus("unsolved");
                }
                p.setBookmarked(bookmarkedIds.contains(p.getID()));
            });
        }

        return new PageResponse<>(
                problemsPage.getContent(),
                problemsPage.getNumber(),
                problemsPage.getTotalPages(),
                problemsPage.getTotalElements(),
                problemsPage.isLast()
        );
    }

    public ProblemDTO getProblemById(Long id) {
        Problem problem = problemsRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + id + " not found"));
        return modelMapper.map(problem, ProblemDTO.class);
    }

    public ProblemDTO getProblemBySlug(String slug) {
        Problem problem = problemsRepo.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Problem with slug " + slug + " not found"));
        return modelMapper.map(problem, ProblemDTO.class);
    }

    public Map<String, Long> getProblemCountsByDifficulty() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("easy", problemsRepo.countByDifficulty(Difficulty.EASY));
        counts.put("medium", problemsRepo.countByDifficulty(Difficulty.MEDIUM));
        counts.put("hard", problemsRepo.countByDifficulty(Difficulty.HARD));
        return counts;
    }
}
