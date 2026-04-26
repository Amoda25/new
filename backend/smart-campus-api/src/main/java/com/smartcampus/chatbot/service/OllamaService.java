package com.smartcampus.chatbot.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OllamaService {

    private final RestTemplate restTemplate;

    public OllamaService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String askOllama(String userMessage, String systemPrompt) {
        String url = "http://localhost:11434/api/chat";

        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);

        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", userMessage);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama3.2:latest");
        requestBody.put("stream", false);
        requestBody.put("messages", List.of(systemMessage, userMsg));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<?, ?> body = response.getBody();
            if (body == null || !body.containsKey("message")) {
                return "Sorry, I could not get a valid reply from Ollama.";
            }

            Map<?, ?> message = (Map<?, ?>) body.get("message");
            Object content = message.get("content");

            if (content == null) {
                return "Sorry, Ollama returned an empty response.";
            }

            return content.toString().trim();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Could not connect to local Ollama.";
        }
    }
}
