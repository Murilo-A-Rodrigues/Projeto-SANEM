package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Giver.Giver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GiverRepository extends JpaRepository<Giver, UUID> {
    boolean existsByPersonId(UUID personId);

    @Modifying
    @Query("DELETE FROM Giver g WHERE g.id = :id")
    void deleteGiverById(@Param("id") UUID id);
}
