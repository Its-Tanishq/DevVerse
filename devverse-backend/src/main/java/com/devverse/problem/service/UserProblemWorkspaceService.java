package com.devverse.problem.service;

import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.exception.ResourceNotFoundException;
import com.devverse.problem.dto.UserProblemWorkspaceDTO;
import com.devverse.problem.model.Problem;
import com.devverse.problem.model.UserProblemWorkspace;
import com.devverse.problem.repo.ProblemRepo;
import com.devverse.problem.repo.UserProblemWorkspaceRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProblemWorkspaceService {

    private final UserProblemWorkspaceRepo workspaceRepo;
    private final UserRepo userRepo;
    private final ProblemRepo problemsRepo;
    private final ModelMapper modelMapper;

    @Transactional
    public UserProblemWorkspaceDTO createOrUpdateWorkspace(UserProblemWorkspaceDTO dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));

        Problem problem = problemsRepo.findById(dto.getProblemsId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + dto.getProblemsId()));

        Optional<UserProblemWorkspace> existingOpt = workspaceRepo.findByUserAndProblems(user, problem);
        
        UserProblemWorkspace workspace;
        if (existingOpt.isPresent()) {
            workspace = existingOpt.get();
            workspace.setIsBookmark(dto.getIsBookmark());
            workspace.setNotes(dto.getNotes());
        } else {
            workspace = modelMapper.map(dto, UserProblemWorkspace.class);
            workspace.setUser(user);
            workspace.setProblems(problem);
        }

        UserProblemWorkspace saved = workspaceRepo.save(workspace);
        return modelMapper.map(saved, UserProblemWorkspaceDTO.class);
    }

    public UserProblemWorkspaceDTO getWorkspace(Long userId, Long problemId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));

        UserProblemWorkspace workspace = workspaceRepo.findByUserAndProblems(user, problem)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found for user and problem"));

        return modelMapper.map(workspace, UserProblemWorkspaceDTO.class);
    }

    public List<UserProblemWorkspaceDTO> getUserWorkspaces(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<UserProblemWorkspace> workspaces = workspaceRepo.findByUser(user);
        
        return workspaces.stream()
                .map(ws -> modelMapper.map(ws, UserProblemWorkspaceDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteWorkspace(Long workspaceId) {
        UserProblemWorkspace existing = workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + workspaceId));
        workspaceRepo.delete(existing);
    }

    public List<UserProblemWorkspaceDTO> getBookmarkedWorkspaces(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<UserProblemWorkspace> workspaces = workspaceRepo.findByUser(user);

        return workspaces.stream()
                .filter(UserProblemWorkspace::getIsBookmark)
                .map(ws -> modelMapper.map(ws, UserProblemWorkspaceDTO.class))
                .collect(Collectors.toList());
    }
}
