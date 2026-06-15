package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Donation.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DonationRepository extends JpaRepository<Donation, UUID> {

    // 🔁 TROQUE "CreatedAt" pelo nome real do campo de data da sua entidade Donation
    List<Donation> findTop3ByOrderByCreatedAtDesc();
}
