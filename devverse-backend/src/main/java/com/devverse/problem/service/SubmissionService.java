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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepo submissionsRepo;
    private final ProblemRepo problemsRepo;
    private final UserRepo userRepo;
    private final ModelMapper modelMapper;

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
}
