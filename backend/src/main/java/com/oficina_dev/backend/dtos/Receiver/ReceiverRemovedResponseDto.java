package com.oficina_dev.backend.dtos.Receiver;

import java.time.ZonedDateTime;
import java.util.UUID;

public record ReceiverRemovedResponseDto(
        UUID id,
        ZonedDateTime removedAt,
        String nif
) { }
