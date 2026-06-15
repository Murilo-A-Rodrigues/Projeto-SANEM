package com.oficina_dev.backend.dtos.Person;


import com.oficina_dev.backend.dtos.Address.AddressResponseDto;

import java.util.UUID;

public record PersonResponseDto(
        UUID id,
        String name,
        String phone,
        String email,
        String cpf,
        AddressResponseDto address
) { }
