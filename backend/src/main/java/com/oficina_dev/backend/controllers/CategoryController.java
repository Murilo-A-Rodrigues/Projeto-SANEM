package com.oficina_dev.backend.controllers;


import com.oficina_dev.backend.dtos.Category.CategoryRemovedResponseDto;
import com.oficina_dev.backend.dtos.Category.CategoryRequestDto;
import com.oficina_dev.backend.dtos.Category.CategoryRequestPatchDto;
import com.oficina_dev.backend.dtos.Category.CategoryResponseDto;
import com.oficina_dev.backend.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponseDto>> getAll() {
        List<CategoryResponseDto> categoryList = this.categoryService.getAll();
        return ResponseEntity.ok(categoryList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> getById(@PathVariable UUID id){
        CategoryResponseDto categoryResponseDto = categoryService.getById(id);
        return ResponseEntity.ok(categoryResponseDto);
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDto> create(@RequestBody @Valid CategoryRequestDto categoryRequestDto) {
        CategoryResponseDto categoryResponseDto = this.categoryService.create(categoryRequestDto);
        return ResponseEntity.ok(categoryResponseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> update(@PathVariable UUID id, @RequestBody @Valid CategoryRequestDto categoryRequestDto) {
        CategoryResponseDto categoryResponseDto = this.categoryService.update(id, categoryRequestDto);
        return ResponseEntity.ok(categoryResponseDto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> patch(@PathVariable UUID id, @RequestBody @Valid CategoryRequestPatchDto categoryRequestDto) {
        CategoryResponseDto categoryResponseDto = this.categoryService.patch(id, categoryRequestDto);
        return ResponseEntity.ok(categoryResponseDto);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CategoryRemovedResponseDto> delete(@PathVariable UUID id) {
        CategoryRemovedResponseDto categoryRemovedResponseDto = this.categoryService.delete(id);
        return ResponseEntity.ok(categoryRemovedResponseDto);
    }

}
