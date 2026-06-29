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
@Table(name = "problemtags")
public class ProblemTags {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problems_id", nullable = false)
    private Problems problems;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tags_id", nullable = false)
    private Tags tags;
}
