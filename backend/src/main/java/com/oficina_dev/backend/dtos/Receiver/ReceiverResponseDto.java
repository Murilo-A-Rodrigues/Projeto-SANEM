package com.oficina_dev.backend.dtos.Receiver;


import com.oficina_dev.backend.dtos.Person.PersonResponseDto;
import com.oficina_dev.backend.dtos.ReceiverLimit.ReceiverLimitResponseDto;

import java.util.UUID;

public record ReceiverResponseDto(
        UUID id,
        PersonResponseDto person,
        String nif,
        Boolean isFit,
        ReceiverLimitResponseDto receiverLimit
) { }
