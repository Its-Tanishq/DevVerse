package com.devverse.problem.service;

import com.devverse.problem.dto.CompanyDTO;
import com.devverse.problem.repo.CompanyRepo;

import com.devverse.problem.dto.CompanyDTO;
import com.devverse.problem.repo.CompanyRepo;
import com.devverse.problem.repo.ProblemRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import com.devverse.problem.model.Company;
import com.devverse.problem.model.Problem;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepo companiesRepo;
    private final ProblemRepo problemsRepo;
    private final ModelMapper modelMapper;

    @Transactional
    public CompanyDTO createCompany(CompanyDTO companyDTO) {
        if (companiesRepo.findByName(companyDTO.getName()).isPresent()) {
            throw new IllegalArgumentException("Company already exists");
        }
        Company company = modelMapper.map(companyDTO, Company.class);
        company = companiesRepo.save(company);
        return modelMapper.map(company, CompanyDTO.class);
    }

    @Transactional
    public CompanyDTO updateCompany(CompanyDTO companyDTO) {
        Company company = companiesRepo.findById(companyDTO.getID())
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        company.setName(companyDTO.getName());
        company = companiesRepo.save(company);
        return modelMapper.map(company, CompanyDTO.class);
    }

    @Transactional
    public void deleteCompany(Long companyId) {
        Company company = companiesRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        
        List<Problem> problems = problemsRepo.findByCompanies(company);
        for (Problem problem : problems) {
            problem.getCompanies().remove(company);
            problemsRepo.save(problem);
        }
        
        companiesRepo.delete(company);
    }

    @Transactional
    public void updateProblemCompany(Long problemId, Long companyId) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found"));
        Company company = companiesRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        
        if (!problem.getCompanies().contains(company)) {
            problem.getCompanies().add(company);
            problemsRepo.save(problem);
        }
    }

    @Transactional
    public void deleteProblemCompany(Long problemId, Long companyId) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found"));
        Company company = companiesRepo.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        
        if (problem.getCompanies().contains(company)) {
            problem.getCompanies().remove(company);
            problemsRepo.save(problem);
        }
    }

    public List<CompanyDTO> getAllCompanies() {
        return companiesRepo.findAll().stream()
                .map(company -> modelMapper.map(company, CompanyDTO.class))
                .collect(Collectors.toList());
    }

    public CompanyDTO getCompanyById(Long id) {
        Company company = companiesRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        return modelMapper.map(company, CompanyDTO.class);
    }
}
