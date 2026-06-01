// src/main/java/com/oficina_dev/backend/repositories/ItemRepository.java
package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Item.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {
    boolean existsByNameAndSex(String name, char sex);

    @Query("select coalesce(sum(i.quantity), 0) from Item i")
    Long sumQuantities();
}
