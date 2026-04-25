package com.smartcampus.ticket.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartcampus.notification.model.NotificationType;
import com.smartcampus.notification.service.NotificationService;
import com.smartcampus.ticket.dto.CommentCreateDTO;
import com.smartcampus.ticket.dto.CommentUpdateDTO;
import com.smartcampus.ticket.model.Comment;
import com.smartcampus.ticket.model.Ticket;
import com.smartcampus.ticket.repository.CommentRepository;
import com.smartcampus.ticket.repository.TicketRepository;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    public CommentServiceImpl(CommentRepository commentRepository, 
                            TicketRepository ticketRepository,
                            NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.notificationService = notificationService;
    }

    @Override
    public Comment addComment(String ticketId, CommentCreateDTO dto, String currentUserId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Comment comment = new Comment();
        comment.setTicketId(ticketId);
        comment.setUserId(currentUserId);
        comment.setMessage(dto.getMessage());

        Comment savedComment = commentRepository.save(comment);

        // Notify relevant users
        try {
            // If the commenter is NOT the ticket owner, notify the owner
            if (!ticket.getCreatedBy().equals(currentUserId)) {
                notificationService.createNotification(
                    ticket.getCreatedBy(),
                    NotificationType.NEW_COMMENT,
                    "New comment on your ticket: " + ticket.getTitle(),
                    ticketId
                );
            }
            
            // If the commenter is the ticket owner, notify the assigned technician (if any)
            if (ticket.getCreatedBy().equals(currentUserId) && ticket.getAssignedTo() != null) {
                notificationService.createNotification(
                    ticket.getAssignedTo(),
                    NotificationType.NEW_COMMENT,
                    "The user commented on ticket #" + ticketId,
                    ticketId
                );
            }
        } catch (Exception e) {
            System.err.println("Failed to send comment notification: " + e.getMessage());
        }

        return savedComment;
    }

    @Override
    public List<Comment> getCommentsByTicketId(String ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    @Override
    public Comment updateComment(String commentId, CommentUpdateDTO dto, String currentUserId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(currentUserId)) {
            throw new RuntimeException("You can only edit your own comment");
        }

        comment.setMessage(dto.getMessage());
        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(String commentId, String currentUserId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(currentUserId)) {
            throw new RuntimeException("You can only delete your own comment");
        }

        commentRepository.delete(comment);
    }
}

