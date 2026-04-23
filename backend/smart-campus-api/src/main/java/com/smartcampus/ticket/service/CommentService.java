package com.smartcampus.ticket.service;

import java.util.List;

import com.smartcampus.ticket.dto.CommentCreateDTO;
import com.smartcampus.ticket.dto.CommentUpdateDTO;
import com.smartcampus.ticket.model.Comment;

public interface CommentService {

    Comment addComment(Long ticketId, CommentCreateDTO dto, Long currentUserId);

    List<Comment> getCommentsByTicketId(Long ticketId);

    Comment updateComment(Long commentId, CommentUpdateDTO dto, Long currentUserId);

    void deleteComment(Long commentId, Long currentUserId);
}