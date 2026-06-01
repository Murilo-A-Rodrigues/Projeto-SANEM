package com.oficina_dev.backend.dtos.Limit;


import java.util.UUID;

public record LimitResponseDto(
        UUID id,
        int month,
        int year,
        int limitQuantity
) { }
