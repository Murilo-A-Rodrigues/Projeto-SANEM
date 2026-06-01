package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Transfer.TransferRequestDto;
import com.oficina_dev.backend.dtos.Transfer.TransferResponseDto;
import com.oficina_dev.backend.models.Receiver.Receiver;
import com.oficina_dev.backend.models.Transfer.Transfer;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.services.GiverService;
import com.oficina_dev.backend.services.ReceiverService;
import com.oficina_dev.backend.services.VoluntaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TransferMapper {

    @Autowired
    private VoluntaryService voluntaryService;

    @Autowired
    private ReceiverService receiverService;

    public Transfer toEntity(TransferRequestDto transferRequestDto) {
        return new Transfer(
                receiverService.findById(transferRequestDto.getReceiverId()),
                voluntaryService.findById(transferRequestDto.getVoluntaryId())
                );
    }

    public TransferResponseDto toResponse(Transfer transfer){
//        return new TransferResponseDto(
//                transfer.getReceiver().getId(),
//                transfer.getVoluntary().getId(),
//                transfer.getCreatedAt(),
//                transfer.getTransferItems().stream()
//                        .map(item -> item.toResponseDto())
//                        .toList()
//        );
        return null;
    }

}