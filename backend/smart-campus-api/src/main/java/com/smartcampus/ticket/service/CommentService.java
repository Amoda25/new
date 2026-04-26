package com.smartcampus.ticket.service;

import java.util.List;
import org.springframework.lang.NonNull;

import com.smartcampus.ticket.dto.CommentCreateDTO;
import com.smartcampus.ticket.dto.CommentResponseDTO;
import com.smartcampus.ticket.dto.CommentUpdateDTO;
import com.smartcampus.ticket.model.Comment;

public interface CommentService {

    CommentResponseDTO addComment(@NonNull String ticketId, CommentCreateDTO dto, String currentUserId);

    List<CommentResponseDTO> getCommentsByTicketId(@NonNull String ticketId);

    Comment updateComment(@NonNull String commentId, CommentUpdateDTO dto, String currentUserId);

    void deleteComment(@NonNull String commentId, String currentUserId);
}
