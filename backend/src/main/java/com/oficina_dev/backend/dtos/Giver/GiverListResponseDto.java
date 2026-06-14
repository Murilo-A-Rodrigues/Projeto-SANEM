package com.oficina_dev.backend.dtos.Giver;

import java.util.UUID;

public record GiverListResponseDto(
        UUID id,
        String nomeCompleto,
        String email,
        String telefoneCelular,
        String cpf,
        String endereco,
        Integer numero,
        String complemento,
        String bairro,
        String pontoReferencia
) { }
