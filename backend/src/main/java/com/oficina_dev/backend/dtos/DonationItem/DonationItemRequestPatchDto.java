package com.oficina_dev.backend.dtos.DonationItem;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class DonationItemRequestPatchDto {
    private UUID itemId;
    private Integer quantity;
}
