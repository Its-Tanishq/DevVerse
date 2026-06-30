package com.devverse.problem.service;

import com.devverse.common.PageResponse;
import com.devverse.problem.dto.ProblemsDTO;
import com.devverse.problem.model.Problems;
import com.devverse.problem.repo.ProblemsRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.devverse.problem.model.Company;
import com.devverse.problem.model.Tags;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemsRepo problemsRepo;
    private final ModelMapper modelMapper;

    @Transactional
    public ProblemsDTO createProblem(ProblemsDTO problemsDTO) {

        if (problemsRepo.findByTitle(problemsDTO.getTitle()).isPresent()) {
            throw new IllegalArgumentException("Problem with title " + problemsDTO.getTitle() + " already exists");
        }

        String slug = problemsDTO.getTitle().replace(" ", "-");

        if (problemsRepo.findBySlug(slug).isPresent()) {
            throw new IllegalArgumentException("Problem with slug " + slug + " already exists");
        }

        Problems problem = modelMapper.map(problemsDTO, Problems.class);
        problem.setSlug(slug);

        Problems saveProblem = problemsRepo.save(problem);

        return modelMapper.map(saveProblem, ProblemsDTO.class);
    }

    @Transactional
    public ProblemsDTO updateProblem(ProblemsDTO problemsDTO) {
        Problems problem = problemsRepo.findById(problemsDTO.getID())
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
                    .map(tagDTO -> modelMapper.map(tagDTO, Tags.class))
                    .collect(Collectors.toList()));
        }

        Problems updatedProblem = problemsRepo.save(problem);
        return modelMapper.map(updatedProblem, ProblemsDTO.class);
    }

    @Transactional
    public void deleteProblem(Long id) {
        Problems problem = problemsRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + id + " not found"));
        problemsRepo.delete(problem);
    }

    public PageResponse<ProblemsDTO> getProblems(int page, int size) {
        Page<ProblemsDTO> problemsPage = problemsRepo.findAll(PageRequest.of(page, size))
                .map(p -> modelMapper.map(p, ProblemsDTO.class));

        return new PageResponse<>(
                problemsPage.getContent(),
                problemsPage.getNumber(),
                problemsPage.getTotalPages(),
                problemsPage.getTotalElements(),
                problemsPage.isLast()
        );
    }

    public ProblemsDTO getProblemById(Long id) {
        Problems problem = problemsRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + id + " not found"));
        return modelMapper.map(problem, ProblemsDTO.class);
    }

    public ProblemsDTO getProblemBySlug(String slug) {
        Problems problem = problemsRepo.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Problem with slug " + slug + " not found"));
        return modelMapper.map(problem, ProblemsDTO.class);
    }
}
