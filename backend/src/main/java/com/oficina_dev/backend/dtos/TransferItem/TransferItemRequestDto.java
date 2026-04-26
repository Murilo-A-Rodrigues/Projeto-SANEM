package com.oficina_dev.backend.dtos.TransferItem;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;


@Getter
@Setter
public class TransferItemRequestDto {

    @NotBlank
    private UUID itemId;

    @NotBlank
    int quantity;

}
