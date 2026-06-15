package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Limit.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LimitRepository extends JpaRepository<Limit, UUID> {

    public boolean existsByMonthAndYear(int month, int year);

    public Optional<Limit> findByYearAndMonth(Integer year, Integer month);

}
