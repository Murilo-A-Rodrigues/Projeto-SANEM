package com.oficina_dev.backend.dtos.Receiver;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReceiverRequestDto {

    @NotNull
    private UUID personId;

    @NotNull
    @JsonProperty("isFit")
    private Boolean isFit;

    private String nif;
}
