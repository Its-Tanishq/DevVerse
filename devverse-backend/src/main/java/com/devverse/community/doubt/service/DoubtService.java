package com.devverse.community.doubt.service;

import com.devverse.authentication.dto.UserDTO;
import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.community.doubt.dto.DoubtCommentRequestDTO;
import com.devverse.community.doubt.dto.DoubtCommentResponseDTO;
import com.devverse.community.doubt.dto.DoubtRequestDTO;
import com.devverse.community.doubt.dto.DoubtResponseDTO;
import com.devverse.community.doubt.model.CommentVote;
import com.devverse.community.doubt.model.Doubt;
import com.devverse.community.doubt.model.DoubtComment;
import com.devverse.community.doubt.model.VoteType;
import com.devverse.community.doubt.repo.CommentVoteRepo;
import com.devverse.community.doubt.repo.DoubtCommentRepo;
import com.devverse.community.doubt.repo.DoubtRepo;
import com.devverse.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoubtService {

    private final DoubtRepo doubtRepository;
    private final DoubtCommentRepo doubtCommentRepository;
    private final CommentVoteRepo commentVoteRepo;
    private final UserRepo userRepo;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public DoubtResponseDTO createDoubt(DoubtRequestDTO request) {
        User user = getCurrentUser();
        Doubt doubt = Doubt.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .tags(request.getTags())
                .author(user)
                .build();
        
        return mapToDoubtResponse(doubtRepository.save(doubt));
    }

    @Transactional(readOnly = true)
    public Page<DoubtResponseDTO> getDoubts(Boolean isSolved, Pageable pageable) {
        Page<Doubt> doubts;
        if (isSolved != null) {
            doubts = doubtRepository.findByIsSolved(isSolved, pageable);
        } else {
            doubts = doubtRepository.findAll(pageable);
        }
        return doubts.map(this::mapToDoubtResponse);
    }

    @Transactional(readOnly = true)
    public DoubtResponseDTO getDoubtById(Long id) {
        Doubt doubt = doubtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doubt not found"));
        return mapToDoubtResponse(doubt);
    }

    @Transactional
    public DoubtResponseDTO markDoubtAsSolved(Long id) {
        Doubt doubt = doubtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doubt not found"));
        
        User currentUser = getCurrentUser();
        if (!doubt.getAuthor().getID().equals(currentUser.getID())) {
            throw new RuntimeException("Only the author can mark the doubt as solved");
        }

        doubt.setSolved(true);
        return mapToDoubtResponse(doubtRepository.save(doubt));
    }

    @Transactional
    public DoubtCommentResponseDTO addComment(Long doubtId, DoubtCommentRequestDTO request) {
        User user = getCurrentUser();
        Doubt doubt = doubtRepository.findById(doubtId)
                .orElseThrow(() -> new ResourceNotFoundException("Doubt not found"));

        DoubtComment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = doubtCommentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            // Optional: verify parentComment belongs to same doubt
            if (!parentComment.getDoubt().getId().equals(doubtId)) {
                throw new RuntimeException("Parent comment does not belong to this doubt");
            }
        }

        DoubtComment comment = DoubtComment.builder()
                .content(request.getContent())
                .author(user)
                .doubt(doubt)
                .parentComment(parentComment)
                .build();

        return mapToCommentResponse(doubtCommentRepository.save(comment));
    }

    @Transactional(readOnly = true)
    public List<DoubtCommentResponseDTO> getCommentsForDoubt(Long doubtId) {
        List<DoubtComment> topLevelComments = doubtCommentRepository
                .findByDoubtIdAndParentCommentIsNullOrderByCreatedAtDesc(doubtId);
        
        return topLevelComments.stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void voteComment(Long commentId, VoteType type) {
        User user = getCurrentUser();
        DoubtComment comment = doubtCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        Optional<CommentVote> existingVote = commentVoteRepo.findByUserAndComment(user, comment);

        if (existingVote.isPresent()) {
            CommentVote vote = existingVote.get();
            if (vote.getType() == type) {
                // Toggle off vote if clicked again
                commentVoteRepo.delete(vote);
            } else {
                // Change vote type
                vote.setType(type);
                commentVoteRepo.save(vote);
            }
        } else {
            // New vote
            CommentVote vote = CommentVote.builder()
                    .user(user)
                    .comment(comment)
                    .type(type)
                    .build();
            commentVoteRepo.save(vote);
        }
    }

    // Mappers
    private DoubtResponseDTO mapToDoubtResponse(Doubt doubt) {
        return DoubtResponseDTO.builder()
                .id(doubt.getId())
                .title(doubt.getTitle())
                .description(doubt.getDescription())
                .author(mapToUserDTO(doubt.getAuthor()))
                .tags(doubt.getTags())
                .isSolved(doubt.isSolved())
                .createdAt(doubt.getCreatedAt())
                .updatedAt(doubt.getUpdatedAt())
                .build();
    }

    private DoubtCommentResponseDTO mapToCommentResponse(DoubtComment comment) {
        int upvotes = (int) comment.getVotes().stream().filter(v -> v.getType() == VoteType.UPVOTE).count();
        int downvotes = (int) comment.getVotes().stream().filter(v -> v.getType() == VoteType.DOWNVOTE).count();

        List<DoubtCommentResponseDTO> replies = comment.getReplies() != null 
                ? comment.getReplies().stream().map(this::mapToCommentResponse).collect(Collectors.toList())
                : List.of();

        return DoubtCommentResponseDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(mapToUserDTO(comment.getAuthor()))
                .doubtId(comment.getDoubt().getId())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .replies(replies)
                .upvotes(upvotes)
                .downvotes(downvotes)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    private UserDTO mapToUserDTO(User user) {
        if (user == null) {
            return null;
        }
        UserDTO dto = new UserDTO();
        dto.setID(user.getID());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setActualUsername(user.getActualUsername());
        dto.setProfilePic(user.getProfilePic());
        dto.setRole(user.getRole());
        return dto;
    }
}
