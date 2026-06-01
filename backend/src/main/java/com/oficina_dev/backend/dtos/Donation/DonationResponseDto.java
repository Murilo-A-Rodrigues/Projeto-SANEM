package com.oficina_dev.backend.dtos.Donation;


import com.oficina_dev.backend.dtos.DonationItem.DonationItemResponseDto;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record DonationResponseDto(
        UUID id,
        UUID giverId,
        UUID voluntaryId,
        ZonedDateTime date,
        List<DonationItemResponseDto> items
) { }
