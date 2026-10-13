package com.devverse.community.doubt.repo;

import com.devverse.community.doubt.model.Doubt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoubtRepo extends JpaRepository<Doubt, Long> {
    Page<Doubt> findByIsSolved(boolean isSolved, Pageable pageable);
}
