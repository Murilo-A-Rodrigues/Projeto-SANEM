package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Giver.GiverRequestDto;
import com.oficina_dev.backend.dtos.Giver.GiverResponseDto;
import com.oficina_dev.backend.exceptions.EntityAlreadyExists;
import com.oficina_dev.backend.mappers.GiverMapper;
import com.oficina_dev.backend.models.Giver.Giver;
import com.oficina_dev.backend.repositories.GiverRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<GiverResponseDto> getAll() {
        logger.debug("Service: Fetching all givers");
        List<Giver> givers = this.giverRepository.findAll();
        logger.debug("Found {} givers in database", givers.size());
        return givers.stream()
                .map(this.giverMapper::toResponse)
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

}
