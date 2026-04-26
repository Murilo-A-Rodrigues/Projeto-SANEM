package com.oficina_dev.backend.dtos.Voluntary;


import com.oficina_dev.backend.dtos.Person.PersonResponseDto;

import java.util.UUID;

public record VoluntaryResponseDto(
        UUID id,
        PersonResponseDto person,
        Boolean active
) { }
