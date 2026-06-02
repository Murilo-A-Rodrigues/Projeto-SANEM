package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Person.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID> {

    Optional<Person> findByAddressId(UUID addressId);

}
