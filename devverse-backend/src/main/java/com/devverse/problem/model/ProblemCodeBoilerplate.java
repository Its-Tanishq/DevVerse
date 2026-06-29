package com.devverse.problem.model;

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
@Table(name = "problemcodeboilerplate")
public class ProblemCodeBoilerplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problems_id", nullable = false)
    private Problems problems;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String boilerplate;
}
