package com.smartcampus.ticket.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartcampus.ticket.dto.CommentCreateDTO;
import com.smartcampus.ticket.dto.CommentUpdateDTO;
import com.smartcampus.ticket.model.Comment;
import com.smartcampus.ticket.repository.CommentRepository;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    // constructor injection
    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public Comment addComment(Long ticketId, CommentCreateDTO dto, Long currentUserId) {

        Comment comment = new Comment();
        comment.setTicketId(ticketId);
        comment.setUserId(currentUserId);
        comment.setMessage(dto.getMessage());

        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByTicketId(Long ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    @Override
    public Comment updateComment(Long commentId, CommentUpdateDTO dto, Long currentUserId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(currentUserId)) {
            throw new RuntimeException("You can only edit your own comment");
        }

        comment.setMessage(dto.getMessage());
        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long commentId, Long currentUserId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(currentUserId)) {
            throw new RuntimeException("You can only delete your own comment");
        }

        commentRepository.delete(comment);
    }
}