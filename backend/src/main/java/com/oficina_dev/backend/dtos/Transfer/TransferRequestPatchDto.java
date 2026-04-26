package com.oficina_dev.backend.dtos.Transfer;

import com.oficina_dev.backend.dtos.TransferItem.TransferItemRequestDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class TransferRequestPatchDto {
    private UUID receiverId;
    private UUID voluntaryId;
    private List<TransferItemRequestDto> transferDonationItems;
}
