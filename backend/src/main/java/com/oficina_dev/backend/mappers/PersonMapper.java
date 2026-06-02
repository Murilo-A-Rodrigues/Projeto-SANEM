package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Person.PersonRemovedResponseDto;
import com.oficina_dev.backend.dtos.Person.PersonRequestDto;
import com.oficina_dev.backend.dtos.Person.PersonRequestPatchDto;
import com.oficina_dev.backend.dtos.Person.PersonResponseDto;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.Address.Address;
import com.oficina_dev.backend.dtos.Address.AddressResponseDto;
import com.oficina_dev.backend.services.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class PersonMapper {

    @Autowired
    private AddressService addressService;
    @Autowired
    private AddressMapper addressMapper;

    public PersonResponseDto toResponse(Person person) {
        if (person == null) {
            return null;
        }
        AddressResponseDto addressDto = addressMapper.toResponse(person.getAddress());
        return new PersonResponseDto(
                person.getId(),
                person.getName(),
                person.getPhone(),
                person.getEmail() != null ? person.getEmail() : null,
                person.getCpf() != null ? person.getCpf() : null,
                addressDto
        );
    }

    public Person toEntity(PersonRequestDto dto) {
        Address address = addressService.findById(dto.getIdAddress());
        return new Person(
                dto.getName(), dto.getPhone(),
                dto.getCpf(), dto.getEmail(), address
        );
    }

    public void update(Person person, PersonRequestDto dto) {
        person.setName(dto.getName());
        person.setPhone(dto.getPhone());
        person.setEmail(dto.getEmail());
        person.setCpf(dto.getCpf());
        Address address = addressService.findById(dto.getIdAddress());
        person.setAddress(address);
    }

    public void patch(Person person, PersonRequestPatchDto dto) {
        if (dto.getName() != null) {
            person.setName(dto.getName());
        }
        if (dto.getPhone() != null) {
            person.setPhone(dto.getPhone());
        }
        if (dto.getEmail() != null) {
            person.setEmail(dto.getEmail());
        }
        if (dto.getCpf() != null) {
            person.setCpf(dto.getCpf());
        }
        if (dto.getIdAddress() != null) {
            Address address = addressService.findById(dto.getIdAddress());
            person.setAddress(address);
        }
    }

    public PersonRemovedResponseDto toRemovedResponse(Person person) {
        return new PersonRemovedResponseDto(
                "Person removed successfully",
                person.getName(),
                ZonedDateTime.now()
        );
    }
}
