package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Size.SizeRemovedResponseDto;
import com.oficina_dev.backend.dtos.Size.SizeRequestDto;
import com.oficina_dev.backend.dtos.Size.SizeRequestPatchDto;
import com.oficina_dev.backend.dtos.Size.SizeResponseDto;
import com.oficina_dev.backend.exceptions.EntityAlreadyExists;
import com.oficina_dev.backend.mappers.SizeMapper;
import com.oficina_dev.backend.models.Size.Size;
import com.oficina_dev.backend.repositories.SizeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SizeService {

    private final String sizeNotFoundMessage = "Size not found";

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private SizeMapper sizeMapper;

    public Size findById(UUID id) {
        return sizeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(sizeNotFoundMessage));
    }

    public SizeResponseDto getById(UUID id) {
        Size size = findById(id);
        return this.sizeMapper.toResponse(size);
    }

    public List<SizeResponseDto> getAll() {
        List<Size> sizes = this.sizeRepository.findAll();
        return sizes.stream()
                .map(this.sizeMapper::toResponse)
                .toList();
    }

    public SizeResponseDto create(SizeRequestDto sizeRequestDto) {
        Size size = this.sizeMapper.toEntity(sizeRequestDto);
        if(this.sizeRepository.existsByName(
                size.getName()
        )) {
            String sizeAlreadyExistsMessage = "Size already exists";
            throw new EntityAlreadyExists(sizeAlreadyExistsMessage);
        }
        Size savedSize = this.sizeRepository.saveAndFlush(size);
        return this.sizeMapper.toResponse(savedSize);
    }

    public SizeResponseDto update(UUID id, SizeRequestDto sizeRequestDto){
        Size size = this.findById(id);
        this.sizeMapper.update(size, sizeRequestDto);
        Size savedSize = this.sizeRepository.saveAndFlush(size);
        return this.sizeMapper.toResponse(savedSize);
    }

    public SizeResponseDto patch(UUID id, SizeRequestPatchDto sizeRequestDto) {
        Size size = this.findById(id);
        this.sizeMapper.patch(size, sizeRequestDto);
        Size savedSize = this.sizeRepository.saveAndFlush(size);
        return this.sizeMapper.toResponse(savedSize);
    }

    public SizeRemovedResponseDto delete(UUID id) {
        Size size = this.findById(id);
        this.sizeRepository.deleteById(id);
        return this.sizeMapper.toRemovedResponse(size);
    }
}
