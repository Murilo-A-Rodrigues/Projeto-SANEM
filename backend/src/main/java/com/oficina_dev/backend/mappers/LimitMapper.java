package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Limit.LimitRequestDto;
import com.oficina_dev.backend.dtos.Limit.LimitRequestPatchDto;
import com.oficina_dev.backend.dtos.Limit.LimitResponseDto;
import com.oficina_dev.backend.models.Limit.Limit;
import org.springframework.stereotype.Component;

@Component
public class LimitMapper {

    public Limit toEntity(LimitRequestDto limitRequestDto) {
        Limit limit = new Limit();
        limit.setMonth(limitRequestDto.getMonth());
        limit.setYear(limitRequestDto.getYear());
        limit.setLimitQuantity(limitRequestDto.getLimitQuantity());
        return limit;
    }

    public LimitResponseDto toResponse(Limit limit) {
        return new LimitResponseDto(
                limit.getId(),
                limit.getMonth(),
                limit.getYear(),
                limit.getLimitQuantity()
        );
    }

}
