package com.oficina_dev.backend.dtos.Giver;

import java.time.ZonedDateTime;
import java.util.UUID;

public record GiverRemovedResponseDto(UUID id, ZonedDateTime removedAt) {
}