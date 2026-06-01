package com.oficina_dev.backend.dtos.Address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AddressRequestDto {

    @NotBlank
    @Size(min = 1, max = 100)
    private String neighborhood;

    @NotBlank
    @Size(min = 1, max = 100)
    private String street;

    @NotBlank
    private Integer number;

    @NotBlank
    @Size(min = 1, max = 100)
    private String complement;

    @NotBlank
    @Size(min = 1, max = 100)
    private String referencePoint;

}
