package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Donation.DonationRequestDto;
import com.oficina_dev.backend.dtos.Donation.DonationResponseDto;
import com.oficina_dev.backend.services.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/donations")
public class DonationController {
    @Autowired
    private DonationService donationService;

    @GetMapping
    public ResponseEntity<List<DonationResponseDto>> getAll() {
        List<DonationResponseDto> donations = donationService.getAll();
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponseDto> getById(@PathVariable UUID id) {
        DonationResponseDto donationResponseDto = donationService.getById(id);
        return ResponseEntity.ok(donationResponseDto);
    }

    @PostMapping
    public ResponseEntity<DonationResponseDto> create(@RequestBody DonationRequestDto donationRequestDto) {
        DonationResponseDto donation = donationService.create(donationRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(donation);
    }


}
