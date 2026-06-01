package com.oficina_dev.backend.dtos.Item;


import com.oficina_dev.backend.dtos.Category.CategoryResponseDto;
import com.oficina_dev.backend.dtos.Size.SizeResponseDto;

import java.util.UUID;

public record ItemResponseDto(
        UUID id,
        String name,
        Integer quantity,
        Character sex,
        CategoryResponseDto category,
        SizeResponseDto size
) { }
