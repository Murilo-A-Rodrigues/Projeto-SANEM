package com.oficina_dev.backend.dtos.Category;


import java.util.UUID;

public record CategoryResponseDto(
        UUID id,
        String name
) { }
