package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Donation.DonationResponseDto;
import com.oficina_dev.backend.dtos.Giver.GiverRequestDto;
import com.oficina_dev.backend.dtos.Giver.GiverResponseDto;
import com.oficina_dev.backend.models.Giver.Giver;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

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
        return new GiverResponseDto(giver.getId());
    }

}
