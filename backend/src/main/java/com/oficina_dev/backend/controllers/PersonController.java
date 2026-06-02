package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Person.PersonRemovedResponseDto;
import com.oficina_dev.backend.dtos.Person.PersonRequestDto;
import com.oficina_dev.backend.dtos.Person.PersonRequestPatchDto;
import com.oficina_dev.backend.dtos.Person.PersonResponseDto;
import com.oficina_dev.backend.services.PersonService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/people")
public class PersonController {

    private static final Logger logger = LoggerFactory.getLogger(PersonController.class);

    @Autowired
    private PersonService personService;

    @GetMapping
    public ResponseEntity<List<PersonResponseDto>> getAll() {
        logger.info("Fetching all people");
        List<PersonResponseDto> personList = this.personService.getAll();
        logger.info("Returning {} people", personList.size());
        return ResponseEntity.ok(personList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonResponseDto> getById(@PathVariable UUID id){
        logger.info("Fetching person by ID: {}", id);
        PersonResponseDto personResponseDto = this.personService.getById(id);
        logger.info("Person found: {}", personResponseDto.name());
        return ResponseEntity.ok(personResponseDto);
    }

    @PostMapping
    public ResponseEntity<PersonResponseDto> create(@RequestBody @Valid PersonRequestDto personRequestDto) {
        logger.info("Creating new person: {}", personRequestDto.getName());
        PersonResponseDto personResponseDto = this.personService.create(personRequestDto);
        logger.info("Person created successfully. ID: {}", personResponseDto.id());
        return ResponseEntity.ok(personResponseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonResponseDto> update(@PathVariable UUID id, @RequestBody @Valid PersonRequestDto personRequestDto) {
        logger.info("Updating person with ID: {}", id);
        PersonResponseDto personResponseDto = this.personService.update(id, personRequestDto);
        logger.info("Person updated successfully: {}", personResponseDto.name());
        return ResponseEntity.ok(personResponseDto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PersonResponseDto> patch(@PathVariable UUID id, @RequestBody @Valid PersonRequestPatchDto personRequestDto) {
        logger.info("Partially updating person with ID: {}", id);
        PersonResponseDto personResponseDto = this.personService.patch(id, personRequestDto);
        logger.info("Person partially updated successfully: {}", personResponseDto.name());
        return ResponseEntity.ok(personResponseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PersonRemovedResponseDto> delete(@PathVariable UUID id) {
        logger.info("Removing person with ID: {}", id);
        PersonRemovedResponseDto personRemovedResponseDto = this.personService.delete(id);
        logger.info("Person removed successfully: {}", personRemovedResponseDto.name());
        return ResponseEntity.ok(personRemovedResponseDto);
    }
}
