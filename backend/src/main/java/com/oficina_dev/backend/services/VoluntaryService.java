package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRequestDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryResponseDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRemovedResponseDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryListResponseDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRequestPatchDto;
import com.oficina_dev.backend.mappers.VoluntaryMapper;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.VoluntaryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class VoluntaryService {

    private static final Logger logger = LoggerFactory.getLogger(VoluntaryService.class);
    private final String voluntaryNotFoundMessage = "Voluntary not found";

    @Autowired
    private VoluntaryRepository voluntaryRepository;

    @Autowired
    private VoluntaryMapper voluntaryMapper;

    @Autowired
    private PersonService personService;

    public Voluntary findById(UUID id) {
        logger.info("Searching for voluntary with ID: {}", id);
        return voluntaryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Voluntary with ID {} not found", id);
                    return new EntityNotFoundException(voluntaryNotFoundMessage);
                });
    }

    public List<VoluntaryResponseDto> getAll() {
        logger.info("Fetching all voluntaries");
        List<Voluntary> voluntaries = voluntaryRepository.findAll();
        logger.info("Found {} voluntaries", voluntaries.size());
        return voluntaries.stream()
                .map(voluntaryMapper::toResponse)
                .toList();
    }

    public List<VoluntaryListResponseDto> getAllFlattened() {
        logger.info("Fetching all voluntaries (flattened)");
        List<Voluntary> voluntaries = voluntaryRepository.findAll();
        logger.info("Found {} voluntaries", voluntaries.size());
        return voluntaries.stream()
                .map(voluntaryMapper::toListResponse)
                .toList();
    }

    public VoluntaryResponseDto getById(UUID id) {
        logger.debug("Service: Fetching voluntary by ID: {}", id);
        Voluntary voluntary = findById(id);
        logger.debug("Voluntary found with ID: {}", voluntary.getId());
        return this.voluntaryMapper.toResponse(voluntary);
    }

    public VoluntaryResponseDto create(VoluntaryRequestDto voluntaryRequestDto) {
        logger.debug("Service: Creating new voluntary");
        Voluntary voluntary = this.voluntaryMapper.toEntity(voluntaryRequestDto);
        try {
            Voluntary savedVoluntary = this.voluntaryRepository.saveAndFlush(voluntary);
            logger.info("Voluntary created successfully with ID: {}", savedVoluntary.getId());
            return this.voluntaryMapper.toResponse(savedVoluntary);
        } catch (Exception e) {
            logger.error("Error creating voluntary: {}", e.getMessage(), e);
            throw e;
        }
    }

    public VoluntaryResponseDto update(UUID id, VoluntaryRequestDto voluntaryRequestDto) {
        logger.debug("Service: Updating voluntary with ID: {}", id);
        Voluntary voluntary = this.findById(id);
        this.voluntaryMapper.update(voluntary, voluntaryRequestDto);
        try {
            Voluntary savedVoluntary = this.voluntaryRepository.saveAndFlush(voluntary);
            logger.info("Voluntary updated successfully with ID: {}", savedVoluntary.getId());
            return this.voluntaryMapper.toResponse(savedVoluntary);
        } catch (Exception e) {
            logger.error("Error updating voluntary with ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    public VoluntaryResponseDto patch(UUID id, VoluntaryRequestPatchDto voluntaryRequestPatchDto) {
        logger.debug("Service: Partially updating voluntary with ID: {}", id);
        Voluntary voluntary = this.findById(id);
        this.voluntaryMapper.patch(voluntary, voluntaryRequestPatchDto);
        try {
            Voluntary savedVoluntary = this.voluntaryRepository.saveAndFlush(voluntary);
            logger.info("Voluntary patched successfully with ID: {}", savedVoluntary.getId());
            return this.voluntaryMapper.toResponse(savedVoluntary);
        } catch (Exception e) {
            logger.error("Error patching voluntary with ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public VoluntaryRemovedResponseDto delete(UUID id) {
        logger.debug("Service: Removing voluntary with ID: {}", id);
        Voluntary voluntary = this.findById(id);
        VoluntaryRemovedResponseDto response = this.voluntaryMapper.toRemovedResponse(voluntary);
        this.voluntaryRepository.deleteVoluntaryById(id);
        logger.info("Voluntary removed successfully with ID: {}", id);
        return response;
    }
}