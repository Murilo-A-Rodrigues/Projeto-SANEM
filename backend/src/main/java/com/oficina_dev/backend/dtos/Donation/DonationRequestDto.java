package com.oficina_dev.backend.dtos.Donation;

import com.oficina_dev.backend.dtos.DonationItem.DonationItemRequestDto;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class DonationRequestDto {

    @NotBlank
    private UUID giverId;

    @NotBlank
    private UUID voluntaryId;

    @NotBlank
    private List<DonationItemRequestDto> donationItems;

}
