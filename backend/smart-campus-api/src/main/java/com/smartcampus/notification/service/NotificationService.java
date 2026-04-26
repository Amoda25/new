package com.smartcampus.notification.service;

import java.util.List;

import com.smartcampus.notification.dto.NotificationDTO;

import com.smartcampus.notification.model.NotificationType;

public interface NotificationService {

    void createNotification(String userId, NotificationType type, String message, String referenceId);

    List<NotificationDTO> getAllNotificationsByUserId(String userId);

    List<NotificationDTO> getUnreadNotificationsByUserId(String userId);

    void markNotificationAsRead(String notificationId);

    void markAllNotificationsAsRead(String userId);

    int getUnreadCount(String userId);

    void deleteNotification(String notificationId);

    
    
}
