package com.oficina_dev.backend.dtos.Size;


import java.time.ZonedDateTime;

public record SizeRemovedResponseDto(
        String message,
        String name,
        ZonedDateTime time
) { }
