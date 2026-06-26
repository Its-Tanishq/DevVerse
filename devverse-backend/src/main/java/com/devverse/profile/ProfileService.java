package com.devverse.profile;

import com.devverse.authentication.dto.UserDTO;
import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.authentication.service.UserService;
import com.devverse.exception.ResourceNotFoundException;
import com.devverse.profile.dto.ProfilePhotoUpdateRequest;
import com.devverse.profile.dto.ProfileUpdateRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepo userRepo;
    private final ModelMapper modelMapper;
    private final UserService userService;

    @Transactional
    public UserDTO updateUserProfilePhoto(String email, ProfilePhotoUpdateRequest profilePhotoUpdateRequest) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setProfilePic(profilePhotoUpdateRequest.profilePic());

        User updatedUser = userRepo.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    @Transactional
    public UserDTO updateUserProfile(String email, ProfileUpdateRequest profileUpdateRequest) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (profileUpdateRequest.username() != null && !profileUpdateRequest.username().equals(user.getActualUsername())) {
            if (userRepo.findByUsername(profileUpdateRequest.username()).isPresent()) {
                throw new IllegalArgumentException("Username " + profileUpdateRequest.username() + " is already taken.");
            }
            user.setUsername(profileUpdateRequest.username());
        }

        if (profileUpdateRequest.bio() != null) {
            user.setBio(profileUpdateRequest.bio());
        }

        if (profileUpdateRequest.connections() != null) {
            if (user.getConnections() == null) {
                user.setConnections(new HashMap<>());
            }
            user.getConnections().clear();
            user.getConnections().putAll(profileUpdateRequest.connections());
        }

        User updatedUser = userRepo.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    public void deleteUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        userRepo.delete(user);
    }

}
