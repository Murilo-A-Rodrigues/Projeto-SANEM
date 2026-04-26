package com.oficina_dev.backend.dtos.Donation;

import com.oficina_dev.backend.dtos.DonationItem.DonationItemRequestDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class DonationRequestPatchDto {
    private UUID personId;
    private UUID voluntaryId;
    private List<DonationItemRequestDto> donationItems;
}
