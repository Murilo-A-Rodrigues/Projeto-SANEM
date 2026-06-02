package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.DonationItem.DonationItem;
import com.oficina_dev.backend.models.DonationItem.DonationItemId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationItemRepository extends JpaRepository<DonationItem, DonationItemId> {
}