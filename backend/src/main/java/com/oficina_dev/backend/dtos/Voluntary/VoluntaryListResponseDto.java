package com.oficina_dev.backend.dtos.Voluntary;

import java.util.UUID;

public record VoluntaryListResponseDto(
        UUID id,
        String nomeCompleto,
        String email,
        String telefoneCelular,
        String cpf,
        String endereco,
        Integer numero,
        String complemento,
        String bairro,
        String pontoReferencia,
        Boolean ativo
) { }
