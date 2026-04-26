package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Transfer.TransferRequestDto;
import com.oficina_dev.backend.dtos.Transfer.TransferResponseDto;
import com.oficina_dev.backend.mappers.TransferMapper;
import com.oficina_dev.backend.mappers.TransferItemMapper;
import com.oficina_dev.backend.models.Item.Item;
import com.oficina_dev.backend.models.Receiver.Receiver;
import com.oficina_dev.backend.models.Transfer.Transfer;
import com.oficina_dev.backend.models.TransferItem.TransferItem;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.TransferRepository;
import com.oficina_dev.backend.repositories.TransferItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TransferService {
    private final String transferNotFoundMessage = "Transfer not found";
    private static final Logger logger = LoggerFactory.getLogger(TransferService.class);

    @Autowired
    private TransferRepository transferRepository;

    @Autowired
    private TransferItemRepository transferItemRepository;

    @Autowired
    private ReceiverService receiverService;

    @Autowired
    private VoluntaryService voluntaryService;

    @Autowired
    private ItemService itemService;

    @Autowired
    private TransferMapper transferMapper;

    @Autowired
    private TransferItemMapper transferItemMapper;

    public Transfer findById(UUID id) {
        return transferRepository.findById(id).orElseThrow(
                () -> {
                    logger.error(transferNotFoundMessage + " with id: {}", id);
                    return new EntityNotFoundException(transferNotFoundMessage);
                }
        );
    }

    public List<Transfer> getAll() {
        return transferRepository.findAll();
    }

    public List<TransferResponseDto> getAllDtos() {
        logger.debug("Getting all transfers");
        return transferRepository.findAll().stream()
                .map(transferMapper::toResponse)
                .toList();
    }

    public Transfer save(Transfer transfer) {
        return transferRepository.save(transfer);
    }

    public TransferResponseDto getById(UUID id) {
        logger.debug("Getting transfer by ID: {}", id);
        Transfer transfer = findById(id);
        return transferMapper.toResponse(transfer);
    }

    @Transactional
    public TransferResponseDto create(TransferRequestDto transferRequestDto) {
        logger.info("Creating transfer with {} items, receiver ID: {}, voluntary ID: {}",
                    transferRequestDto.getTransferDonationItems().size(),
                    transferRequestDto.getReceiverId(),
                    transferRequestDto.getVoluntaryId());

        try {
            // Buscar entidades relacionadas
            Receiver receiver = receiverService.findById(transferRequestDto.getReceiverId());
            Voluntary voluntary = voluntaryService.findById(transferRequestDto.getVoluntaryId());

            // Criar entidade Transfer
            Transfer transfer = new Transfer(receiver, voluntary);

            // Salvar a transferência primeiro para obter ID
            Transfer savedTransfer = transferRepository.save(transfer);

            // Processar itens da transferência
            if (transferRequestDto.getTransferDonationItems() != null &&
                !transferRequestDto.getTransferDonationItems().isEmpty()) {

                transferRequestDto.getTransferDonationItems().forEach(itemDto -> {
                    Item item = itemService.findById(itemDto.getItemId());

                    // Verificar se há quantidade suficiente disponível
                    if (item.getQuantity() < itemDto.getQuantity()) {
                        throw new IllegalArgumentException(
                                "Insufficient quantity for item " + item.getName() +
                                ". Available: " + item.getQuantity() +
                                ", Requested: " + itemDto.getQuantity());
                    }

                    // Diminuir a quantidade do item no estoque
                    item.decrementQuantity(itemDto.getQuantity());
                    itemService.save(item);

                    // Criar e salvar o item de transferência
////                    TransferItem transferItem = transferItemMapper.toEntity(itemDto);
//                    transferItem.setTransfer(savedTransfer);
//                    TransferItem savedItem = transferItemRepository.save(transferItem);
//
//                    savedTransfer.addTransferDonationItem(savedItem);
                });
            }

            logger.info("Transfer created successfully with ID: {}", savedTransfer.getId());
            return transferMapper.toResponse(savedTransfer);
        }catch (Exception e) {
            logger.error("Error creating transfer: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public void deleteById(UUID id) {
        logger.debug("Deleting transfer with ID: {}", id);
        if (!transferRepository.existsById(id)) {
            throw new EntityNotFoundException(transferNotFoundMessage);
        }

        Transfer transfer = findById(id);

        if (transfer.getTransferItems() != null && !transfer.getTransferItems().isEmpty()) {
            transfer.getTransferItems().forEach(transferItem -> {
                Item item = transferItem.getItem();
                item.incrementQuantity(transferItem.getQuantity());
                itemService.save(item);
            });
        }

        transferRepository.deleteById(id);
        logger.info("Transfer with ID {} deleted successfully", id);
    }
}
