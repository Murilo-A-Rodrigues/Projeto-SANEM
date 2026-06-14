package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Giver.GiverRequestDto;
import com.oficina_dev.backend.dtos.Giver.GiverResponseDto;
import com.oficina_dev.backend.dtos.Giver.GiverListResponseDto;
import com.oficina_dev.backend.dtos.Giver.GiverRemovedResponseDto;
import com.oficina_dev.backend.dtos.Giver.GiverRequestPatchDto;
import com.oficina_dev.backend.services.GiverService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/givers")
public class GiverController {

    private static final Logger logger = LoggerFactory.getLogger(GiverController.class);

    @Autowired
    private GiverService giverService;

    @GetMapping
    public ResponseEntity<List<GiverListResponseDto>> getAll() {
        logger.info("Fetching all givers");
        List<GiverListResponseDto> giverList = this.giverService.getAllFlattened();
        logger.info("Returning {} givers", giverList.size());
        return ResponseEntity.ok(giverList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GiverResponseDto> getById(@PathVariable UUID id){
        logger.info("Fetching giver by ID: {}", id);
        GiverResponseDto giverResponseDto = this.giverService.getById(id);
        logger.info("Giver found with ID: {}", giverResponseDto.id());
        return ResponseEntity.ok(giverResponseDto);
    }

    @PostMapping
    public ResponseEntity<GiverResponseDto> create(@RequestBody @Valid GiverRequestDto giverRequestDto) {
        logger.info("Creating new giver with person ID: {}", giverRequestDto.getPersonId());
        GiverResponseDto giverResponseDto = this.giverService.create(giverRequestDto);
        logger.info("Giver created successfully. ID: {}", giverResponseDto.id());
        return ResponseEntity.ok(giverResponseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GiverResponseDto> update(
            @PathVariable UUID id,
            @RequestBody @Valid GiverRequestDto giverRequestDto
    ) {
        logger.info("Updating giver with ID: {}", id);
        GiverResponseDto giverResponseDto = this.giverService.update(id, giverRequestDto);
        logger.info("Giver updated successfully");
        return ResponseEntity.ok(giverResponseDto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<GiverResponseDto> partialUpdate(
            @PathVariable UUID id,
            @RequestBody @Valid GiverRequestPatchDto giverRequestPatchDto
    ) {
        logger.info("Partially updating giver with ID: {}", id);
        GiverResponseDto giverResponseDto = this.giverService.patch(id, giverRequestPatchDto);
        logger.info("Giver partially updated successfully");
        return ResponseEntity.ok(giverResponseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GiverRemovedResponseDto> delete(@PathVariable UUID id) {
        logger.info("Removing giver with ID: {}", id);
        GiverRemovedResponseDto giverRemovedResponseDto = this.giverService.delete(id);
        logger.info("Giver removed successfully with ID: {}", giverRemovedResponseDto.id());
        return ResponseEntity.ok(giverRemovedResponseDto);
    }
}