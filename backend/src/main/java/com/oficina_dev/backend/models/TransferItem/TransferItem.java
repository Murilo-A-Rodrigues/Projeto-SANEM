package com.oficina_dev.backend.models.TransferItem;


import com.oficina_dev.backend.models.Item.Item;
import com.oficina_dev.backend.models.Transfer.Transfer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_transfer_donation_items", schema = "public")
public class TransferItem {

    @EmbeddedId
    private TransferItemId id;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @ManyToOne
    @MapsId("itemId")
    @JoinColumn(name = "id_item")
    private Item item;

    @Setter
    @ManyToOne
    @MapsId("transferId")
    @JoinColumn(name = "id_transfer")
    private Transfer transfer;

    public TransferItem(TransferItemId id, Integer quantity, Item item, Transfer transfer) {
        this.setQuantity(quantity);
        this.id = id;
        this.item = item;
        this.transfer = transfer;
    }

    public void setQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive integer.");
        }
        this.quantity = quantity;
    }

}
