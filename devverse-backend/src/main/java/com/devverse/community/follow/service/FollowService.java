package com.devverse.community.follow.service;

import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.exception.ResourceNotFoundException;
import com.devverse.community.follow.dto.FollowUserDTO;
import com.devverse.community.follow.model.Follow;
import com.devverse.community.follow.repo.FollowRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepo followRepo;
    private final UserRepo userRepo;

    @Transactional
    public void followUser(String followerEmail, String followingUsername) {
        User follower = userRepo.findByEmail(followerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + followerEmail));
        
        User following = userRepo.findByUsername(followingUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + followingUsername));

        if (follower.getID().equals(following.getID())) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }

        if (followRepo.existsByFollowerAndFollowing(follower, following)) {
            throw new IllegalArgumentException("You are already following this user");
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();
        
        followRepo.save(follow);
    }

    @Transactional
    public void unfollowUser(String followerEmail, String followingUsername) {
        User follower = userRepo.findByEmail(followerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + followerEmail));
        
        User following = userRepo.findByUsername(followingUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + followingUsername));

        Follow follow = followRepo.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new IllegalArgumentException("You are not following this user"));
        
        followRepo.delete(follow);
    }

    @Transactional(readOnly = true)
    public List<FollowUserDTO> getFollowers(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        return followRepo.findByFollowing(user).stream()
                .map(follow -> {
                    User follower = follow.getFollower();
                    return new FollowUserDTO(follower.getActualUsername(), follower.getProfilePic(), follower.getBio());
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FollowUserDTO> getFollowing(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        return followRepo.findByFollower(user).stream()
                .map(follow -> {
                    User following = follow.getFollowing();
                    return new FollowUserDTO(following.getActualUsername(), following.getProfilePic(), following.getBio());
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isFollowing(String followerEmail, String followingUsername) {
        User follower = userRepo.findByEmail(followerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + followerEmail));
        
        User following = userRepo.findByUsername(followingUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + followingUsername));
                
        return followRepo.existsByFollowerAndFollowing(follower, following);
    }
}
