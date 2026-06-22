package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Donation.DonationRequestDto;
import com.oficina_dev.backend.dtos.Donation.DonationResponseDto;
import com.oficina_dev.backend.models.Donation.Donation;
import com.oficina_dev.backend.repositories.DonationItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.UUID;

@Component
public class DonationMapper {

    @Autowired
    private DonationItemMapper donationItemMapper;


    public DonationResponseDto toResponse(Donation donation) {
        UUID giverId = donation.getGiver() != null ? donation.getGiver().getId() : null;
        UUID voluntaryId = donation.getVoluntary() != null ? donation.getVoluntary().getId() : null;
        return new DonationResponseDto(
                donation.getId(),
                giverId,
                voluntaryId,
                donation.getCreatedAt(),
                donation.getDonationItems() != null
                        ? donation.getDonationItems().stream()
                                .map(donationItemMapper::toResponse).toList()
                        : java.util.Collections.emptyList()
        );
    }

    public Donation toEntity(DonationRequestDto donationRequestDto) {

        return new Donation(  );
    }
}
