package com.oficina_dev.backend.controllers;


import com.oficina_dev.backend.dtos.Size.SizeRemovedResponseDto;
import com.oficina_dev.backend.dtos.Size.SizeRequestDto;
import com.oficina_dev.backend.dtos.Size.SizeRequestPatchDto;
import com.oficina_dev.backend.dtos.Size.SizeResponseDto;
import com.oficina_dev.backend.models.Size.Size;
import com.oficina_dev.backend.services.SizeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sizes")
public class SizeController {

    @Autowired
    private SizeService sizeService;

    @GetMapping
    public ResponseEntity<List<SizeResponseDto>> getAll() {
        List<SizeResponseDto> sizeList = this.sizeService.getAll();
        return ResponseEntity.ok(sizeList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SizeResponseDto> getById(@PathVariable UUID id){
        SizeResponseDto sizeResponseDto = this.sizeService.getById(id);
        return ResponseEntity.ok(sizeResponseDto);
    }

    @PostMapping
    public ResponseEntity<SizeResponseDto> create(@RequestBody @Valid SizeRequestDto sizeRequestDto) {
        SizeResponseDto sizeResponseDto = this.sizeService.create(sizeRequestDto);
        return ResponseEntity.ok(sizeResponseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SizeResponseDto> update(@PathVariable UUID id, @RequestBody @Valid SizeRequestDto sizeRequestDto) {
        SizeResponseDto sizeResponseDto = this.sizeService.update(id, sizeRequestDto);
        return ResponseEntity.ok(sizeResponseDto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SizeResponseDto> patch(@PathVariable UUID id, @RequestBody @Valid SizeRequestPatchDto sizeRequestDto) {
        SizeResponseDto sizeResponseDto = this.sizeService.patch(id, sizeRequestDto);
        return ResponseEntity.ok(sizeResponseDto);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SizeRemovedResponseDto> delete(@PathVariable UUID id) {
        SizeRemovedResponseDto sizeRemovedResponseDto = this.sizeService.delete(id);
        return ResponseEntity.ok(sizeRemovedResponseDto);
    }
}
