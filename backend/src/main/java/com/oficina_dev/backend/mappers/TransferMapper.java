package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Transfer.TransferRequestDto;
import com.oficina_dev.backend.dtos.Transfer.TransferResponseDto;
import com.oficina_dev.backend.dtos.DonationItem.DonationItemResponseDto;
import com.oficina_dev.backend.models.Receiver.Receiver;
import com.oficina_dev.backend.models.Transfer.Transfer;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.services.ReceiverService;
import com.oficina_dev.backend.services.VoluntaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TransferMapper {

    @Autowired
    private VoluntaryService voluntaryService;

    @Autowired
    private ReceiverService receiverService;

    @Autowired
    private TransferItemMapper transferItemMapper;

    public Transfer toEntity(TransferRequestDto transferRequestDto) {
        return new Transfer(
                receiverService.findById(transferRequestDto.getReceiverId()),
                voluntaryService.findById(transferRequestDto.getVoluntaryId())
        );
    }

    public TransferResponseDto toResponse(Transfer transfer) {
        List<DonationItemResponseDto> items = transfer.getTransferItems() != null
                ? transfer.getTransferItems().stream()
                        .map(transferItemMapper::toResponse)
                        .collect(Collectors.toList())
                : Collections.emptyList();

        return new TransferResponseDto(
                transfer.getReceiver().getId(),
                transfer.getVoluntary().getId(),
                transfer.getCreatedAt(),
                items
        );
    }
}
