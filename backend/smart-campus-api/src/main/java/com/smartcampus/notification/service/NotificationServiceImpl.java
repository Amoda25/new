package com.smartcampus.notification.service;

import org.springframework.lang.NonNull;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.smartcampus.notification.dto.NotificationDTO;
import com.smartcampus.notification.model.Notification;
import com.smartcampus.notification.model.NotificationType;
import com.smartcampus.notification.repository.NotificationRepository;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void createNotification(String userId, NotificationType type, String message, String referenceId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setMessage(message);
        notification.setReferenceId(referenceId);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    

    @Override
    public List<NotificationDTO> getAllNotificationsByUserId(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream().map(this::mapToDTO).toList();
    }

    @Override
    public List<NotificationDTO> getUnreadNotificationsByUserId(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        return notifications.stream().map(this::mapToDTO).toList();
    }

    private NotificationDTO mapToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUserId());
        dto.setType(notification.getType());
        dto.setMessage(notification.getMessage());
        dto.setReferenceId(notification.getReferenceId());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        String url = "";
        switch (notification.getType()) {
            case TICKET_CREATED:
                url = "/admin/tickets/" + notification.getReferenceId();
                break;
            case TICKET_ASSIGNED:
                url = "/technician/tickets/" + notification.getReferenceId();
                break;
            case TICKET_RESOLVED:
                url = "/user/tickets/" + notification.getReferenceId();
                break;
            case BOOKING_CREATED:
                url = "/admin/bookings";
                break;
            
            case BOOKING_APPROVED:
                url = "/user/bookings";
                break;

            case BOOKING_REJECTED:
                url = "/user/bookings";
                break;               
            
            case NEW_COMMENT:
                url = "/user/tickets/" + notification.getReferenceId();
                break;

            default:
                url = "/";
        }
        dto.setTargetUrl(url);
        return dto;
    }

    @Override
    public void markNotificationAsRead(@NonNull String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @SuppressWarnings("null")
    public void markAllNotificationsAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        for (Notification notification : notifications) {
            notification.setIsRead(true);
        }

        @SuppressWarnings("null")
        List<Notification> toSave = notifications;
        notificationRepository.saveAll(toSave);
    }

    @Override
    public int getUnreadCount(String userId) {
        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .size();
    }


    @Override
    public void deleteNotification(@NonNull String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
