package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Category.CategoryRemovedResponseDto;
import com.oficina_dev.backend.dtos.Category.CategoryRequestDto;
import com.oficina_dev.backend.dtos.Category.CategoryRequestPatchDto;
import com.oficina_dev.backend.dtos.Category.CategoryResponseDto;
import com.oficina_dev.backend.exceptions.EntityAlreadyExists;
import com.oficina_dev.backend.mappers.CategoryMapper;
import com.oficina_dev.backend.models.Category.Category;
import com.oficina_dev.backend.repositories.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    private final String categoryNotFoundMessage = "Category not found";

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;


    public Category findById(UUID id){
        return categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(categoryNotFoundMessage));
    }

    public CategoryResponseDto getById(UUID id){
        Category category = this.findById(id);
        return categoryMapper.toResponse(category);
    }

    public List<CategoryResponseDto> getAll() {
        List<Category> categories = this.categoryRepository.findAll();
        return categories.stream()
                .map(this.categoryMapper::toResponse)
                .toList();
    }

    public CategoryResponseDto create (CategoryRequestDto categoryRequestDto){
        Category category = this.categoryMapper.toEntity(categoryRequestDto);
        if(this.categoryRepository.existsByName(
                category.getName()
        )){
            String categoryAlreadyExistsMessage = "Category already exists";
            throw new EntityAlreadyExists(categoryAlreadyExistsMessage);
        }
        Category savedCategory = this.categoryRepository.saveAndFlush(category);
        return this.categoryMapper.toResponse(savedCategory);
    }

    public CategoryResponseDto update(UUID id, CategoryRequestDto categoryRequestDto){
        Category category = this.findById(id);
        this.categoryMapper.update(category, categoryRequestDto);
        Category savedCategory = this.categoryRepository.saveAndFlush(category);
        return this.categoryMapper.toResponse(savedCategory);
    }

    public CategoryResponseDto patch(UUID id, CategoryRequestPatchDto categoryRequestDto){
        Category category = this.findById(id);
        this.categoryMapper.patch(category, categoryRequestDto);
        Category savedCategory = this.categoryRepository.saveAndFlush(category);
        return this.categoryMapper.toResponse(savedCategory);
    }

    public CategoryRemovedResponseDto delete(UUID id){
        Category category = this.findById(id);
        this.categoryRepository.deleteById(id);
        return this.categoryMapper.toRemovedResponse(category);
    }


}
