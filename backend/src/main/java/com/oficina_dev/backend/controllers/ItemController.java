package com.oficina_dev.backend.controllers;


import com.oficina_dev.backend.dtos.Item.ItemRemovedResponseDto;
import com.oficina_dev.backend.dtos.Item.ItemRequestDto;
import com.oficina_dev.backend.dtos.Item.ItemRequestPatchDto;
import com.oficina_dev.backend.dtos.Item.ItemResponseDto;
import com.oficina_dev.backend.services.ItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);

    @Autowired
    private ItemService itemService;

    @GetMapping
    public ResponseEntity<List<ItemResponseDto>> getAll(){
        List<ItemResponseDto> items = itemService.getAll();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDto> getById(@PathVariable UUID id) {
        logger.debug("Controller: Fetching item by ID: {}", id);
        ItemResponseDto item = itemService.getById(id);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    public ResponseEntity<ItemResponseDto> create(@RequestBody ItemRequestDto itemRequestDto) {
        logger.debug("Controller: Creating new item with name: {}", itemRequestDto.getName());
        ItemResponseDto createdItem = itemService.create(itemRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ItemResponseDto> patch(@PathVariable UUID id,
                                                 @RequestBody ItemRequestPatchDto itemRequestDto) {
        ItemResponseDto item = itemService.patch(id, itemRequestDto);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ItemRemovedResponseDto> delete(@PathVariable UUID id) {
        logger.debug("Controller: Deleting item with ID: {}", id);
        ItemRemovedResponseDto itemRemovedResponseDto = itemService.delete(id);
        return ResponseEntity.ok(itemRemovedResponseDto);
    }

}
