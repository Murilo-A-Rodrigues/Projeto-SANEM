package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.Address.AddressRemovedResponseDto;
import com.oficina_dev.backend.dtos.Address.AddressRequestDto;
import com.oficina_dev.backend.dtos.Address.AddressRequestPatchDto;
import com.oficina_dev.backend.dtos.Address.AddressResponseDto;
import com.oficina_dev.backend.models.Address.Address;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class AddressMapper {

    public AddressResponseDto toResponse(Address address) {
        if (address == null) {
            return null;
        }

        return new AddressResponseDto(
                address.getId(),
                address.getNumber(),
                address.getStreet(),
                address.getNeighborhood(),
                address.getComplement(),
                address.getReferencePoint()
        );
    }

    public Address toEntity(AddressRequestDto addressRequestDto) {
        return new Address(
                addressRequestDto.getNumber(),
                addressRequestDto.getStreet(),
                addressRequestDto.getNeighborhood(),
                addressRequestDto.getComplement(),
                addressRequestDto.getReferencePoint()
        );
    }

    public AddressRemovedResponseDto toRemovedResponse(Address address) {
        return new AddressRemovedResponseDto(
                "Address removed successfully",
                address.getStreet(),
                address.getNumber(),
                ZonedDateTime.now()
        );
    }

    public void update(Address address, AddressRequestDto addressRequestDto) {
        address.setNumber(addressRequestDto.getNumber());
        address.setStreet(addressRequestDto.getStreet());
        address.setComplement(addressRequestDto.getComplement());
        address.setNeighborhood(addressRequestDto.getNeighborhood());
        address.setReferencePoint(addressRequestDto.getReferencePoint());
    }

    public void patch(Address address, AddressRequestPatchDto addressRequestDto) {
        if (addressRequestDto.getNumber() != null) {
            address.setNumber(addressRequestDto.getNumber());
        }
        if (addressRequestDto.getStreet() != null) {
            address.setStreet(addressRequestDto.getStreet());
        }
        if (addressRequestDto.getComplement() != null) {
            address.setComplement(addressRequestDto.getComplement());
        }
        if (addressRequestDto.getNeighborhood() != null) {
            address.setNeighborhood(addressRequestDto.getNeighborhood());
        }
        if (addressRequestDto.getReferencePoint() != null) {
            address.setReferencePoint(addressRequestDto.getReferencePoint());
        }
    }
}
