package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Limit.LimitRequestPatchDto;
import com.oficina_dev.backend.dtos.Limit.LimitResponseDto;
import com.oficina_dev.backend.services.LimitService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/limits")
public class LimitController {

    private static final Logger logger = LoggerFactory.getLogger(LimitController.class);

    @Autowired
    private LimitService limitService;

    @GetMapping
    public ResponseEntity<List<LimitResponseDto>> getAll() {
        logger.info("Fetching all limits");
        List<LimitResponseDto> limitList = this.limitService.getAll();
        logger.info("Returning {} limits", limitList.size());
        return ResponseEntity.ok(limitList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LimitResponseDto> getById(@PathVariable UUID id) {
        logger.info("Fetching limit by ID: {}", id);
        LimitResponseDto limitResponseDto = this.limitService.getById(id);
        logger.info("Limit found: ID={}, Month={}, Year={}", limitResponseDto.id(), limitResponseDto.month(), limitResponseDto.year());
        return ResponseEntity.ok(limitResponseDto);
    }

    @GetMapping("/{year}/{month}")
    public ResponseEntity<LimitResponseDto> getByYearAndMonth(
            @PathVariable(name = "year") Integer year,
            @PathVariable(name = "month") Integer month
    ) {
        logger.info("Fetching limit for Year: {}, Month: {}", year, month);
        LimitResponseDto limitResponseDto = this.limitService.getByYearAndMonth(year, month);
        logger.info("Limit found: ID={}, Month={}, Year={}", limitResponseDto.id(), limitResponseDto.month(), limitResponseDto.year());
        return ResponseEntity.ok(limitResponseDto);
    }


    @PatchMapping("/{id}")
    public ResponseEntity<LimitResponseDto> patch(
            @PathVariable UUID id,
            @RequestBody @Valid LimitRequestPatchDto limitRequestPatchDto
    ) {
        logger.info("Partially updating limit with ID: {}", id);
        LimitResponseDto limitResponseDto = this.limitService.patch(id, limitRequestPatchDto);
        logger.info("Limit partially updated successfully");
        return ResponseEntity.ok(limitResponseDto);
    }

}
