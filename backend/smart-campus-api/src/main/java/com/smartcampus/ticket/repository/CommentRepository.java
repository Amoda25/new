package com.smartcampus.ticket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.smartcampus.ticket.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    //Get all comments for a ticket
    List<Comment> findByTicketId(Long ticketId);


    //To delete the comment along with a ticket delete
    @Transactional
    @Modifying
    void deleteByTicketId(Long ticketId);

}