package com.oficina_dev.backend.dtos.Transfer;

import com.oficina_dev.backend.dtos.TransferItem.TransferItemRequestDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class TransferRequestDto {
    private UUID receiverId;

    private UUID voluntaryId;

    private List<TransferItemRequestDto> transferDonationItems;
}
