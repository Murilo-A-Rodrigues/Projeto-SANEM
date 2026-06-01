package com.oficina_dev.backend.dtos.Item;


import java.time.ZonedDateTime;

public record ItemRemovedResponseDto(
        String message,
        String name,
        ZonedDateTime time
) { }
