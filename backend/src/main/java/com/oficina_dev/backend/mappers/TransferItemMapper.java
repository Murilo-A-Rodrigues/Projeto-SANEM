package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.TransferItem.TransferItemRequestDto;
import com.oficina_dev.backend.dtos.DonationItem.DonationItemResponseDto;
import com.oficina_dev.backend.models.Item.Item;
import com.oficina_dev.backend.models.Transfer.Transfer;
import com.oficina_dev.backend.models.TransferItem.TransferItem;
import com.oficina_dev.backend.models.TransferItem.TransferItemId;
import org.springframework.stereotype.Component;

@Component
public class TransferItemMapper {

    public TransferItem toEntity(TransferItemRequestDto dto, Transfer transfer, Item item) {
        return new TransferItem(
                new TransferItemId(transfer.getId(), item.getId()),
                dto.getQuantity(),
                item,
                transfer
        );
    }

    public DonationItemResponseDto toResponse(TransferItem transferItem) {
        return new DonationItemResponseDto(
                transferItem.getId().getTransferId(),
                transferItem.getId().getItemId(),
                transferItem.getQuantity()
        );
    }
}