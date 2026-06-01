package com.oficina_dev.backend.dtos.Giver;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.UUID;

@Getter
public class GiverRequestDto {

    @NotBlank
    UUID personId;

}