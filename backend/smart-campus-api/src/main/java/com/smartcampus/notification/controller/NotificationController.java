package com.smartcampus.notification.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.lang.NonNull;

import com.smartcampus.notification.dto.NotificationDTO;

import com.smartcampus.notification.service.NotificationService;

@RestController 
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getAllNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = userDetails.getUsername();  // ← Get user ID from JWT
        System.out.println("User ID: " + userId + " is viewing all notifications");
        
        return ResponseEntity.ok(notificationService.getAllNotificationsByUserId(userId));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = userDetails.getUsername();  // ← Get user ID from JWT
        System.out.println("User ID: " + userId + " is viewing unread notifications");
        
        return ResponseEntity.ok(notificationService.getUnreadNotificationsByUserId(userId));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String> markNotificationAsRead(
            @PathVariable @NonNull String notificationId,
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER
        
        String userId = userDetails.getUsername();  // ← Get user ID from JWT
        System.out.println("User ID: " + userId + " is marking notification " + notificationId + " as read");
        
        notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok("Notification marked as read");
    }

    @PutMapping("/read-all")
    public ResponseEntity<String> markAllNotificationsAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {  // ← CHANGED: No userId in URL, get from JWT
        
        String userId = userDetails.getUsername();  // ← Get user ID from JWT
        System.out.println("User ID: " + userId + " is marking all notifications as read");
        
        notificationService.markAllNotificationsAsRead(userId);
        return ResponseEntity.ok("All notifications marked as read");
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Integer> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {  // ← CHANGED: No userId in URL, get from JWT
        
        String userId = userDetails.getUsername();  // ← Get user ID from JWT
        System.out.println("User ID: " + userId + " is checking unread count");
        
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable @NonNull String notificationId,
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER
        
        String userId = userDetails.getUsername();  // ← Get user ID from JWT
        System.out.println("User ID: " + userId + " is deleting notification " + notificationId);
        
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok("Notification deleted");
    }
}
