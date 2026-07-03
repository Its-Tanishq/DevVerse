package com.devverse.problem.service;

import com.devverse.problem.dto.ProblemBoilerplateDTO;
import com.devverse.problem.repo.ProblemBoilerplateRepo;
import com.devverse.problem.repo.ProblemRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.devverse.problem.model.ProblemBoilerplate;
import com.devverse.problem.model.Problem;
import com.devverse.problem.model.Language;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemBoilerplateService {

    private final ProblemBoilerplateRepo problemBoilerplateRepo;
    private final ProblemRepo problemsRepo;
    private final ModelMapper modelMapper;

    @Transactional
    public ProblemBoilerplateDTO createProblemBoilerplate(ProblemBoilerplateDTO dto) {
        Problem problem = problemsRepo.findById(dto.getProblemsId())
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + dto.getProblemsId() + " not found"));

        if (problemBoilerplateRepo.findByProblemsAndLanguage(problem, dto.getLanguage()).isPresent()) {
            throw new IllegalArgumentException("Boilerplate for this problem and language already exists");
        }

        ProblemBoilerplate boilerplate = modelMapper.map(dto, ProblemBoilerplate.class);
        boilerplate.setProblems(problem);
        ProblemBoilerplate savedBoilerplate = problemBoilerplateRepo.save(boilerplate);
        
        return mapToDTO(savedBoilerplate);
    }

    @Transactional
    public ProblemBoilerplateDTO updateProblemBoilerplate(ProblemBoilerplateDTO dto) {
        ProblemBoilerplate boilerplate = problemBoilerplateRepo.findById(dto.getID())
                .orElseThrow(() -> new IllegalArgumentException("Boilerplate not found with id " + dto.getID()));
        
        boilerplate.setLanguage(dto.getLanguage());
        boilerplate.setBoilerplate(dto.getBoilerplate());
        
        if (!boilerplate.getProblems().getID().equals(dto.getProblemsId())) {
            Problem problem = problemsRepo.findById(dto.getProblemsId())
                    .orElseThrow(() -> new IllegalArgumentException("Problem with id " + dto.getProblemsId() + " not found"));
            boilerplate.setProblems(problem);
        }

        ProblemBoilerplate updatedBoilerplate = problemBoilerplateRepo.save(boilerplate);
        return mapToDTO(updatedBoilerplate);
    }

    @Transactional
    public void deleteProblemBoilerplate(Long bolierplateId) {
        ProblemBoilerplate boilerplate = problemBoilerplateRepo.findById(bolierplateId)
                .orElseThrow(() -> new IllegalArgumentException("Boilerplate not found with id " + bolierplateId));
        problemBoilerplateRepo.delete(boilerplate);
    }

    public List<ProblemBoilerplateDTO> getBoilerplatesByProblemId(Long problemId) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + problemId + " not found"));
        
        return problemBoilerplateRepo.findByProblems(problem).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProblemBoilerplateDTO getBoilerplateByProblemIdAndLanguage(Long problemId, Language language) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + problemId + " not found"));
        
        ProblemBoilerplate boilerplate = problemBoilerplateRepo.findByProblemsAndLanguage(problem, language)
                .orElseThrow(() -> new IllegalArgumentException("Boilerplate not found for given problem and language"));
        
        return mapToDTO(boilerplate);
    }

    public ProblemBoilerplateDTO getBoilerplateById(Long id) {
        ProblemBoilerplate boilerplate = problemBoilerplateRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Boilerplate not found with id " + id));
        return mapToDTO(boilerplate);
    }

    private ProblemBoilerplateDTO mapToDTO(ProblemBoilerplate boilerplate) {
        ProblemBoilerplateDTO dto = modelMapper.map(boilerplate, ProblemBoilerplateDTO.class);
        dto.setProblemsId(boilerplate.getProblems().getID());
        return dto;
    }
}
