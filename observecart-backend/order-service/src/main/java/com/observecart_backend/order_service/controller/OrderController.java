package com.observecart_backend.order_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private static final String TOPIC = "orders";

    @PostMapping
    public Map<String, String> createOrder(@RequestBody OrderRequest orderRequest) {
        String orderId = String.valueOf(System.currentTimeMillis());
        Map<String, Object> order = new HashMap<>();
        order.put("userId", orderRequest.getUserId());
        order.put("cartItems", orderRequest.getCartItems());
        order.put("timestamp", System.currentTimeMillis());
        order.put("orderId", orderId);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String message = objectMapper.writeValueAsString(order);
            kafkaTemplate.send(TOPIC, message);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Order placed successfully");
        response.put("orderId", orderId);
        return response;
    }

    @GetMapping("/test")
    public Map<String, String> testEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "GET request successful");
        return response;
    }
}

class OrderRequest {
    private String userId;
    private String orderId;
    private long timestamp;

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    private Map<String, Integer> cartItems; // Updated to match the payload structure

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Map<String, Integer> getCartItems() {
        return cartItems;
    }

    public void setCartItems(Map<String, Integer> cartItems) {
        this.cartItems = cartItems;
    }
}