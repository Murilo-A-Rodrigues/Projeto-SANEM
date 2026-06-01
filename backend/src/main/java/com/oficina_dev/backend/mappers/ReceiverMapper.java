package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Receiver.ReceiverRequestDto;
import com.oficina_dev.backend.dtos.Receiver.ReceiverRequestPatchDto;
import com.oficina_dev.backend.dtos.Receiver.ReceiverResponseDto;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.Receiver.Receiver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
                this.receiverLimitMapper.toResponse(receiver.getAtualReceiverLimit())
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