package com.devverse.community.doubt.repo;

import com.devverse.authentication.model.User;
import com.devverse.community.doubt.model.CommentVote;
import com.devverse.community.doubt.model.DoubtComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentVoteRepo extends JpaRepository<CommentVote, Long> {
    Optional<CommentVote> findByUserAndComment(User user, DoubtComment comment);
}
