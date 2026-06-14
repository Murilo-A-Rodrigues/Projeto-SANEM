package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Receiver.ReceiverRequestDto;
import com.oficina_dev.backend.dtos.Receiver.ReceiverRequestPatchDto;
import com.oficina_dev.backend.dtos.Receiver.ReceiverResponseDto;
import com.oficina_dev.backend.dtos.Receiver.ReceiverListResponseDto;
import com.oficina_dev.backend.dtos.Receiver.ReceiverRemovedResponseDto;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.Receiver.Receiver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class ReceiverMapper {
    @Autowired
    private PersonMapper personMapper;

    @Autowired
    private ReceiverLimitMapper receiverLimitMapper;

    public Receiver toEntity(ReceiverRequestDto receiverRequestDto, Person person) {
        return new Receiver(
                receiverRequestDto.getNif(),
                receiverRequestDto.getIsFit(),
                person
        );
    }

    public ReceiverResponseDto toResponse(Receiver receiver) {
        return new ReceiverResponseDto(
                receiver.getId(),
                this.personMapper.toResponse(receiver.getPerson()),
                receiver.getNif(),
                receiver.getIsFit(),
                receiver.getAtualReceiverLimit() != null ? this.receiverLimitMapper.toResponse(receiver.getAtualReceiverLimit()) : null
        );
    }

    public ReceiverListResponseDto toListResponse(Receiver receiver) {
        Person person = receiver.getPerson();
        return new ReceiverListResponseDto(
                receiver.getId(),
                person.getName(),
                person.getEmail(),
                person.getPhone(),
                person.getCpf(),
                receiver.getNif(),
                person.getAddress() != null ? person.getAddress().getStreet() : null,
                person.getAddress() != null ? person.getAddress().getNumber() : null,
                person.getAddress() != null ? person.getAddress().getComplement() : null,
                person.getAddress() != null ? person.getAddress().getNeighborhood() : null,
                person.getAddress() != null ? person.getAddress().getReferencePoint() : null,
                receiver.getIsFit()
        );
    }

    public ReceiverRemovedResponseDto toRemovedResponse(Receiver receiver) {
        return new ReceiverRemovedResponseDto(
                receiver.getId(),
                ZonedDateTime.now(),
                receiver.getNif()
        );
    }

    public void update(Receiver receiver, ReceiverRequestDto receiverRequestDto, Person person) {
        receiver.setNif(receiverRequestDto.getNif());
        receiver.setFit(receiverRequestDto.getIsFit());
        receiver.setPerson(person);

    }

    public void patch(Receiver receiver, ReceiverRequestPatchDto receiverRequestPatchDto, Person person) {
        if (receiverRequestPatchDto.getIsFit() != null) {
            receiver.setFit(receiverRequestPatchDto.getIsFit());
        }

        if (receiverRequestPatchDto.getNif() != null) {
            receiver.setNif(receiverRequestPatchDto.getNif());
        }

        if (receiverRequestPatchDto.getPersonId() != null) {
            receiver.setPerson(person);
        }

    }

}
