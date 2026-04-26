package com.oficina_dev.backend.models.DonationItem;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class DonationItemId {

    @Column(name = "id_donation")
    private UUID donationId;

    @Column(name = "id_item")
    private UUID itemId;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        DonationItemId that = (DonationItemId) o;
        return Objects.equals(donationId, that.donationId) && Objects.equals(itemId, that.itemId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(donationId, itemId);
    }
}
