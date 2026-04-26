package com.oficina_dev.backend.models.ReceiverLimit;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Embeddable
public class ReceiverLimitId {

    @Column(name = "id_receiver")
    private UUID receiverId;

    @Column(name = "id_limit")
    private UUID limitId;
}
