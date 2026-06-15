package com.oficina_dev.backend.dtos.DonationItem;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class DonationItemRequestDto {

    @NotBlank
    private UUID itemId;

    @NotBlank
    private Integer quantity;

}
