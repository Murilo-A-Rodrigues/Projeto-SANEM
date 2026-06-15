package com.oficina_dev.backend.dtos.Person;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class PersonRequestPatchDto {

    @Size(min = 2,max = 100)
    private String name;

    @Size(min = 8,max = 20)
    private String phone;

    @Email
    @Size(min = 4,max = 320)
    private String email;

    @Size(min = 11,max = 14)
    private String cpf;

    private UUID idAddress;
}
