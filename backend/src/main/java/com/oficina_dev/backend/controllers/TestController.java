package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.mappers.ItemMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class TestController {

    private final ItemMapper itemMapper;

    public TestController(ItemMapper itemMapper) {
        this.itemMapper = itemMapper;
    }

    @GetMapping("/api/test")
    public String test() {
        return "Backend está funcionando! " + System.currentTimeMillis();
    }

    @GetMapping("/api/debug")
    public Map<String, Object> debug() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "ok");
        result.put("message", "Backend operacional");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
}
