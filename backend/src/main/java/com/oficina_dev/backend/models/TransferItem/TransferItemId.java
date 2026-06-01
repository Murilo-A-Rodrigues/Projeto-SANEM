package com.oficina_dev.backend.models.TransferItem;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Embeddable
@NoArgsConstructor
public class TransferItemId {

    @Column(name = "id_transfer_donation")
    private UUID transferId;

    @Column(name = "id_item")
    private UUID itemId;

    public TransferItemId(UUID transferId, UUID itemId) {
        this.transferId = transferId;
        this.itemId = itemId;
    }

}
