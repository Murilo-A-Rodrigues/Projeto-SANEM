package com.oficina_dev.backend.dtos.Giver;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.UUID;

@Getter
public class GiverRequestDto {

    @NotNull
    UUID personId;

}
