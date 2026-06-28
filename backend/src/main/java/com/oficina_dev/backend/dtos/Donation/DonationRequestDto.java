package com.oficina_dev.backend.dtos.Donation;

import com.oficina_dev.backend.dtos.DonationItem.DonationItemRequestDto;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class DonationRequestDto {

    private UUID giverId;

    private UUID voluntaryId;

    @NotNull
    private List<DonationItemRequestDto> donationItems;

}