package com.devverse.authentication.service;

import com.devverse.authentication.dto.ChangePasswordRequest;
import com.devverse.authentication.dto.UserDTO;
import com.devverse.exception.DuplicateResourceException;
import com.devverse.exception.ResourceNotFoundException;
import com.devverse.common.PageResponse;
import com.devverse.authentication.model.Provider;
import com.devverse.authentication.model.Role;
import com.devverse.authentication.model.User;
import com.devverse.authentication.repo.UserRepo;
import com.devverse.authentication.repo.RefreshTokenRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devverse.admin.service.ActivityLogService;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ActivityLogService activityLogService;
    private final RefreshTokenRepo refreshTokenRepo;

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

        Map<String, Object> variables = new HashMap<>();
        variables.put("username", savedUser.getActualUsername());
        emailService.sendMail(savedUser.getEmail(), "Welcome to DevVerse", "welcome-email", variables);

        activityLogService.logActivity(
                "New user registered: " + savedUser.getActualUsername(),
                "USER",
                savedUser.getID(),
                "INFO",
                "#10b981"
        );

        return modelMapper.map(savedUser, UserDTO.class);
    }

    public UserDTO getUserByEmail(String email)  {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return modelMapper.map(user, UserDTO.class);
    }

    public UserDTO getUserByUsername(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
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

    public void resetPassword(String email, String newPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }

    @Transactional
    public void deleteUser(Long id, String reason) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Delete related refresh tokens before deleting the user to avoid foreign key constraint violations
        refreshTokenRepo.deleteByUser(user);
        
        activityLogService.logActivity(
                "User deleted: " + user.getActualUsername() + " - Reason: " + reason,
                "USER",
                user.getID(),
                "CRITICAL",
                "#ef4444"
        );
        
        userRepo.delete(user);
    }

    @Transactional
    public void toggleBan(Long id, String reason) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setIsEnabled(!user.getIsEnabled());
        userRepo.save(user);
        
        activityLogService.logActivity(
                "User " + (user.getIsEnabled() ? "unbanned" : "banned") + ": " + user.getActualUsername() + " - Reason: " + reason,
                "USER",
                user.getID(),
                "WARNING",
                user.getIsEnabled() ? "#10b981" : "#ef4444"
        );
    }

    @Transactional
    public void togglePremium(Long id, String reason) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setIsPremium(!user.getIsPremium());
        userRepo.save(user);
        
        activityLogService.logActivity(
                "User premium status changed to " + user.getIsPremium() + ": " + user.getActualUsername() + " - Reason: " + reason,
                "USER",
                user.getID(),
                "INFO",
                "#f59e0b"
        );
    }

    public PageResponse<UserDTO> getAllUsers(int page, int size) {
        Page<UserDTO> userPage = userRepo.findAll(PageRequest.of(page, size))
                .map(u -> modelMapper.map(u, UserDTO.class));
        
        return new PageResponse<>(
                userPage.getContent(),
                userPage.getNumber(),
                userPage.getTotalPages(),
                userPage.getTotalElements(),
                userPage.isLast()
        );
    }

    public UserDTO registerUser(UserDTO userDTO) {
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        return createUser(userDTO);
    }
}