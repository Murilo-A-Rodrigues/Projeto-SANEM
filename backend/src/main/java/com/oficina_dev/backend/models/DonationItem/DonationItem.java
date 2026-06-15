package com.oficina_dev.backend.models.DonationItem;


import com.oficina_dev.backend.models.Donation.Donation;
import com.oficina_dev.backend.models.Item.Item;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "tb_donation_items", schema = "public")
public class DonationItem {

    //Composting FK
    @EmbeddedId
    private DonationItemId id;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Setter
    @ManyToOne
    @MapsId("itemId")
    @JoinColumn(name = "id_item")
    private Item item;

    @Setter
    @ManyToOne
    @MapsId("donationId")
    @JoinColumn(name = "id_donation")
    private Donation donation;

    public DonationItem(DonationItemId id, Integer quantity, Donation donation, Item item) {
        this.setQuantity(quantity);
        this.donation = donation;
        this.item = item;
    }

    public void setQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        this.quantity = quantity;
    }

}
