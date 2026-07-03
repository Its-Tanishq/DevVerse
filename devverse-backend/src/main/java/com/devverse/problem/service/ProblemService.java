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

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepo problemsRepo;
    private final ModelMapper modelMapper;

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
    public ProblemDTO updateProblem(ProblemDTO problemsDTO) {
        Problem problem = problemsRepo.findById(problemsDTO.getID())
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + problemsDTO.getID() + " not found"));

        problem.setTitle(problemsDTO.getTitle());
        problem.setDescription(problemsDTO.getDescription());
        problem.setDifficulty(problemsDTO.getDifficulty());
        problem.setHints(problemsDTO.getHints());
        problem.setPremium(problemsDTO.isPremium());

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

    public PageResponse<ProblemDTO> getProblems(int page, int size) {
        Page<ProblemDTO> problemsPage = problemsRepo.findAll(PageRequest.of(page, size))
                .map(p -> modelMapper.map(p, ProblemDTO.class));

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
}
