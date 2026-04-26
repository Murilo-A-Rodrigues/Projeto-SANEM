package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.DonationItem.DonationItemRequestDto;
import com.oficina_dev.backend.dtos.DonationItem.DonationItemResponseDto;
import com.oficina_dev.backend.models.Donation.Donation;
import com.oficina_dev.backend.models.DonationItem.DonationItem;
import com.oficina_dev.backend.models.DonationItem.DonationItemId;
import com.oficina_dev.backend.models.Item.Item;
import com.oficina_dev.backend.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DonationItemMapper {

    public DonationItemResponseDto toResponse(DonationItem donationItem) {
        return new DonationItemResponseDto(
                donationItem.getId().getDonationId(),
                donationItem.getId().getItemId(),
                donationItem.getQuantity()
        );
    }

    public DonationItem toEntity(DonationItemRequestDto donationItemRequestDto, Donation donation, Item item) {
        return new DonationItem(
                new DonationItemId(donation.getId(), item.getId()),
                donationItemRequestDto.getQuantity(),
                donation,
                item
        );
    }
}
