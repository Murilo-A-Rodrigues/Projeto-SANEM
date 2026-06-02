package com.oficina_dev.backend.dtos.Person;


import java.time.ZonedDateTime;

public record PersonRemovedResponseDto(
        String message,
        String name,
        ZonedDateTime time
) { }
