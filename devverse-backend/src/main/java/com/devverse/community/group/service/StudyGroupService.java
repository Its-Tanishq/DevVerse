package com.devverse.community.group.service;

import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.community.group.dto.*;
import com.devverse.community.group.model.*;
import com.devverse.community.group.repo.*;
import com.devverse.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyGroupService {

    private final StudyGroupRepo studyGroupRepo;
    private final GroupMemberRepo groupMemberRepo;
    private final GroupJoinRequestRepo joinRequestRepo;
    private final UserRepo userRepo;

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equalsIgnoreCase(auth.getName())) {
            throw new AccessDeniedException("User is not authenticated");
        }
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + auth.getName()));
    }

    public User getCurrentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equalsIgnoreCase(auth.getName())) {
            return null;
        }
        return userRepo.findByEmail(auth.getName()).orElse(null);
    }

    @Transactional
    public GroupResponseDTO createGroup(CreateGroupRequest request) {
        User currentUser = getCurrentUser();

        StudyGroup group = StudyGroup.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .privacy(request.getPrivacy() != null ? request.getPrivacy() : GroupPrivacy.PUBLIC)
                .createdBy(currentUser)
                .build();

        StudyGroup savedGroup = studyGroupRepo.save(group);

        // Creator is automatic ADMIN
        GroupMember adminMember = GroupMember.builder()
                .group(savedGroup)
                .user(currentUser)
                .role(GroupRole.ADMIN)
                .joinedAt(Instant.now())
                .build();
        groupMemberRepo.save(adminMember);

        return mapToGroupResponse(savedGroup, currentUser);
    }

    @Transactional
    public GroupResponseDTO updateGroup(Long groupId, UpdateGroupRequest request) {
        User currentUser = getCurrentUser();
        StudyGroup group = findGroupById(groupId);

        verifyGroupAdmin(group, currentUser);

        if (request.getName() != null && !request.getName().isBlank()) {
            group.setName(request.getName().trim());
        }
        if (request.getDescription() != null) {
            group.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            group.setImageUrl(request.getImageUrl());
        }
        if (request.getPrivacy() != null) {
            group.setPrivacy(request.getPrivacy());
        }

        StudyGroup updatedGroup = studyGroupRepo.save(group);
        return mapToGroupResponse(updatedGroup, currentUser);
    }

    @Transactional
    public GroupResponseDTO regenerateInviteCode(Long groupId) {
        User currentUser = getCurrentUser();
        StudyGroup group = findGroupById(groupId);

        verifyGroupAdmin(group, currentUser);

        group.regenerateInviteCode();
        StudyGroup savedGroup = studyGroupRepo.save(group);
        return mapToGroupResponse(savedGroup, currentUser);
    }

    @Transactional
    public void deleteGroup(Long groupId) {
        User currentUser = getCurrentUser();
        StudyGroup group = findGroupById(groupId);

        verifyGroupAdmin(group, currentUser);

        studyGroupRepo.delete(group);
    }

    @Transactional(readOnly = true)
    public GroupResponseDTO getGroupById(Long groupId) {
        User currentUser = getCurrentUserOrNull();
        StudyGroup group = findGroupById(groupId);

        boolean isMember = currentUser != null && groupMemberRepo.existsByGroupAndUser(group, currentUser);
        if (group.getPrivacy() == GroupPrivacy.PRIVATE && !isMember) {
            // Non-members can view limited info of private group to request join
            return mapToGroupResponse(group, currentUser);
        }

        return mapToGroupResponse(group, currentUser);
    }

    @Transactional(readOnly = true)
    public Page<GroupResponseDTO> getPublicGroups(String query, Pageable pageable) {
        User currentUser = getCurrentUserOrNull();
        Page<StudyGroup> groups;

        if (query != null && !query.trim().isEmpty()) {
            groups = studyGroupRepo.searchByPrivacyAndKeyword(GroupPrivacy.PUBLIC, query.trim(), pageable);
        } else {
            groups = studyGroupRepo.findByPrivacy(GroupPrivacy.PUBLIC, pageable);
        }

        return groups.map(group -> mapToGroupResponse(group, currentUser));
    }

    @Transactional(readOnly = true)
    public List<GroupResponseDTO> getMyGroups() {
        User currentUser = getCurrentUser();
        List<StudyGroup> groups = studyGroupRepo.findGroupsByUser(currentUser);
        return groups.stream()
                .map(group -> mapToGroupResponse(group, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public GroupResponseDTO joinPublicGroup(Long groupId) {
        User currentUser = getCurrentUser();
        StudyGroup group = findGroupById(groupId);

        if (group.getPrivacy() == GroupPrivacy.PRIVATE) {
            throw new IllegalArgumentException("This is a private group. Please send a join request or use an invite code.");
        }

        if (groupMemberRepo.existsByGroupAndUser(group, currentUser)) {
            throw new IllegalArgumentException("You are already a member of this group");
        }

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(currentUser)
                .role(GroupRole.MEMBER)
                .joinedAt(Instant.now())
                .build();
        groupMemberRepo.save(member);

        return mapToGroupResponse(group, currentUser);
    }

    @Transactional
    public GroupResponseDTO joinByInviteCode(String inviteCode) {
        User currentUser = getCurrentUser();
        StudyGroup group = studyGroupRepo.findByInviteCode(inviteCode.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired invite code"));

        if (groupMemberRepo.existsByGroupAndUser(group, currentUser)) {
            throw new IllegalArgumentException("You are already a member of this group");
        }

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(currentUser)
                .role(GroupRole.MEMBER)
                .joinedAt(Instant.now())
                .build();
        groupMemberRepo.save(member);

        // If there was any pending join request, accept it automatically
        joinRequestRepo.findByGroupAndUserAndStatus(group, currentUser, JoinRequestStatus.PENDING)
                .ifPresent(req -> {
                    req.setStatus(JoinRequestStatus.ACCEPTED);
                    req.setReviewedAt(Instant.now());
                    req.setReviewedBy(currentUser);
                    joinRequestRepo.save(req);
                });

        return mapToGroupResponse(group, currentUser);
    }

    @Transactional
    public JoinRequestDTO requestToJoinGroup(Long groupId, CreateJoinRequestDTO requestDTO) {
        User currentUser = getCurrentUser();
        StudyGroup group = findGroupById(groupId);

        if (group.getPrivacy() != GroupPrivacy.PRIVATE) {
            throw new IllegalArgumentException("This group is public. You can join it directly.");
        }

        if (groupMemberRepo.existsByGroupAndUser(group, currentUser)) {
            throw new IllegalArgumentException("You are already a member of this group");
        }

        if (joinRequestRepo.existsByGroupAndUserAndStatus(group, currentUser, JoinRequestStatus.PENDING)) {
            throw new IllegalArgumentException("You already have a pending join request for this group");
        }

        GroupJoinRequest joinRequest = GroupJoinRequest.builder()
                .group(group)
                .user(currentUser)
                .status(JoinRequestStatus.PENDING)
                .message(requestDTO != null ? requestDTO.getMessage() : null)
                .build();

        GroupJoinRequest savedRequest = joinRequestRepo.save(joinRequest);
        return mapToJoinRequestDTO(savedRequest);
    }

    @Transactional(readOnly = true)
    public List<JoinRequestDTO> getPendingJoinRequests(Long groupId) {
        User currentUser = getCurrentUser();
        StudyGroup group = findGroupById(groupId);

        verifyGroupAdmin(group, currentUser);

        return joinRequestRepo.findByGroupAndStatusOrderByCreatedAtDesc(group, JoinRequestStatus.PENDING).stream()
                .map(this::mapToJoinRequestDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void handleJoinRequest(Long groupId, Long requestId, boolean accept) {
        User currentUser = getCurrentUser();
        StudyGroup group = findGroupById(groupId);

        verifyGroupAdmin(group, currentUser);

        GroupJoinRequest joinRequest = joinRequestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found"));

        if (!joinRequest.getGroup().getId().equals(groupId)) {
            throw new IllegalArgumentException("Join request does not belong to this group");
        }

        if (joinRequest.getStatus() != JoinRequestStatus.PENDING) {
            throw new IllegalArgumentException("Join request has already been reviewed");
        }

        joinRequest.setReviewedAt(Instant.now());
        joinRequest.setReviewedBy(currentUser);

        if (accept) {
            joinRequest.setStatus(JoinRequestStatus.ACCEPTED);
            // Add user as member if not already
            if (!groupMemberRepo.existsByGroupAndUser(group, joinRequest.getUser())) {
                GroupMember member = GroupMember.builder()
                        .group(group)
                        .user(joinRequest.getUser())
                        .role(GroupRole.MEMBER)
                        .joinedAt(Instant.now())
                        .build();
                groupMemberRepo.save(member);
            }
        } else {
            joinRequest.setStatus(JoinRequestStatus.REJECTED);
        }

        joinRequestRepo.save(joinRequest);
    }

    @Transactional
    public void inviteUser(Long groupId, InviteUserRequest request) {
        User currentUser = getCurrentUser();
        StudyGroup group = findGroupById(groupId);

        verifyGroupAdmin(group, currentUser);

        String usernameOrEmail = request.getUsernameOrEmail().trim();
        User targetUser = userRepo.findByUsername(usernameOrEmail)
                .or(() -> userRepo.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username/email: " + usernameOrEmail));

        if (groupMemberRepo.existsByGroupAndUser(group, targetUser)) {
            throw new IllegalArgumentException("User is already a member of this group");
        }

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(targetUser)
                .role(GroupRole.MEMBER)
                .joinedAt(Instant.now())
                .build();
        groupMemberRepo.save(member);
    }

    public StudyGroup findGroupById(Long groupId) {
        return studyGroupRepo.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study group not found with id: " + groupId));
    }

    public void verifyGroupAdmin(StudyGroup group, User user) {
        Optional<GroupMember> memberOpt = groupMemberRepo.findByGroupAndUser(group, user);
        if (memberOpt.isEmpty() || memberOpt.get().getRole() != GroupRole.ADMIN) {
            throw new AccessDeniedException("Only group admins are authorized to perform this action");
        }
    }

    public void verifyGroupMember(StudyGroup group, User user) {
        if (!groupMemberRepo.existsByGroupAndUser(group, user)) {
            throw new AccessDeniedException("Only group members can access this resource");
        }
    }

    public GroupResponseDTO mapToGroupResponse(StudyGroup group, User currentUser) {
        long memberCount = groupMemberRepo.countByGroup(group);

        boolean isMember = false;
        boolean isAdmin = false;
        boolean isCreator = false;
        boolean hasPendingRequest = false;

        if (currentUser != null) {
            isCreator = group.getCreatedBy() != null &&
                    group.getCreatedBy().getID() != null &&
                    group.getCreatedBy().getID().equals(currentUser.getID());

            Optional<GroupMember> memberOpt = groupMemberRepo.findByGroupAndUser(group, currentUser);
            if (memberOpt.isPresent()) {
                isMember = true;
                isAdmin = memberOpt.get().getRole() == GroupRole.ADMIN;
            }

            // Creator is always a member and admin of their own study circle
            if (isCreator) {
                isMember = true;
                isAdmin = true;
            }

            hasPendingRequest = joinRequestRepo.existsByGroupAndUserAndStatus(group, currentUser, JoinRequestStatus.PENDING);
        }

        // Only reveal invite code to members or admins
        String inviteCode = (isMember || isCreator || isAdmin) ? group.getInviteCode() : null;

        Long createdById = group.getCreatedBy() != null ? group.getCreatedBy().getID() : null;
        String createdByUsername = group.getCreatedBy() != null ? group.getCreatedBy().getActualUsername() : null;

        return GroupResponseDTO.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .imageUrl(group.getImageUrl())
                .privacy(group.getPrivacy())
                .inviteCode(inviteCode)
                .memberCount(memberCount)
                .isMember(isMember)
                .isAdmin(isAdmin)
                .isCreator(isCreator)
                .hasPendingRequest(hasPendingRequest)
                .createdById(createdById)
                .createdByUsername(createdByUsername)
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .build();
    }

    public JoinRequestDTO mapToJoinRequestDTO(GroupJoinRequest req) {
        return JoinRequestDTO.builder()
                .id(req.getId())
                .groupId(req.getGroup().getId())
                .groupName(req.getGroup().getName())
                .userId(req.getUser().getID())
                .username(req.getUser().getActualUsername())
                .profilePic(req.getUser().getProfilePic())
                .message(req.getMessage())
                .status(req.getStatus())
                .createdAt(req.getCreatedAt())
                .reviewedAt(req.getReviewedAt())
                .build();
    }
}
