package com.observecart_backend.order_processor.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class OrderProcessor {

  private static final Logger logger = LoggerFactory.getLogger(OrderProcessor.class);
  // private final RestTemplate restTemplate = new RestTemplate();
  private final ObjectMapper objectMapper = new ObjectMapper();

  @KafkaListener(topics = "orders", groupId = "order-processor-group")
  public void processOrder(String message) {
    try {
      logger.info("Received message: {}", message);
      Order order = parseOrder(message);

      if (order == null || order.getCartItems() == null) {
        logger.error("Invalid order structure. CartItems is missing or not an object.");
        return;
      }

      updateInventory(order);

      logger.info("Finished processing order: {}", order.getOrderId());
    } catch (Exception e) {
      logger.error("Error processing order:", e);
    }
  }

  private Order parseOrder(String message) {
    try {
      return objectMapper.readValue(message, Order.class);
    } catch (Exception e) {
      logger.error("Failed to parse order message: {}", e.getMessage());
      return null;
    }
  }

  private void updateInventory(Order order) {
    for (Map.Entry<String, Integer> entry : order.getCartItems().entrySet()) {
      String productId = entry.getKey();
      // int quantity = entry.getValue();
      try {
        // Example HTTP request to update inventory
        // String inventoryServiceUrl = "http://inventory-service/update";
        // InventoryUpdateRequest request = new InventoryUpdateRequest(productId,
        // -quantity);
        // restTemplate.postForObject(inventoryServiceUrl, request, Void.class);
        logger.info("Updated inventory for product {}", productId);
      } catch (Exception e) {
        logger.error("Failed to update inventory for product {}: {}", productId, e.getMessage());
      }
    }
  }
}

class Order {
  private String userId;
  private String orderId;
  private Map<String, Integer> cartItems; // Updated to match the payload structure

  private long timestamp;

  public long getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(long timestamp) {
    this.timestamp = timestamp;
  }

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

class InventoryUpdateRequest {
  private String productId;
  private int quantity;

  public InventoryUpdateRequest(String productId, int quantity) {
    this.productId = productId;
    this.quantity = quantity;
  }

  // Getters and Setters
  public String getProductId() {
    return productId;
  }

  public void setProductId(String productId) {
    this.productId = productId;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }
}