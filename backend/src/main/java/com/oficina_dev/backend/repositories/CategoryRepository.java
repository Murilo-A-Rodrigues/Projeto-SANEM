package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    public Category findByName(String name);

    public boolean existsByName(String name);
}