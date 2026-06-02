package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Giver.GiverRequestDto;
import com.oficina_dev.backend.dtos.Giver.GiverResponseDto;
import com.oficina_dev.backend.dtos.Giver.GiverListResponseDto;
import com.oficina_dev.backend.dtos.Giver.GiverRemovedResponseDto;
import com.oficina_dev.backend.dtos.Giver.GiverRequestPatchDto;
import com.oficina_dev.backend.exceptions.EntityAlreadyExists;
import com.oficina_dev.backend.mappers.GiverMapper;
import com.oficina_dev.backend.models.Giver.Giver;
import com.oficina_dev.backend.repositories.GiverRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class GiverService {

    private static final Logger logger = LoggerFactory.getLogger(GiverService.class);
    private final String giverNotFoundMessage = "Giver not found";

    @Autowired
    private GiverRepository giverRepository;

    @Autowired
    private GiverMapper giverMapper;

    public Giver findById(UUID id) {
        logger.debug("Finding giver by ID in database: {}", id);
        return this.giverRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Giver with ID {} not found", id);
                    return new EntityNotFoundException(giverNotFoundMessage);
                });
    }

    public GiverResponseDto getById(UUID id) {
        logger.debug("Service: Fetching giver by ID: {}", id);
        Giver giver = findById(id);
        logger.debug("Giver found with ID: {}", giver.getId());
        return this.giverMapper.toResponse(giver);
    }

    public List<GiverListResponseDto> getAllFlattened() {
        logger.debug("Service: Fetching all givers (flattened)");
        List<Giver> givers = this.giverRepository.findAll();
        logger.debug("Found {} givers in database", givers.size());
        return givers.stream()
                .map(this.giverMapper::toListResponse)
                .toList();
    }

    public GiverResponseDto create(GiverRequestDto giverRequestDto) {
        logger.debug("Service: Creating new giver with person ID: {}", giverRequestDto.getPersonId());

        if(this.giverRepository.existsByPersonId(giverRequestDto.getPersonId())) {
            logger.warn("Attempt to create giver with duplicate person ID: {}", giverRequestDto.getPersonId());
            throw new EntityAlreadyExists("Giver already exists for this person");
        }

        Giver giver = this.giverMapper.toEntity(giverRequestDto);

        try {
            Giver savedGiver = this.giverRepository.saveAndFlush(giver);
            logger.info("Giver created successfully with ID: {}", savedGiver.getId());
            return this.giverMapper.toResponse(savedGiver);
        } catch (Exception e) {
            logger.error("Error creating giver: {}", e.getMessage(), e);
            throw e;
        }
    }

    public GiverResponseDto update(UUID id, GiverRequestDto giverRequestDto) {
        logger.debug("Service: Updating giver with ID: {}", id);
        Giver giver = findById(id);

        this.giverMapper.update(giver, giverRequestDto);
        Giver updatedGiver = this.giverRepository.saveAndFlush(giver);
        logger.debug("Giver updated successfully");
        return this.giverMapper.toResponse(updatedGiver);
    }

    public GiverResponseDto patch(UUID id, GiverRequestPatchDto giverRequestPatchDto) {
        logger.debug("Service: Partially updating giver with ID: {}", id);
        Giver giver = findById(id);

        this.giverMapper.patch(giver, giverRequestPatchDto);
        logger.debug("Giver with ID {} found and will be partially updated", id);
        Giver updatedGiver = this.giverRepository.saveAndFlush(giver);
        logger.debug("Giver partially updated successfully");
        return this.giverMapper.toResponse(updatedGiver);
    }

    @Transactional
    public GiverRemovedResponseDto delete(UUID id) {
        logger.debug("Service: Removing giver with ID: {}", id);
        Giver giver = this.findById(id);
        GiverRemovedResponseDto response = this.giverMapper.toRemovedResponse(giver);
        this.giverRepository.deleteGiverById(id);
        logger.info("Giver removed successfully with ID: {}", id);
        return response;
    }
}