package com.oficina_dev.backend.dtos.Transfer;

import com.oficina_dev.backend.dtos.TransferItem.TransferItemRequestDto;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class TransferRequestDto {
    @NotBlank
    private UUID receiverId;

    @NotBlank
    private UUID voluntaryId;

    @NotBlank
    private List<TransferItemRequestDto> transferDonationItems;
}
