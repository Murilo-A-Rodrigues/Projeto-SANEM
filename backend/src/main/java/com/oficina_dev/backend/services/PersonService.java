package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Person.PersonRemovedResponseDto;
import com.oficina_dev.backend.dtos.Person.PersonRequestDto;
import com.oficina_dev.backend.dtos.Person.PersonRequestPatchDto;
import com.oficina_dev.backend.dtos.Person.PersonResponseDto;
import com.oficina_dev.backend.exceptions.EntityAlreadyExists;
import com.oficina_dev.backend.mappers.PersonMapper;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.repositories.PersonRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PersonService {

    private static final Logger logger = LoggerFactory.getLogger(PersonService.class);
    private final String personNotFoundMessage = "Person not found";

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private PersonMapper personMapper;

    public Person findById(UUID id) {
        logger.debug("Finding person by ID in database: {}", id);
        return personRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Person with ID {} not found", id);
                    return new EntityNotFoundException(personNotFoundMessage);
                });
    }

    public PersonResponseDto getById(UUID id) {
        logger.debug("Service: Fetching person by ID: {}", id);
        Person person = findById(id);
        logger.debug("Person found: {} (ID: {})", person.getName(), person.getId());
        return this.personMapper.toResponse(person);
    }

    public List<PersonResponseDto> getAll() {
        logger.debug("Service: Fetching all people");
        List<Person> people = this.personRepository.findAll();
        logger.debug("Found {} people in database", people.size());
        return people.stream()
                .map(this.personMapper::toResponse)
                .toList();
    }

    public PersonResponseDto create(PersonRequestDto personRequestDto) {
        logger.debug("Service: Creating new person: {}", personRequestDto.getName());
        Person person = this.personMapper.toEntity(personRequestDto);

        try {
            Person savedPerson = this.personRepository.saveAndFlush(person);
            logger.info("Person created successfully: {} (ID: {})", savedPerson.getName(), savedPerson.getId());
            return this.personMapper.toResponse(savedPerson);
        } catch (Exception e) {
            logger.error("Error creating person: {}", e.getMessage(), e);
            throw e;
        }
    }

    public PersonResponseDto update(UUID id, PersonRequestDto personRequestDto) {
        logger.debug("Service: Updating person with ID: {}", id);
        Person person = this.findById(id);
        this.personMapper.update(person, personRequestDto);
        try {
            Person savedPerson = this.personRepository.saveAndFlush(person);
            logger.info("Person updated successfully: {} (ID: {})", savedPerson.getName(), savedPerson.getId());
            return this.personMapper.toResponse(savedPerson);
        } catch (Exception e) {
            logger.error("Error updating person with ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    public PersonResponseDto patch(UUID id, PersonRequestPatchDto personRequestDto) {
        logger.debug("Service: Partially updating person with ID: {}", id);
        Person person = this.findById(id);
        this.personMapper.patch(person, personRequestDto);
        try {
            Person savedPerson = this.personRepository.saveAndFlush(person);
            logger.info("Person partially updated successfully: {} (ID: {})", savedPerson.getName(), savedPerson.getId());
            return this.personMapper.toResponse(savedPerson);
        } catch (Exception e) {
            logger.error("Error partially updating person with ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    public PersonRemovedResponseDto delete(UUID id) {
        logger.debug("Service: Removing person with ID: {}", id);
        try {
            Person person = this.findById(id);
            this.personRepository.deleteById(id);
            logger.info("Person removed successfully: {} (ID: {})", person.getName(), person.getId());
            return this.personMapper.toRemovedResponse(person);
        } catch (EntityNotFoundException e) {
            logger.error("Attempt to remove non-existent person with ID: {}", id);
            throw e;
        } catch (Exception e) {
            logger.error("Error removing person with ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }
}
