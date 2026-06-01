package com.oficina_dev.backend.dtos.TransferItem;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class TransferItemRequestPatchDto {
    private UUID itemId;
    int quantity;
}
