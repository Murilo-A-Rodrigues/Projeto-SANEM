package com.oficina_dev.backend.dtos.Voluntary;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class VoluntaryRequestDto {

    @NotBlank
    UUID personId;

    @NotBlank
    String password;

    @NotBlank
    Boolean isActive;

}
