package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Stats.StatsDto;
import com.oficina_dev.backend.services.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@CrossOrigin
public class StatsController {
    private final StatsService statsService;

    @GetMapping
    public StatsDto getStats() {
        return statsService.get();
    }
}
