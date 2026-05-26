package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Donation.DonationRegistrationDto;
import com.oficina_dev.backend.dtos.Donation.DonationRequestDto;
import com.oficina_dev.backend.dtos.Donation.DonationResponseDto;
import com.oficina_dev.backend.mappers.DonationMapper;
import com.oficina_dev.backend.mappers.DonationItemMapper;
import com.oficina_dev.backend.models.Donation.Donation;
import com.oficina_dev.backend.models.DonationItem.DonationItem;
import com.oficina_dev.backend.models.Giver.Giver;
import com.oficina_dev.backend.models.Item.Item;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.DonationRepository;
import com.oficina_dev.backend.repositories.DonationItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DonationService {

    private static final Logger logger = LoggerFactory.getLogger(DonationService.class);

    @Autowired
    private DonationMapper donationMapper;

    @Autowired
    private DonationItemMapper donationItemMapper;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private DonationItemRepository donationItemRepository;

    @Autowired
    private ItemService itemService;

    @Autowired
    private GiverService giverService;

    @Autowired
    private VoluntaryService voluntaryService;

    public Donation findById(UUID id) {
        return this.donationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Donation not found"));
    }

    public List<DonationResponseDto> getAll() {
        return this.donationRepository.findAll().stream().map(donationMapper::toResponse).toList();
    }

    public DonationResponseDto getById(UUID id) {
        Donation donation = this.findById(id);
        return this.donationMapper.toResponse(donation);
    }

    @Transactional
    public DonationResponseDto create(DonationRequestDto dto) {
        logger.info("Creating donation with {} items, giver ID: {}, voluntary ID: {}",
                    dto.getDonationItems().size(),
                    dto.getGiverId(),
                    dto.getVoluntaryId());

        try {
            Giver giver = giverService.findById(dto.getGiverId());
            Voluntary voluntary = voluntaryService.findById(dto.getVoluntaryId());
            Donation donation = donationRepository.saveAndFlush(new Donation(giver, voluntary));

            if (dto.getDonationItems() != null && !dto.getDonationItems().isEmpty()) {
                dto.getDonationItems().forEach(donationItemDto -> {
                    DonationItem donationItem = donationItemMapper
                            .toEntity(donationItemDto, donation, itemService.findById(donationItemDto.getItemId()));
                    donationItem.getItem().incrementQuantity(donationItem.getQuantity());
                    itemService.save(donationItem.getItem());
                    donation.addDonationItem(donationItemRepository.saveAndFlush(donationItem));
                });
            }
            logger.info("Donation created successfully with ID: {}", donation.getId());
            return donationMapper.toResponse(donation);
        } catch (EntityNotFoundException e) {
            logger.error("Error creating donation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error creating donation: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Registra uma doação recebida no sistema, adicionando as peças do estoque.
     * 
     * Esta função realiza o seguinte fluxo:
     * 1. Valida os dados da doação (giver, voluntary, itens)
     * 2. Cria um novo registro de doação no banco de dados
     * 3. Para cada item da doação, incrementa a quantidade no estoque
     * 4. Retorna a doação registrada com todos os seus itens
     * 
     * @param donationRegistrationDto DTO contendo:
     *        - giverId: ID do doador
     *        - voluntaryId: ID do voluntário que registra a doação
     *        - donationItems: Lista de itens com ID do item e quantidade
     * @return DonationResponseDto com os dados da doação registrada
     * @throws EntityNotFoundException se giver, voluntary ou item não existirem
     * @throws IllegalArgumentException se a quantidade for inválida
     */
    @Transactional
    public DonationResponseDto registerDonation(DonationRegistrationDto donationRegistrationDto) {
        logger.info("Starting donation registration process with {} items",
                   donationRegistrationDto.getDonationItems().size());

        // Validar que os dados obrigatórios foram fornecidos
        if (donationRegistrationDto.getGiverId() == null) {
            throw new IllegalArgumentException("Giver ID cannot be null");
        }
        if (donationRegistrationDto.getVoluntaryId() == null) {
            throw new IllegalArgumentException("Voluntary ID cannot be null");
        }
        if (donationRegistrationDto.getDonationItems() == null || 
            donationRegistrationDto.getDonationItems().isEmpty()) {
            throw new IllegalArgumentException("Donation must contain at least one item");
        }

        try {
            // Buscar o doador no banco de dados
            logger.debug("Fetching giver with ID: {}", donationRegistrationDto.getGiverId());
            Giver giver = giverService.findById(donationRegistrationDto.getGiverId());
            
            // Buscar o voluntário no banco de dados
            logger.debug("Fetching voluntary with ID: {}", donationRegistrationDto.getVoluntaryId());
            Voluntary voluntary = voluntaryService.findById(donationRegistrationDto.getVoluntaryId());

            // Criar nova doação no banco de dados
            logger.debug("Creating new donation entity");
            Donation donation = new Donation(giver, voluntary);
            Donation savedDonation = donationRepository.saveAndFlush(donation);
            logger.info("Donation entity created with ID: {}", savedDonation.getId());

            // Processar cada item da doação
            donationRegistrationDto.getDonationItems().forEach(itemDto -> {
                logger.debug("Processing donation item - Item ID: {}, Quantity: {}", 
                           itemDto.getItemId(), itemDto.getQuantity());

                // Buscar o item no banco de dados
                Item item = itemService.findById(itemDto.getItemId());
                logger.debug("Item found: {} (Current stock: {})", item.getName(), item.getQuantity());

                // Validar a quantidade
                if (itemDto.getQuantity() == null || itemDto.getQuantity() <= 0) {
                    throw new IllegalArgumentException(
                            "Quantity for item " + item.getName() + " must be greater than zero"
                    );
                }

                // Criar item de doação
                DonationItem donationItem = donationItemMapper.toEntity(itemDto, savedDonation, item);
                logger.debug("DonationItem created with quantity: {}", donationItem.getQuantity());

                // Incrementar a quantidade no estoque
                logger.debug("Incrementing item stock by: {}", itemDto.getQuantity());
                item.incrementQuantity(itemDto.getQuantity());
                logger.debug("Item stock updated: {} (New stock: {})", item.getName(), item.getQuantity());

                // Salvar item atualizado no banco de dados
                itemService.save(item);

                // Adicionar o item de doação à doação e salvar
                savedDonation.addDonationItem(donationItemRepository.saveAndFlush(donationItem));
                logger.info("Item registered in donation - Item: {}, Quantity: {}", 
                          item.getName(), itemDto.getQuantity());
            });

            logger.info("Donation registration completed successfully - Donation ID: {}, Total items: {}", 
                       savedDonation.getId(), savedDonation.getDonationItems().size());
            
            return donationMapper.toResponse(savedDonation);

        } catch (EntityNotFoundException e) {
            logger.error("Required entity not found during donation registration: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            logger.error("Invalid data during donation registration: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during donation registration: {}", e.getMessage(), e);
            throw new RuntimeException("Error registering donation: " + e.getMessage(), e);
        }
    }

}

