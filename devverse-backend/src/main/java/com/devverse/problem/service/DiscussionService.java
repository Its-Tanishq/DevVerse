package com.devverse.problem.service;

import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.exception.ResourceNotFoundException;
import com.devverse.problem.dto.DiscussionDTO;
import com.devverse.problem.model.Discussion;
import com.devverse.problem.model.Problem;
import com.devverse.problem.repo.DiscussionRepo;
import com.devverse.problem.repo.ProblemRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscussionService {

    private final DiscussionRepo discussionsRepo;
    private final ProblemRepo problemsRepo;
    private final UserRepo userRepo;
    private final ModelMapper modelMapper;

    public DiscussionDTO createDiscussion(DiscussionDTO discussionsDTO) {
        User user = userRepo.findById(discussionsDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + discussionsDTO.getUserId()));

        Problem problem = problemsRepo.findById(discussionsDTO.getProblemsId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + discussionsDTO.getProblemsId()));

        Discussion discussion = modelMapper.map(discussionsDTO, Discussion.class);
        discussion.setUser(user);
        discussion.setProblems(problem);

        if (discussionsDTO.getParentId() != null) {
            Discussion parentDiscussion = discussionsRepo.findById(discussionsDTO.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent discussion not found with id: " + discussionsDTO.getParentId()));
            discussion.setParentDiscussion(parentDiscussion);
        }

        Discussion savedDiscussion = discussionsRepo.save(discussion);
        return mapToDTO(savedDiscussion);
    }

    public List<DiscussionDTO> getAllDiscussions() {
        return discussionsRepo.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DiscussionDTO getDiscussionById(Long id) {
        Discussion discussion = discussionsRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + id));
        return mapToDTO(discussion);
    }

    public List<DiscussionDTO> getDiscussionsByProblemId(Long problemId) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));
        return discussionsRepo.findByProblems(problem).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DiscussionDTO> getRootDiscussionsByProblemId(Long problemId) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));
        return discussionsRepo.findByProblemsAndParentDiscussionIsNull(problem).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DiscussionDTO> getRepliesByDiscussionId(Long discussionId) {
        Discussion parentDiscussion = discussionsRepo.findById(discussionId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent discussion not found with id: " + discussionId));
        return discussionsRepo.findByParentDiscussion(parentDiscussion).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void deleteDiscussion(Long id) {
        Discussion discussion = discussionsRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + id));
        discussionsRepo.delete(discussion);
    }

    private DiscussionDTO mapToDTO(Discussion discussion) {
        DiscussionDTO dto = modelMapper.map(discussion, DiscussionDTO.class);
        if (discussion.getParentDiscussion() != null) {
            dto.setParentId(discussion.getParentDiscussion().getID());
        }
        return dto;
    }
}
