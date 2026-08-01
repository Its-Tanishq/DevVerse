package com.devverse.problem.service;

import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.exception.ResourceNotFoundException;
import com.devverse.problem.dto.SubmissionDTO;
import com.devverse.problem.model.Problem;
import com.devverse.problem.model.Submission;
import com.devverse.problem.repo.ProblemRepo;
import com.devverse.problem.repo.SubmissionRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import com.devverse.problem.dto.UserProblemStatusDTO;
import com.devverse.problem.dto.RunResultDTO;
import com.devverse.problem.dto.TestCaseDTO;
import com.devverse.problem.dto.CodeboxResponseDTO;
import com.devverse.problem.dto.SubmissionResultDTO;
import com.devverse.problem.model.SubmissionStatus;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepo submissionsRepo;
    private final ProblemRepo problemsRepo;
    private final UserRepo userRepo;
    private final ModelMapper modelMapper;
    private final TestCaseService testCaseService;
    private final CodeboxService codeboxService;

    public SubmissionDTO createSubmission(SubmissionDTO submissionDTO) {
        User user = userRepo.findById(submissionDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + submissionDTO.getUserId()));

        Problem problem = problemsRepo.findById(submissionDTO.getProblemsId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + submissionDTO.getProblemsId()));

        Submission submission = modelMapper.map(submissionDTO, Submission.class);
        submission.setUser(user);
        submission.setProblems(problem);

        Submission savedSubmission = submissionsRepo.save(submission);
        return modelMapper.map(savedSubmission, SubmissionDTO.class);
    }

    public List<SubmissionDTO> getAllSubmissions() {
        return submissionsRepo.findAll().stream()
                .map(submission -> modelMapper.map(submission, SubmissionDTO.class))
                .collect(Collectors.toList());
    }

    public SubmissionDTO getSubmissionById(Long id) {
        Submission submission = submissionsRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));
        return modelMapper.map(submission, SubmissionDTO.class);
    }

    public List<SubmissionDTO> getSubmissionsByUserId(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return submissionsRepo.findByUser(user).stream()
                .map(submission -> modelMapper.map(submission, SubmissionDTO.class))
                .collect(Collectors.toList());
    }

    public List<SubmissionDTO> getSubmissionsByProblemId(Long problemId) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));
        return submissionsRepo.findByProblems(problem).stream()
                .map(submission -> modelMapper.map(submission, SubmissionDTO.class))
                .collect(Collectors.toList());
    }

    public void deleteSubmission(Long id) {
        Submission submission = submissionsRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));
        submissionsRepo.delete(submission);
    }

    public UserProblemStatusDTO getUserProblemStatus(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<Submission> userSubmissions = submissionsRepo.findByUser(user);

        Set<Long> solvedIds = new HashSet<>();
        Set<Long> attemptedIds = new HashSet<>();

        userSubmissions.forEach(sub -> {
            Long probId = sub.getProblems().getID();
            if (sub.getStatus() == SubmissionStatus.ACCEPTED) {
                solvedIds.add(probId);
            } else {
                attemptedIds.add(probId);
            }
        });

        attemptedIds.removeAll(solvedIds);

        return new UserProblemStatusDTO(new ArrayList<>(solvedIds), new ArrayList<>(attemptedIds));
    }

    public List<RunResultDTO> runCode(SubmissionDTO submissionDTO) {
        List<TestCaseDTO> publicTestCases = testCaseService.getPublicTestCasesByProblemId(submissionDTO.getProblemsId());
        List<RunResultDTO> results = new ArrayList<>();

        for (TestCaseDTO testCase : publicTestCases) {
            CodeboxResponseDTO response = codeboxService.executeCode(
                    submissionDTO.getCode(),
                    submissionDTO.getLanguage().getJudge0Id(),
                    testCase.getInput(),
                    testCase.getOutput()
            );
            
            boolean isCorrect = response.getStatus() != null && response.getStatus().getId() == 3;
            
            results.add(new RunResultDTO(
                    testCase.getInput(),
                    testCase.getOutput(),
                    response.getStdout(),
                    response.getCompile_output(),
                    response.getStderr(),
                    response.getStatus(),
                    isCorrect
            ));
        }

        return results;
    }

    public SubmissionResultDTO submitCode(SubmissionDTO submissionDTO) {
        List<TestCaseDTO> allTestCases = testCaseService.getTestCasesByProblemId(submissionDTO.getProblemsId());
        
        SubmissionStatus finalStatus = SubmissionStatus.ACCEPTED;
        int maxTimeMs = 0;
        int maxMemoryKb = 0;
        
        RunResultDTO failedTestCaseResult = null;
        int passedCount = 0;
        
        if (!allTestCases.isEmpty()) {
            // Prepare batch request
            List<Map<String, Object>> batchRequests = new ArrayList<>();
            for (TestCaseDTO testCase : allTestCases) {
                Map<String, Object> req = new HashMap<>();
                req.put("source_code", submissionDTO.getCode());
                req.put("language_id", submissionDTO.getLanguage().getJudge0Id());
                req.put("stdin", testCase.getInput());
                req.put("expected_output", testCase.getOutput());
                batchRequests.add(req);
            }
            
            // Execute batch
            List<CodeboxResponseDTO> responses = codeboxService.executeCodeBatch(batchRequests);
            
            // Analyze results
            for (int i = 0; i < responses.size(); i++) {
                CodeboxResponseDTO response = responses.get(i);
                TestCaseDTO testCase = allTestCases.get(i);
                
                if (response.getTime() != null && !response.getTime().isEmpty()) {
                    try {
                        int timeMs = (int) (Float.parseFloat(response.getTime()) * 1000);
                        if (timeMs > maxTimeMs) maxTimeMs = timeMs;
                    } catch (NumberFormatException ignored) {}
                }
                
                if (response.getMemory() != null) {
                    if (response.getMemory() > maxMemoryKb) maxMemoryKb = response.getMemory();
                }
                
                if (response.getStatus() == null || response.getStatus().getId() != 3) {
                    int id = response.getStatus() != null ? response.getStatus().getId() : 0;
                    if (id == 4) finalStatus = SubmissionStatus.WRONG_ANSWER;
                    else if (id == 5) finalStatus = SubmissionStatus.TLE;
                    else finalStatus = SubmissionStatus.RUNTIME_ERROR;
                    
                    failedTestCaseResult = new RunResultDTO(
                            testCase.getInput(),
                            testCase.getOutput(),
                            response.getStdout(),
                            response.getCompile_output(),
                            response.getStderr(),
                            response.getStatus(),
                            false
                    );
                    break;
                } else {
                    passedCount++;
                }
            }
        }
        
        submissionDTO.setStatus(finalStatus);
        submissionDTO.setExecutionTimeMs(maxTimeMs);
        submissionDTO.setMemoryUsedKb(maxMemoryKb);
        
        SubmissionDTO savedSubmission = createSubmission(submissionDTO);
        
        return new SubmissionResultDTO(
                savedSubmission,
                failedTestCaseResult,
                allTestCases.size(),
                passedCount
        );
    }
}
