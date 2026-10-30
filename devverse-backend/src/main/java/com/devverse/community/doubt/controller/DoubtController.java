package com.devverse.community.doubt.controller;

import com.devverse.community.doubt.dto.DoubtCommentRequestDTO;
import com.devverse.community.doubt.dto.DoubtCommentResponseDTO;
import com.devverse.community.doubt.dto.DoubtRequestDTO;
import com.devverse.community.doubt.dto.DoubtResponseDTO;
import com.devverse.community.doubt.model.VoteType;
import com.devverse.community.doubt.service.DoubtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doubts")
@RequiredArgsConstructor
public class DoubtController {

    private final DoubtService doubtService;

    @PostMapping
    public ResponseEntity<DoubtResponseDTO> createDoubt(@Valid @RequestBody DoubtRequestDTO request) {
        return new ResponseEntity<>(doubtService.createDoubt(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<DoubtResponseDTO>> getDoubts(
            @RequestParam(required = false) Boolean isSolved,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(doubtService.getDoubts(isSolved, pageRequest));
    }

    @GetMapping("/{doubtId}")
    public ResponseEntity<DoubtResponseDTO> getDoubtById(@PathVariable Long doubtId) {
        return ResponseEntity.ok(doubtService.getDoubtById(doubtId));
    }

    @PatchMapping("/{doubtId}/solve")
    public ResponseEntity<DoubtResponseDTO> markDoubtAsSolved(
            @PathVariable Long doubtId,
            @RequestParam(required = false) Long commentId) {
        return ResponseEntity.ok(doubtService.markDoubtAsSolved(doubtId, commentId));
    }

    // Comments
    @PostMapping("/{doubtId}/comments")
    public ResponseEntity<DoubtCommentResponseDTO> addComment(
            @PathVariable Long doubtId,
            @Valid @RequestBody DoubtCommentRequestDTO request) {
        return new ResponseEntity<>(doubtService.addComment(doubtId, request), HttpStatus.CREATED);
    }

    @GetMapping("/{doubtId}/comments")
    public ResponseEntity<List<DoubtCommentResponseDTO>> getCommentsForDoubt(@PathVariable Long doubtId) {
        return ResponseEntity.ok(doubtService.getCommentsForDoubt(doubtId));
    }

    // Voting
    @PostMapping("/comments/{commentId}/vote")
    public ResponseEntity<Void> voteComment(
            @PathVariable Long commentId,
            @RequestParam VoteType type) {
        doubtService.voteComment(commentId, type);
        return ResponseEntity.ok().build();
    }
}
