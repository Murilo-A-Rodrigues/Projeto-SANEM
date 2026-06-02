package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Giver.GiverRequestDto;
import com.oficina_dev.backend.dtos.Giver.GiverResponseDto;
import com.oficina_dev.backend.dtos.Giver.GiverListResponseDto;
import com.oficina_dev.backend.dtos.Giver.GiverRemovedResponseDto;
import com.oficina_dev.backend.dtos.Giver.GiverRequestPatchDto;
import com.oficina_dev.backend.models.Giver.Giver;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class GiverMapper {

    @Autowired
    private PersonService personService;

    @Autowired
    private PersonMapper personMapper;

    public Giver toEntity(GiverRequestDto giverRequestDto) {
        return new Giver(this.personService.findById(giverRequestDto.getPersonId()));
    }

    public GiverResponseDto toResponse(Giver giver){
        return new GiverResponseDto(giver.getId(), this.personMapper.toResponse(giver.getPerson()));
    }

    public GiverListResponseDto toListResponse(Giver giver) {
        Person person = giver.getPerson();
        return new GiverListResponseDto(
                giver.getId(),
                person.getName(),
                person.getEmail(),
                person.getPhone(),
                person.getCpf(),
                person.getAddress() != null ? person.getAddress().getStreet() : null,
                person.getAddress() != null ? person.getAddress().getNumber() : null,
                person.getAddress() != null ? person.getAddress().getComplement() : null,
                person.getAddress() != null ? person.getAddress().getNeighborhood() : null,
                person.getAddress() != null ? person.getAddress().getReferencePoint() : null
        );
    }

    public GiverRemovedResponseDto toRemovedResponse(Giver giver) {
        return new GiverRemovedResponseDto(
                giver.getId(),
                ZonedDateTime.now()
        );
    }

    public void update(Giver giver, GiverRequestDto giverRequestDto) {
        giver.setPerson(this.personService.findById(giverRequestDto.getPersonId()));
    }

    public void patch(Giver giver, GiverRequestPatchDto giverRequestPatchDto) {
        if (giverRequestPatchDto.getPersonId() != null) {
            giver.setPerson(this.personService.findById(giverRequestPatchDto.getPersonId()));
        }
    }
}