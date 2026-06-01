package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRequestDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryResponseDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRemovedResponseDto;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class VoluntaryMapper{

    @Autowired
    private PersonService personService;

    @Autowired
    private PersonMapper personMapper;

    public Voluntary toEntity(VoluntaryRequestDto voluntaryRequestDto) {;
        if (voluntaryRequestDto == null) {
            return null;
        }
        return new Voluntary(
                this.personService.findById(voluntaryRequestDto.getPersonId()),
                voluntaryRequestDto.getPassword(),
                voluntaryRequestDto.getIsActive()
        );
    }

    public VoluntaryResponseDto toResponse(Voluntary voluntary) {
        if (voluntary == null) {
            return null;
        }
        return new VoluntaryResponseDto(
                voluntary.getId(),
                this.personMapper.toResponse(voluntary.getPerson()),
                voluntary.getIsActive()
        );
    }

    public void update(Voluntary voluntary, VoluntaryRequestDto voluntaryRequestDto) {
        if (voluntary == null || voluntaryRequestDto == null) {
            return;
        }

        voluntary.setPassword(voluntaryRequestDto.getPassword());
        voluntary.setActive(voluntaryRequestDto.getIsActive());
    }

    public VoluntaryRemovedResponseDto toRemovedResponse(Voluntary voluntary) {
        if (voluntary == null) {
            return null;
        }

        return new VoluntaryRemovedResponseDto(
                voluntary.getId(),
                ZonedDateTime.now(),
                voluntary.getPerson().getName()
        );
    }

    public void patch(Voluntary voluntary, VoluntaryRequestDto voluntaryRequestDto) {
        if(voluntary == null || voluntaryRequestDto == null) {
            return;
        }
        if (voluntaryRequestDto.getPassword() != null) {
            voluntary.setPassword(voluntaryRequestDto.getPassword());
        }
        if (voluntaryRequestDto.getIsActive() != null) {
            voluntary.setActive(voluntaryRequestDto.getIsActive());
        }

    }
}