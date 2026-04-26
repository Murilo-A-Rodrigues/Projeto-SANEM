package com.oficina_dev.backend.dtos.ReceiverLimit;


import java.util.UUID;

public record ReceiverLimitResponseDto(
        UUID receiverId,
        UUID limitId,
        int caughtItems
) {}
