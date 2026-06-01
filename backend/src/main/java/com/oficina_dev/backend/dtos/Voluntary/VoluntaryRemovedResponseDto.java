package com.oficina_dev.backend.dtos.Voluntary;

import java.time.ZonedDateTime;
import java.util.UUID;

public record VoluntaryRemovedResponseDto(
        UUID id,
        ZonedDateTime removedAt,
        String personName
) { }
