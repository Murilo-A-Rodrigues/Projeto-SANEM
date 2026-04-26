package com.oficina_dev.backend.dtos.Voluntary;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class VoluntaryRequestPatchDto {
    UUID personId;
    String password;
}
