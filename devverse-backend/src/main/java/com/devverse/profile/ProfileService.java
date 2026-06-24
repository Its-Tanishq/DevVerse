package com.devverse.profile;

import com.devverse.authentication.dto.UserDTO;
import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.exception.DuplicateResourceException;
import com.devverse.exception.ResourceNotFoundException;
import com.devverse.profile.dto.ProfilePhotoUpdateRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepo userRepo;
    private final ModelMapper modelMapper;

    @Transactional
    public UserDTO updateUserProfile(String email, ProfilePhotoUpdateRequest profilePhotoUpdateRequest) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setProfilePic(profilePhotoUpdateRequest.profilePic());

        User updatedUser = userRepo.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }
}
