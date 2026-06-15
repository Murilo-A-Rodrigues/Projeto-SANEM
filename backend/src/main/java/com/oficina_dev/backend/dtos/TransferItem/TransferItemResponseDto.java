package com.oficina_dev.backend.dtos.TransferItem;


import com.oficina_dev.backend.dtos.Item.ItemResponseDto;

import java.util.UUID;

public record TransferItemResponseDto(
        UUID transferDonationId,
        ItemResponseDto item,
        int quantity
) { }
