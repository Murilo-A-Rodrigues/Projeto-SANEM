package com.oficina_dev.backend.models.ReceiverLimit;


import com.oficina_dev.backend.models.Limit.Limit;
import com.oficina_dev.backend.models.Receiver.Receiver;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_receiver_limit", schema = "public")
public class ReceiverLimit {

    //Composting FK
    @EmbeddedId
    private ReceiverLimitId id;

    @Column(name = "caught_items", nullable = false)
    private Integer caughtItems;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @ManyToOne
    @MapsId("receiverId")
    @JoinColumn(name = "id_receiver")
    private Receiver receiver;

    @ManyToOne
    @MapsId("limitId")
    @JoinColumn(name = "id_limit")
    private Limit limit;

    public ReceiverLimit(Integer caughtItems, Receiver receiver, Limit limit) {
        setCaughtItems(caughtItems);
        this.receiver = receiver;
        this.limit = limit;
    }


    public void setCaughtItems(Integer caughtItems) {
        if(caughtItems == null || caughtItems < 0) {
            throw new IllegalArgumentException("Caught items must be a non-negative integer.");
        }
        this.caughtItems = caughtItems;
    }
}
