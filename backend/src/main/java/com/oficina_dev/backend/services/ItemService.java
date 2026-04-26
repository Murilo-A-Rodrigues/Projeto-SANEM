package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Item.ItemRemovedResponseDto;
import com.oficina_dev.backend.dtos.Item.ItemRequestDto;
import com.oficina_dev.backend.dtos.Item.ItemRequestPatchDto;
import com.oficina_dev.backend.dtos.Item.ItemResponseDto;
import com.oficina_dev.backend.mappers.ItemMapper;
import com.oficina_dev.backend.models.Item.Item;
import com.oficina_dev.backend.repositories.ItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ItemService {

    private final String itemNotFoundMessage = "Item not found";
    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemMapper itemMapper;

    public Item findById(UUID id) {
        return itemRepository.findById(id).orElseThrow(
                () -> {
                    logger.error("Item with ID {} not found", id);
                    return new EntityNotFoundException(itemNotFoundMessage);
                }
        );
    }

    public List<ItemResponseDto> getAll() {
        logger.debug("Service: Fetching all items");
        List<Item> items = itemRepository.findAll();
        logger.debug("Found {} items in database", items.size());
        return items.stream()
                .map(itemMapper::toResponse)
                .toList();
    }

    public ItemResponseDto getById(UUID id) {
        logger.debug("Service: Fetching item by ID: {}", id);
        Item item = findById(id);
        logger.debug("Item found with ID: {}", item.getId());
        return itemMapper.toResponse(item);
    }

    public ItemResponseDto create(ItemRequestDto itemRequestDto) {
        logger.debug("Service: Creating new item with name: {}", itemRequestDto.getName());
        Item item = itemMapper.toEntity(itemRequestDto);
        Item savedItem = itemRepository.saveAndFlush(item);
        logger.debug("Item created with ID: {}", savedItem.getId());
        return itemMapper.toResponse(savedItem);
    }

    public ItemResponseDto patch(UUID id, ItemRequestPatchDto itemRequestDto) {
        logger.debug("Service: patching item with ID: {}", id);
        Item item = findById(id);
        itemMapper.patch(item, itemRequestDto);
        Item updatedItem = itemRepository.saveAndFlush(item);
        logger.debug("Item updated with ID: {}", updatedItem.getId());
        return itemMapper.toResponse(updatedItem);
    }

    public ItemRemovedResponseDto delete(UUID id) {
        Item item = findById(id);
        ItemRemovedResponseDto itemRemovedResponseDto = itemMapper.toRemovedResponse(item);
        logger.debug("Service: Deleting item with ID: {}", id);
        itemRepository.delete(item);
        logger.debug("Item deleted with ID: {}", id);
        return itemRemovedResponseDto;
    }

    public void save(Item item) {
        this.itemRepository.saveAndFlush(item);
    }
}
