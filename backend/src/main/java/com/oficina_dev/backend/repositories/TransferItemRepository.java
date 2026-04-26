package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.TransferItem.TransferItem;
import com.oficina_dev.backend.models.TransferItem.TransferItemId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransferItemRepository extends JpaRepository<TransferItem, TransferItemId> {
}