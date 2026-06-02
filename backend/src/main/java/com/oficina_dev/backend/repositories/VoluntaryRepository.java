package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Voluntary.Voluntary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VoluntaryRepository extends JpaRepository<Voluntary, UUID> {

    @Modifying
    @Query("DELETE FROM Voluntary v WHERE v.id = :id")
    void deleteVoluntaryById(@Param("id") UUID id);
}
