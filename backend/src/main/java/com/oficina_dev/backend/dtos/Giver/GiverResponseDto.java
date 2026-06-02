package com.oficina_dev.backend.dtos.Giver;

import com.oficina_dev.backend.dtos.Person.PersonResponseDto;

import java.util.UUID;

public record GiverResponseDto(UUID id, PersonResponseDto person)
{ }