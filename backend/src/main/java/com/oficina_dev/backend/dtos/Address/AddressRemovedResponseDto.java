package com.oficina_dev.backend.dtos.Address;


import java.time.ZonedDateTime;

public record AddressRemovedResponseDto(
        String message,
        String street,
        int number,
        ZonedDateTime time
) { }
