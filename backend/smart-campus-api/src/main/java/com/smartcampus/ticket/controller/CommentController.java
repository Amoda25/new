package com.smartcampus.ticket.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.ticket.dto.CommentCreateDTO;
import com.smartcampus.ticket.dto.CommentResponseDTO;
import com.smartcampus.ticket.dto.CommentUpdateDTO;
import com.smartcampus.ticket.model.Comment;
import com.smartcampus.ticket.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * Add a comment to a ticket.
     * Only authenticated USERs are allowed to post comments.
     */
    @PostMapping("/ticket/{ticketId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<CommentResponseDTO> addComment(
            @PathVariable @NonNull String ticketId,
            @RequestBody CommentCreateDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String currentUserId = extractUserId(userDetails);
        CommentResponseDTO comment = commentService.addComment(ticketId, dto, currentUserId);
        return ResponseEntity.ok(comment);
    }

    /**
     * Get all comments for a ticket.
     * Both USERs and TECHNICIANs can view comments.
     */
    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasAnyRole('USER', 'TECHNICIAN', 'ADMIN')")
    public ResponseEntity<List<CommentResponseDTO>> getComments(
            @PathVariable @NonNull String ticketId
    ) {
        return ResponseEntity.ok(commentService.getCommentsByTicketId(ticketId));
    }

    /**
     * Update an existing comment.
     * Only the USER who wrote the comment can update it (enforced in service layer).
     */
    @PutMapping("/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Comment> updateComment(
            @PathVariable @NonNull String commentId,
            @RequestBody CommentUpdateDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String currentUserId = extractUserId(userDetails);
        Comment updated = commentService.updateComment(commentId, dto, currentUserId);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a comment.
     * Only the USER who wrote the comment can delete it (enforced in service layer).
     */
    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteComment(
            @PathVariable @NonNull String commentId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String currentUserId = extractUserId(userDetails);
        commentService.deleteComment(commentId, currentUserId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Extracts the numeric userId stored as the username in the JWT-backed UserDetails.
     */
    private String extractUserId(UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userDetails.getUsername();
    }
}
