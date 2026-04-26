package com.oficina_dev.backend.dtos.Address;


import java.util.UUID;

public record AddressResponseDto(
        UUID id,
        int number,
        String street,
        String neighborhood,
        String complement,
        String referencePoint
) { }
