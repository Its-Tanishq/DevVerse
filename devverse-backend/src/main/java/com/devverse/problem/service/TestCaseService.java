package com.devverse.problem.service;

import com.devverse.exception.ResourceNotFoundException;
import com.devverse.problem.dto.TestCaseDTO;
import com.devverse.problem.model.Problem;
import com.devverse.problem.model.TestCase;
import com.devverse.problem.repo.ProblemRepo;
import com.devverse.problem.repo.TestCaseRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.devverse.admin.service.ActivityLogService;

@Service
@RequiredArgsConstructor
public class TestCaseService {

    private final TestCaseRepo testCasesRepo;
    private final ProblemRepo problemsRepo;
    private final ModelMapper modelMapper;
    private final ActivityLogService activityLogService;

    @Transactional
    public TestCaseDTO createTestCase(TestCaseDTO testCaseDTO) {
        Problem problem = problemsRepo.findById(testCaseDTO.getProblemsId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + testCaseDTO.getProblemsId()));

        TestCase testCase = modelMapper.map(testCaseDTO, TestCase.class);
        testCase.setProblems(problem);

        TestCase saved = testCasesRepo.save(testCase);

        activityLogService.logActivity(
                "Test case added to problem '" + problem.getTitle() + "'",
                "TEST_CASE",
                saved.getID(),
                "INFO",
                "#10b981" // emerald
        );

        return modelMapper.map(saved, TestCaseDTO.class);
    }

    @Transactional
    public TestCaseDTO updateTestCase(Long testCaseId, TestCaseDTO testCaseDTO) {
        TestCase existing = testCasesRepo.findById(testCaseId)
                .orElseThrow(() -> new ResourceNotFoundException("TestCase not found with id: " + testCaseId));

        if (testCaseDTO.getProblemsId() != null) {
            Problem problem = problemsRepo.findById(testCaseDTO.getProblemsId())
                    .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + testCaseDTO.getProblemsId()));
            existing.setProblems(problem);
        }

        if (testCaseDTO.getInput() != null) {
            existing.setInput(testCaseDTO.getInput());
        }
        
        if (testCaseDTO.getOutput() != null) {
            existing.setOutput(testCaseDTO.getOutput());
        }
        
        if (testCaseDTO.getIsHidden() != null) {
            existing.setIsHidden(testCaseDTO.getIsHidden());
        }

        TestCase updated = testCasesRepo.save(existing);
        
        activityLogService.logActivity(
                "Test case updated for problem '" + updated.getProblems().getTitle() + "'",
                "TEST_CASE",
                updated.getID(),
                "INFO",
                "#10b981" // emerald
        );

        return modelMapper.map(updated, TestCaseDTO.class);
    }

    @Transactional
    public void deleteTestCase(Long testCaseId) {
        TestCase existing = testCasesRepo.findById(testCaseId)
                .orElseThrow(() -> new ResourceNotFoundException("TestCase not found with id: " + testCaseId));
        
        activityLogService.logActivity(
                "Test case deleted from problem '" + existing.getProblems().getTitle() + "'",
                "TEST_CASE",
                existing.getID(),
                "WARNING",
                "#f97316" // orange
        );

        testCasesRepo.delete(existing);
    }

    public List<TestCaseDTO> getTestCasesByProblemId(Long problemId) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));
        
        List<TestCase> testCases = testCasesRepo.findByProblems(problem);
        return testCases.stream()
                .map(tc -> modelMapper.map(tc, TestCaseDTO.class))
                .collect(Collectors.toList());
    }

    public TestCaseDTO getTestCaseById(Long testCaseId) {
        TestCase testCase = testCasesRepo.findById(testCaseId)
                .orElseThrow(() -> new ResourceNotFoundException("TestCase not found with id: " + testCaseId));
        return modelMapper.map(testCase, TestCaseDTO.class);
    }

    public List<TestCaseDTO> getPublicTestCasesByProblemId(Long problemId) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));

        List<TestCase> publicTestCases = testCasesRepo.findByProblemsAndIsHiddenFalse(problem);
        return publicTestCases.stream()
                .map(tc -> modelMapper.map(tc, TestCaseDTO.class))
                .collect(Collectors.toList());
    }
}
