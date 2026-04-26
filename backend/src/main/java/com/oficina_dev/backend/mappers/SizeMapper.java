package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Size.SizeRemovedResponseDto;
import com.oficina_dev.backend.dtos.Size.SizeRequestDto;
import com.oficina_dev.backend.dtos.Size.SizeRequestPatchDto;
import com.oficina_dev.backend.dtos.Size.SizeResponseDto;
import com.oficina_dev.backend.models.Size.Size;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class SizeMapper {

    public SizeResponseDto toResponse(Size size) {
        if (size == null) {
            return null;
        }

        return new SizeResponseDto(
            size.getId(),
            size.getName()
        );

    }

    public Size toEntity(SizeRequestDto sizeRequestDto) {
        return  new Size(
                sizeRequestDto.getName()
        );
    }

    public SizeRemovedResponseDto toRemovedResponse(Size size) {
        return new SizeRemovedResponseDto(
                "Size removed successfully",
                size.getName(),
                ZonedDateTime.now()
        );
    }

    public void update(Size size, SizeRequestDto sizeRequestDto) {
        size.setName(sizeRequestDto.getName());
    }

    public void patch(Size size, SizeRequestPatchDto sizeRequestDto) {
        if (sizeRequestDto.getName() != null) {
            size.setName(sizeRequestDto.getName());
        }
    }
}