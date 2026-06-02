package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRequestDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryResponseDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRemovedResponseDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryListResponseDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRequestPatchDto;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.models.Person.Person;
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

    public VoluntaryListResponseDto toListResponse(Voluntary voluntary) {
        if (voluntary == null) {
            return null;
        }
        Person person = voluntary.getPerson();
        return new VoluntaryListResponseDto(
                voluntary.getId(),
                person.getName(),
                person.getEmail(),
                person.getPhone(),
                person.getCpf(),
                person.getAddress() != null ? person.getAddress().getStreet() : null,
                person.getAddress() != null ? person.getAddress().getNumber() : null,
                person.getAddress() != null ? person.getAddress().getComplement() : null,
                person.getAddress() != null ? person.getAddress().getNeighborhood() : null,
                person.getAddress() != null ? person.getAddress().getReferencePoint() : null,
                voluntary.getIsActive()
        );
    }

    public void update(Voluntary voluntary, VoluntaryRequestDto voluntaryRequestDto) {
        if (voluntary == null || voluntaryRequestDto == null) {
            return;
        }

        voluntary.setPassword(voluntaryRequestDto.getPassword());
        voluntary.setActive(voluntaryRequestDto.getIsActive());
        if (voluntaryRequestDto.getPersonId() != null) {
            voluntary.setPerson(this.personService.findById(voluntaryRequestDto.getPersonId()));
        }
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

    public void patch(Voluntary voluntary, VoluntaryRequestPatchDto voluntaryRequestPatchDto) {
        if(voluntary == null || voluntaryRequestPatchDto == null) {
            return;
        }
        if (voluntaryRequestPatchDto.getPassword() != null) {
            voluntary.setPassword(voluntaryRequestPatchDto.getPassword());
        }
        if (voluntaryRequestPatchDto.getPersonId() != null) {
            voluntary.setPerson(this.personService.findById(voluntaryRequestPatchDto.getPersonId()));
        }
    }
}