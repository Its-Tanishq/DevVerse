package com.devverse.service;

import com.devverse.dto.ChangePasswordRequest;
import com.devverse.dto.UserDTO;
import com.devverse.exception.DuplicateResourceException;
import com.devverse.exception.ResourceNotFoundException;
import com.devverse.model.Provider;
import com.devverse.model.Role;
import com.devverse.model.User;
import com.devverse.repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDTO createUser(UserDTO userDTO) {


        if (userRepo.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email is already registered");
        }

        if (userRepo.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username is already registered");
        }

        User user = modelMapper.map(userDTO, User.class);
        user.setProvider(userDTO.getProvider() != null ? userDTO.getProvider() : Provider.LOCAL);
        user.setRole(Role.USER.name());

        User savedUser = userRepo.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return modelMapper.map(user, UserDTO.class);
    }

    public UserDTO getUserById(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return modelMapper.map(user, UserDTO.class);
    }

    @Transactional
    public UserDTO updateUser(String email, UserDTO userDTO) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Email, Provider Changing is not allowed
        if (userDTO.getUsername() != null) {
            if (!userDTO.getUsername().equals(user.getUsername())) {
                if (userRepo.findByUsername(userDTO.getUsername()).isPresent()) {
                    throw new DuplicateResourceException("Username is already taken");
                }
                user.setUsername(userDTO.getUsername());
            }
        }

        if (userDTO.getProfilePic() != null) user.setProfilePic(userDTO.getProfilePic());
        if (userDTO.getBio() != null) user.setBio(userDTO.getBio());

        User updatedUser = userRepo.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid old password");
        }
        
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepo.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepo.delete(user);
    }

    public Page<UserDTO> getAllUsers(int page, int size) {
        return userRepo.findAll(PageRequest.of(page, size))
                .map(u -> modelMapper.map(u, UserDTO.class));
    }

    public UserDTO registerUser(UserDTO userDTO) {
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        return createUser(userDTO);
    }
}