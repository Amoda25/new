package com.smartcampus.chatbot.service;

import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    private final OllamaService ollamaService;

    public ChatbotService(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    public String getReply(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return "Please type a question.";
        }

        String systemPrompt = """
                You are an AI assistant for the Smart Campus Management System.

                Main modules in the system:
                - Booking management
                - Resource management
                - Ticket/support management
                - User management
                - Notifications

                Your responsibilities:
                - Help users understand how to use the system
                - Explain how to create, update, view, or cancel bookings
                - Explain system features in simple words
                - Answer only questions related to this Smart Campus system
                - Keep every answer short, clear, and user-friendly
                - Keep each answer under 80 words
                - If the question is unrelated, politely say you only assist with the Smart Campus system

                Tone:
                - Friendly
                - Professional
                - Simple
                """;

        return ollamaService.askOllama(userMessage, systemPrompt);
    }
}