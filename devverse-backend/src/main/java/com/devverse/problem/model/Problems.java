 package com.devverse.problem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

 @Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "problems")
public class Problems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String hints;

    @Builder.Default
    private boolean isPremium = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "problem_companies",
            joinColumns = @JoinColumn(name = "problems_id"),
            inverseJoinColumns = @JoinColumn(name = "companies_id")
    )
    private List<Company> companies;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "problem_tags",
            joinColumns = @JoinColumn(name = "problems_id"),
            inverseJoinColumns = @JoinColumn(name = "tags_id")
    )
    private List<Tags> tags;
}
