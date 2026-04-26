package com.smartcampus.ticket.service;

import java.util.List;

import com.smartcampus.ticket.dto.CommentCreateDTO;
import com.smartcampus.ticket.dto.CommentResponseDTO;
import com.smartcampus.ticket.dto.CommentUpdateDTO;
import com.smartcampus.ticket.model.Comment;

public interface CommentService {

    CommentResponseDTO addComment(String ticketId, CommentCreateDTO dto, String currentUserId);

    List<CommentResponseDTO> getCommentsByTicketId(String ticketId);

    Comment updateComment(String commentId, CommentUpdateDTO dto, String currentUserId);

    void deleteComment(String commentId, String currentUserId);
}
