package com.devverse.community.group.service;

import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.community.group.dto.GroupMemberDTO;
import com.devverse.community.group.model.GroupMember;
import com.devverse.community.group.model.GroupPrivacy;
import com.devverse.community.group.model.GroupRole;
import com.devverse.community.group.model.StudyGroup;
import com.devverse.community.group.repo.GroupMemberRepo;
import com.devverse.community.group.repo.StudyGroupRepo;
import com.devverse.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupMemberService {

    private final GroupMemberRepo groupMemberRepo;
    private final StudyGroupRepo studyGroupRepo;
    private final UserRepo userRepo;
    private final StudyGroupService studyGroupService;

    @Transactional(readOnly = true)
    public List<GroupMemberDTO> getMembers(Long groupId) {
        User currentUser = studyGroupService.getCurrentUserOrNull();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        if (group.getPrivacy() == GroupPrivacy.PRIVATE) {
            if (currentUser == null) {
                throw new AccessDeniedException("You must be logged in to view members of a private group");
            }
            studyGroupService.verifyGroupMember(group, currentUser);
        }

        return groupMemberRepo.findByGroupOrderByJoinedAtAsc(group).stream()
                .map(this::mapToMemberDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeMember(Long groupId, Long targetUserId) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        studyGroupService.verifyGroupAdmin(group, currentUser);

        if (currentUser.getID().equals(targetUserId)) {
            throw new IllegalArgumentException("You cannot remove yourself using this action. Please leave the group instead.");
        }

        User targetUser = userRepo.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        GroupMember targetMember = groupMemberRepo.findByGroupAndUser(group, targetUser)
                .orElseThrow(() -> new ResourceNotFoundException("User is not a member of this group"));

        // Cannot remove the group creator
        if (group.getCreatedBy().getID().equals(targetUserId)) {
            throw new AccessDeniedException("The group creator cannot be removed from the group");
        }

        groupMemberRepo.delete(targetMember);
    }

    @Transactional
    public GroupMemberDTO promoteToAdmin(Long groupId, Long targetUserId) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        studyGroupService.verifyGroupAdmin(group, currentUser);

        User targetUser = userRepo.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        GroupMember targetMember = groupMemberRepo.findByGroupAndUser(group, targetUser)
                .orElseThrow(() -> new ResourceNotFoundException("User is not a member of this group"));

        if (targetMember.getRole() == GroupRole.ADMIN) {
            throw new IllegalArgumentException("User is already an admin of this group");
        }

        targetMember.setRole(GroupRole.ADMIN);
        GroupMember updatedMember = groupMemberRepo.save(targetMember);

        return mapToMemberDTO(updatedMember);
    }

    @Transactional
    public void leaveGroup(Long groupId) {
        User currentUser = studyGroupService.getCurrentUser();
        StudyGroup group = studyGroupService.findGroupById(groupId);

        GroupMember member = groupMemberRepo.findByGroupAndUser(group, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));

        long totalMembers = groupMemberRepo.countByGroup(group);

        // If this is the only member left in the group, delete group
        if (totalMembers <= 1) {
            studyGroupRepo.delete(group);
            return;
        }

        // If the leaving user is an ADMIN, check if any other admins remain
        if (member.getRole() == GroupRole.ADMIN) {
            long adminCount = groupMemberRepo.countByGroupAndRole(group, GroupRole.ADMIN);
            if (adminCount <= 1) {
                // Auto-promote the earliest joined non-admin member
                Optional<GroupMember> nextAdmin = groupMemberRepo.findFirstByGroupAndRoleNotOrderByJoinedAtAsc(group, GroupRole.ADMIN);
                nextAdmin.ifPresent(next -> {
                    next.setRole(GroupRole.ADMIN);
                    groupMemberRepo.save(next);
                });
            }
        }

        groupMemberRepo.delete(member);
    }

    private GroupMemberDTO mapToMemberDTO(GroupMember member) {
        User u = member.getUser();
        return GroupMemberDTO.builder()
                .id(member.getId())
                .userId(u.getID())
                .username(u.getActualUsername())
                .email(u.getEmail())
                .profilePic(u.getProfilePic())
                .bio(u.getBio())
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}
