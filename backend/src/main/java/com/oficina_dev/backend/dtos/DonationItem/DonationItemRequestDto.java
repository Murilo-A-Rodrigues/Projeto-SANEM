package com.oficina_dev.backend.dtos.DonationItem;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class DonationItemRequestDto {

    @NotNull
    private UUID itemId;

    @NotNull
    private Integer quantity;

}