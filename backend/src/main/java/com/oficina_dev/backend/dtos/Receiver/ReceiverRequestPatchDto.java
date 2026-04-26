package com.oficina_dev.backend.dtos.Receiver;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ReceiverRequestPatchDto {
    UUID personId;
    Boolean isFit;
    String nif;
}
