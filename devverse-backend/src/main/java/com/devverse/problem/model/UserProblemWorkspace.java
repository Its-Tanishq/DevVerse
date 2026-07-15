package com.devverse.problem.model;

import com.devverse.authentication.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "user_problem_workspace", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "problems_id"}))
public class UserProblemWorkspace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problems_id", nullable = false)
    private Problem problems;

    @Builder.Default
    private Boolean isBookmark = false;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
