package com.example.orderservice;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

// Instead of url = "http://localhost:8082", we just use the spring.application.name
@FeignClient(name = "payment-service") 
public interface PaymentClient {

    @PostMapping("/payments/process")
    Map<String, Object> callPaymentService(@RequestBody Map<String, Object> paymentRequest);
}