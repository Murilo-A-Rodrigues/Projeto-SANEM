package com.oficina_dev.backend.models.Address;

import com.oficina_dev.backend.models.Person.Person;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_address", schema = "public")
public class Address {

    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "number", nullable = false)
    private Integer number;

    @Column(name = "street", length = 100, nullable = false)
    private String street;

    @Column(name = "neighborhood", length = 100, nullable = false)
    private String neighborhood;

    @Column(name = "complement", length = 100)
    private String complement;

    @Column(name = "reference_point", length = 100)
    private String referencePoint;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @OneToOne(mappedBy = "address")
    private Person person;

    private boolean isValidNumber(Integer number) {
        return number != null && number > 0;
    }

    public Address(Integer number, String street, String neighborhood,
                   String complement, String referencePoint) {
        if (!isValidNumber(number)) {
            throw new IllegalArgumentException("Invalid address number");
        }
        this.setNumber(number);
        this.setStreet(street);
        this.setNeighborhood(neighborhood);
        this.setComplement(complement);
        this.setReferencePoint(referencePoint);
    }

    public void setNumber(Integer number) {
        if (!isValidNumber(number)) {
            throw new IllegalArgumentException("Invalid address number");
        }
        this.number = number;
    }

    public void setStreet(String street) {
        this.street = street.toLowerCase().trim();
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood.toLowerCase().trim();
    }

    public void setComplement(String complement) {
        this.complement = complement != null ? complement.toLowerCase().trim() : null;
    }

    public void setReferencePoint(String referencePoint) {
        this.referencePoint = referencePoint != null ? referencePoint.toLowerCase().trim() : null;
    }

    @Override
    public String toString() {
        return "Address{" +
                "id=" + id +
                ", number=" + number +
                ", street='" + street + '\'' +
                ", neighborhood='" + neighborhood + '\'' +
                ", complement='" + complement + '\'' +
                ", referencePoint='" + referencePoint + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", person=" + person +
                '}';
    }

}
