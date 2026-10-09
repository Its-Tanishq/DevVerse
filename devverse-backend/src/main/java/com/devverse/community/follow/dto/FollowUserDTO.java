package com.devverse.community.follow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowUserDTO {
    private String username;
    private String profilePic;
    private String bio;
}
