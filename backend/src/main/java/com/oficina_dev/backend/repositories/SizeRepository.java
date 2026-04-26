package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Size.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SizeRepository extends JpaRepository<Size, UUID> {

    public Size findByName(String name);

    public boolean existsByName(String name);

}