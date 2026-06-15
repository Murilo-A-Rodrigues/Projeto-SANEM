package com.oficina_dev.backend.dtos.Receiver;

import java.util.UUID;

public record ReceiverListResponseDto(
        UUID id,
        String nomeCompleto,
        String email,
        String telefoneCelular,
        String cpfCrnm,
        String nif,
        String endereco,
        Integer numero,
        String complemento,
        String bairro,
        String pontoReferencia,
        Boolean isFit
) { }
