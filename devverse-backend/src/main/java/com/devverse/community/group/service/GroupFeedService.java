package com.devverse.community.group.service;

import com.devverse.authentication.model.User;
import com.devverse.community.group.dto.*;
import com.devverse.community.group.model.*;
import com.devverse.community.group.repo.*;
import com.devverse.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupFeedService {

    private final GroupPostRepo groupPostRepo;
    private final GroupPostLikeRepo groupPostLikeRepo;
    private final GroupPostCommentRepo groupPostCommentRepo;
    private final GroupMemberRepo groupMemberRepo;
    private final StudyGroupService studyGroupService;

    @Transactional
    public GroupPostResponseDTO createPost(Long groupId, CreatePostRequest request) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        studyGroupService.verifyGroupMember(group, currentUser);

        GroupPost post = GroupPost.builder()
                .group(group)
                .author(currentUser)
                .content(request.getContent().trim())
                .mediaUrl(request.getMediaUrl())
                .build();

        GroupPost savedPost = groupPostRepo.save(post);
        return mapToPostResponse(savedPost, currentUser);
    }

    @Transactional(readOnly = true)
    public Page<GroupPostResponseDTO> getGroupFeed(Long groupId, Pageable pageable) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        // Group feed is strictly visible to members only
        studyGroupService.verifyGroupMember(group, currentUser);

        Page<GroupPost> posts = groupPostRepo.findByGroupOrderByCreatedAtDesc(group, pageable);
        return posts.map(post -> mapToPostResponse(post, currentUser));
    }

    @Transactional
    public void deletePost(Long groupId, Long postId) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        GroupPost post = groupPostRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Post does not belong to this group");
        }

        boolean isAuthor = post.getAuthor().getID().equals(currentUser.getID());
        boolean isAdmin = groupMemberRepo.findByGroupAndUser(group, currentUser)
                .map(m -> m.getRole() == GroupRole.ADMIN)
                .orElse(false);

        if (!isAuthor && !isAdmin) {
            throw new AccessDeniedException("Only the post author or a group admin can delete this post");
        }

        groupPostRepo.delete(post);
    }

    @Transactional
    public boolean toggleLike(Long groupId, Long postId) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        studyGroupService.verifyGroupMember(group, currentUser);

        GroupPost post = groupPostRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Post does not belong to this group");
        }

        Optional<GroupPostLike> existingLike = groupPostLikeRepo.findByPostAndUser(post, currentUser);
        if (existingLike.isPresent()) {
            groupPostLikeRepo.delete(existingLike.get());
            return false; // unliked
        } else {
            GroupPostLike like = GroupPostLike.builder()
                    .post(post)
                    .user(currentUser)
                    .build();
            groupPostLikeRepo.save(like);
            return true; // liked
        }
    }

    @Transactional
    public GroupCommentResponseDTO addComment(Long groupId, Long postId, PostCommentRequest request) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        studyGroupService.verifyGroupMember(group, currentUser);

        GroupPost post = groupPostRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Post does not belong to this group");
        }

        GroupPostComment comment = GroupPostComment.builder()
                .post(post)
                .author(currentUser)
                .content(request.getContent().trim())
                .build();

        GroupPostComment savedComment = groupPostCommentRepo.save(comment);
        return mapToCommentResponse(savedComment, currentUser);
    }

    @Transactional(readOnly = true)
    public List<GroupCommentResponseDTO> getComments(Long groupId, Long postId) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        studyGroupService.verifyGroupMember(group, currentUser);

        GroupPost post = groupPostRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Post does not belong to this group");
        }

        return groupPostCommentRepo.findByPostOrderByCreatedAtAsc(post).stream()
                .map(comment -> mapToCommentResponse(comment, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long groupId, Long postId, Long commentId) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        GroupPostComment comment = groupPostCommentRepo.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getPost().getId().equals(postId) || !comment.getPost().getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Comment does not belong to this post/group");
        }

        boolean isAuthor = comment.getAuthor().getID().equals(currentUser.getID());
        boolean isAdmin = groupMemberRepo.findByGroupAndUser(group, currentUser)
                .map(m -> m.getRole() == GroupRole.ADMIN)
                .orElse(false);

        if (!isAuthor && !isAdmin) {
            throw new AccessDeniedException("Only the comment author or a group admin can delete this comment");
        }

        groupPostCommentRepo.delete(comment);
    }

    private GroupPostResponseDTO mapToPostResponse(GroupPost post, User currentUser) {
        long likeCount = groupPostLikeRepo.countByPost(post);
        long commentCount = groupPostCommentRepo.countByPost(post);
        boolean hasLiked = currentUser != null && groupPostLikeRepo.existsByPostAndUser(post, currentUser);
        boolean isAuthor = currentUser != null && post.getAuthor().getID().equals(currentUser.getID());

        return GroupPostResponseDTO.builder()
                .id(post.getId())
                .groupId(post.getGroup().getId())
                .content(post.getContent())
                .mediaUrl(post.getMediaUrl())
                .authorId(post.getAuthor().getID())
                .authorUsername(post.getAuthor().getActualUsername())
                .authorProfilePic(post.getAuthor().getProfilePic())
                .likeCount(likeCount)
                .commentCount(commentCount)
                .hasLiked(hasLiked)
                .isAuthor(isAuthor)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private GroupCommentResponseDTO mapToCommentResponse(GroupPostComment comment, User currentUser) {
        boolean isAuthor = currentUser != null && comment.getAuthor().getID().equals(currentUser.getID());

        return GroupCommentResponseDTO.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .content(comment.getContent())
                .authorId(comment.getAuthor().getID())
                .authorUsername(comment.getAuthor().getActualUsername())
                .authorProfilePic(comment.getAuthor().getProfilePic())
                .isAuthor(isAuthor)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
