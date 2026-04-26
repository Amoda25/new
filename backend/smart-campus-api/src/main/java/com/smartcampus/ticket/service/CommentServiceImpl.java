package com.smartcampus.ticket.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartcampus.notification.model.NotificationType;
import com.smartcampus.notification.service.NotificationService;
import com.smartcampus.ticket.dto.CommentCreateDTO;
import com.smartcampus.ticket.dto.CommentResponseDTO;
import com.smartcampus.ticket.dto.CommentUpdateDTO;
import com.smartcampus.ticket.model.Comment;
import com.smartcampus.ticket.model.Ticket;
import com.smartcampus.ticket.repository.CommentRepository;
import com.smartcampus.ticket.repository.TicketRepository;
import com.smartcampus.user.model.User;
import com.smartcampus.user.repository.UserRepository;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public CommentServiceImpl(CommentRepository commentRepository, 
                            TicketRepository ticketRepository,
                            NotificationService notificationService,
                            UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @Override
    public CommentResponseDTO addComment(String ticketId, CommentCreateDTO dto, String currentUserId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Comment comment = new Comment();
        comment.setTicketId(ticketId);
        comment.setUserId(currentUserId);
        comment.setMessage(dto.getMessage());
        comment.onCreate();

        Comment savedComment = commentRepository.save(comment);

        // ... notification logic ...
        try {
            // (keeping existing notification logic)
            if (!ticket.getCreatedBy().equals(currentUserId)) {
                notificationService.createNotification(
                    ticket.getCreatedBy(),
                    NotificationType.NEW_COMMENT,
                    "New comment on your ticket: " + ticket.getTitle(),
                    ticketId
                );
            }
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

        return mapToResponseDTO(savedComment);
    }

    @Override
    public List<CommentResponseDTO> getCommentsByTicketId(String ticketId) {
        List<Comment> comments = commentRepository.findByTicketId(ticketId);
        return comments.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private CommentResponseDTO mapToResponseDTO(Comment comment) {
        CommentResponseDTO responseDTO = new CommentResponseDTO();
        responseDTO.setId(comment.getId());
        responseDTO.setTicketId(comment.getTicketId());
        responseDTO.setUserId(comment.getUserId());
        responseDTO.setMessage(comment.getMessage());
        responseDTO.setCreatedAt(comment.getCreatedAt());

        userRepository.findById(comment.getUserId()).ifPresent(user -> {
            responseDTO.setUserName(user.getName());
            responseDTO.setUserRole(user.getRole().name());
        });

        return responseDTO;
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

