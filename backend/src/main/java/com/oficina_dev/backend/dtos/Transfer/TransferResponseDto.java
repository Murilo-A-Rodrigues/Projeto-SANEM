package com.oficina_dev.backend.dtos.Transfer;


import com.oficina_dev.backend.dtos.DonationItem.DonationItemResponseDto;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record TransferResponseDto(
        UUID receiverId,
        UUID voluntaryId,
        ZonedDateTime date,
        List<DonationItemResponseDto> items
) { }
