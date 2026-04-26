package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Category.CategoryResponseDto;
import com.oficina_dev.backend.dtos.Item.ItemRemovedResponseDto;
import com.oficina_dev.backend.dtos.Item.ItemRequestDto;
import com.oficina_dev.backend.dtos.Item.ItemRequestPatchDto;
import com.oficina_dev.backend.dtos.Item.ItemResponseDto;
import com.oficina_dev.backend.dtos.Size.SizeResponseDto;
import com.oficina_dev.backend.models.Category.Category;
import com.oficina_dev.backend.models.Item.Item;
import com.oficina_dev.backend.models.Size.Size;
import com.oficina_dev.backend.services.CategoryService;
import com.oficina_dev.backend.services.SizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class ItemMapper {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private SizeService sizeService;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private SizeMapper sizeMapper;

    public ItemResponseDto toResponse(Item item) {
        if (item == null) {
            return null;
        }
        CategoryResponseDto categoryDto = categoryMapper.toResponse(item.getCategory());
        SizeResponseDto sizeDto = sizeMapper.toResponse(item.getSize());
        return new ItemResponseDto(
                item.getId(),
                item.getName(),
                item.getQuantity(),
                item.getSex(),
                categoryDto,
                sizeDto
        );
    }

    public Item toEntity(ItemRequestDto dto) {
        Category category = categoryService.findById(dto.getCategoryId());
        Size size = sizeService.findById(dto.getSizeId());
        return new Item(dto.getName(), dto.getQuantity(),
                        dto.getSex(), category, size);
    }

    public void update(Item item, ItemRequestDto dto) {
        Category category = categoryService.findById(dto.getCategoryId());
        Size size = sizeService.findById(dto.getSizeId());
        item.setName(dto.getName());
        item.setSex(dto.getSex());
        item.setQuantity(dto.getQuantity());
        item.setCategory(category);
        item.setSize(size);
    }

    public void patch(Item item, ItemRequestPatchDto dto) {
        if (dto.getName() != null) {
            item.setName(dto.getName());
        }
        if (dto.getSex() != null) {
            item.setSex(dto.getSex());
        }

        if(dto.getQuantity() != null) {
            item.setQuantity(dto.getQuantity());
        }

        if (dto.getCategoryId() != null) {
            Category category = categoryService.findById(dto.getCategoryId());
            item.setCategory(category);
        }

        if (dto.getSizeId() != null) {
            Size size = sizeService.findById(dto.getSizeId());
            item.setSize(size);
        }

    }

    public ItemRemovedResponseDto toRemovedResponse(Item item) {
        return new ItemRemovedResponseDto(
            "Item removed successfully",
                item.getName(),
                ZonedDateTime.now()
        );
    }

}