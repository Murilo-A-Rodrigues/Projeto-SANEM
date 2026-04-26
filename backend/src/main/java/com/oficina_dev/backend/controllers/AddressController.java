package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Address.AddressRemovedResponseDto;
import com.oficina_dev.backend.dtos.Address.AddressRequestDto;
import com.oficina_dev.backend.dtos.Address.AddressRequestPatchDto;
import com.oficina_dev.backend.dtos.Address.AddressResponseDto;
import com.oficina_dev.backend.services.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressResponseDto>> getAll() {
        List<AddressResponseDto> addressList = this.addressService.getAll();
        return ResponseEntity.ok(addressList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponseDto> getById(@PathVariable UUID id){
        AddressResponseDto addressResponseDto = this.addressService.getById(id);
        return ResponseEntity.ok(addressResponseDto);
    }

    @PostMapping
    public ResponseEntity<AddressResponseDto> create(@RequestBody @Valid AddressRequestDto addressRequestDto) {
        AddressResponseDto addressResponseDto = this.addressService.create(addressRequestDto);
        return ResponseEntity.ok(addressResponseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponseDto> update(@PathVariable UUID id, @RequestBody @Valid AddressRequestDto addressRequestDto) {
        AddressResponseDto addressResponseDto = this.addressService.update(id, addressRequestDto);
        return ResponseEntity.ok(addressResponseDto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AddressResponseDto> patch(@PathVariable UUID id, @RequestBody @Valid AddressRequestPatchDto addressRequestDto) {
        AddressResponseDto addressResponseDto = this.addressService.patch(id, addressRequestDto);
        return ResponseEntity.ok(addressResponseDto);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AddressRemovedResponseDto> delete(@PathVariable UUID id) {
        AddressRemovedResponseDto addressRemovedResponseDto = this.addressService.delete(id);
        return ResponseEntity.ok(addressRemovedResponseDto);
    }

}
