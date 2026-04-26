package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Category.CategoryRemovedResponseDto;
import com.oficina_dev.backend.dtos.Category.CategoryRequestDto;
import com.oficina_dev.backend.dtos.Category.CategoryRequestPatchDto;
import com.oficina_dev.backend.dtos.Category.CategoryResponseDto;
import com.oficina_dev.backend.models.Category.Category;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class CategoryMapper {

    public CategoryResponseDto toResponse(Category category){
        if (category == null){
            return null;
        }

        return new CategoryResponseDto(
                category.getId(),
                category.getName()
        );
    }

    public Category toEntity(CategoryRequestDto categoryRequestDto) {
        return new Category(
                categoryRequestDto.getName()
        );
    }

    public CategoryRemovedResponseDto toRemovedResponse(Category category) {
        return new CategoryRemovedResponseDto(
                "Category removed successfully",
                category.getName(),
                ZonedDateTime.now()
        );
    }

    public void update(Category category, CategoryRequestDto categoryRequestDto) {
        category.setName(categoryRequestDto.getName());
    }

    public void patch(Category category, CategoryRequestPatchDto categoryRequestDto) {
        if (categoryRequestDto.getName() != null) {
            category.setName(categoryRequestDto.getName());
        }
    }

}