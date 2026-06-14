package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Receiver.Receiver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ReceiverRepository extends JpaRepository<Receiver, UUID> {

    boolean existsByNif(String nif);

    boolean existsByNifAndIdNot(String nif, UUID id);

    @Modifying
    @Query("DELETE FROM Receiver r WHERE r.id = :id")
    void deleteReceiverById(@Param("id") UUID id);

}
