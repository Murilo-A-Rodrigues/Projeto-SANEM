package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Donation.DonationRequestDto;
import com.oficina_dev.backend.dtos.Donation.DonationResponseDto;
import com.oficina_dev.backend.mappers.DonationMapper;
import com.oficina_dev.backend.mappers.DonationItemMapper;
import com.oficina_dev.backend.models.Donation.Donation;
import com.oficina_dev.backend.models.DonationItem.DonationItem;
import com.oficina_dev.backend.models.Giver.Giver;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.DonationRepository;
import com.oficina_dev.backend.repositories.DonationItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DonationService {

    private static final Logger logger = LoggerFactory.getLogger(DonationService.class);

    @Autowired
    private DonationMapper donationMapper;

    @Autowired
    private DonationItemMapper donationItemMapper;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private DonationItemRepository donationItemRepository;

    @Autowired
    private ItemService itemService;

    @Autowired
    private GiverService giverService;

    @Autowired
    private VoluntaryService voluntaryService;

    public Donation findById(UUID id) {
        return this.donationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Donation not found"));
    }

    public List<DonationResponseDto> getAll() {
        return this.donationRepository.findAll().stream().map(donationMapper::toResponse).toList();
    }

    public DonationResponseDto getById(UUID id) {
        Donation donation = this.findById(id);
        return this.donationMapper.toResponse(donation);
    }

    @Transactional
    public DonationResponseDto create(DonationRequestDto dto) {
        logger.info("Creating donation with {} items, giver ID: {}, voluntary ID: {}",
                    dto.getDonationItems().size(),
                    dto.getGiverId(),
                    dto.getVoluntaryId());

        try {
            Giver giver = giverService.findById(dto.getGiverId());
            Voluntary voluntary = voluntaryService.findById(dto.getVoluntaryId());
            Donation donation = donationRepository.saveAndFlush(new Donation(giver, voluntary));

            if (dto.getDonationItems() != null && !dto.getDonationItems().isEmpty()) {
                dto.getDonationItems().forEach(donationItemDto -> {
                    DonationItem donationItem = donationItemMapper
                            .toEntity(donationItemDto, donation, itemService.findById(donationItemDto.getItemId()));
                    donationItem.getItem().incrementQuantity(donationItem.getQuantity());
                    itemService.save(donationItem.getItem());
                    donation.addDonationItem(donationItemRepository.saveAndFlush(donationItem));
                });
            }
            logger.info("Donation created successfully with ID: {}", donation.getId());
            return donationMapper.toResponse(donation);
        } catch (EntityNotFoundException e) {
            logger.error("Error creating donation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error creating donation: {}", e.getMessage(), e);
            throw e;
        }
    }

}
