package com.oficina_dev.backend.dtos.Voluntary;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class VoluntaryRequestDto {

    @NotNull
    private UUID personId;

    @NotBlank
    private String password;

    @NotNull
    @JsonProperty("isActive")
    private Boolean isActive;

}
