package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Transfer.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TransferRepository extends JpaRepository<Transfer, UUID> {
}