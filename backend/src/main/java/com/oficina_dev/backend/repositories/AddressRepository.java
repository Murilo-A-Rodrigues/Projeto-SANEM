package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Address.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {
    
    public boolean existsByStreetAndNumberAndNeighborhood(String street, int number, String neighborhood);

}