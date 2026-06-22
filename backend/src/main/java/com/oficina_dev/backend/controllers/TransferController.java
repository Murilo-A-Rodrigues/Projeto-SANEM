package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Transfer.TransferRequestDto;
import com.oficina_dev.backend.dtos.Transfer.TransferResponseDto;
import com.oficina_dev.backend.services.TransferService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private static final Logger logger = LoggerFactory.getLogger(TransferController.class);

    @Autowired
    private TransferService transferService;

    @GetMapping
    public ResponseEntity<List<TransferResponseDto>> getAll() {
        logger.info("Fetching all transfers");
        List<TransferResponseDto> transfers = transferService.getAllDtos();
        return ResponseEntity.ok(transfers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransferResponseDto> getById(@PathVariable UUID id) {
        logger.info("Fetching transfer by ID: {}", id);
        TransferResponseDto transferResponseDto = transferService.getById(id);
        return ResponseEntity.ok(transferResponseDto);
    }

    @PostMapping
    public ResponseEntity<TransferResponseDto> create(@RequestBody @Valid TransferRequestDto transferRequestDto) {
        logger.info("Creating new transfer");
        TransferResponseDto transfer = transferService.create(transferRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(transfer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        logger.info("Deleting transfer with ID: {}", id);
        transferService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}