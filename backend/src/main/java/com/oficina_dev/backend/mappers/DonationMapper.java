package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Donation.DonationRequestDto;
import com.oficina_dev.backend.dtos.Donation.DonationResponseDto;
import com.oficina_dev.backend.models.Donation.Donation;
import com.oficina_dev.backend.repositories.DonationItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class DonationMapper {

    @Autowired
    private DonationItemMapper donationItemMapper;


    public DonationResponseDto toResponse(Donation donation) {
        return new DonationResponseDto(
                donation.getId(),
                donation.getGiver().getId(),
                donation.getVoluntary().getId(),
                donation.getCreatedAt(),
                donation.getDonationItems().stream()
                        .map(donationItemMapper::toResponse).toList()
        );
    }

    public Donation toEntity(DonationRequestDto donationRequestDto) {

        return new Donation(  );
    }
}
