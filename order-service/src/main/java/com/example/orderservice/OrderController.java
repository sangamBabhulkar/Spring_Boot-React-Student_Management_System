package com.example.orderservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private PaymentClient paymentClient; // Injecting our Feign bridge

    @PostMapping
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> orderRequest) {
        String itemName = (String) orderRequest.get("item");
        Object itemPrice = orderRequest.get("price");

        // Step 1: Create local payment payload to send to Payment Service
        Map<String, Object> paymentPayload = new HashMap<>();
        paymentPayload.put("amount", itemPrice);

        // Step 2: Make the network call to Payment Service (Microservice Communication)
        Map<String, Object> paymentResponse = paymentClient.callPaymentService(paymentPayload);

        // Step 3: Check payment status and determine final order status
        String finalOrderStatus = "FAILED";
        if (paymentResponse != null && "SUCCESS".equals(paymentResponse.get("status"))) {
            finalOrderStatus = "COMPLETED";
        }

        // Step 4: Return combined order summary
        return Map.of(
            "orderId", "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
            "item", itemName,
            "orderStatus", finalOrderStatus,
            "paymentDetails", paymentResponse
        );
    }
}