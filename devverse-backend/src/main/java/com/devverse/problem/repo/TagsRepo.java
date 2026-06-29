package com.devverse.problem.repo;

import com.devverse.problem.model.Tags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagsRepo extends JpaRepository<Tags, Long> {
    Optional<Tags> findByName(String name);
}
