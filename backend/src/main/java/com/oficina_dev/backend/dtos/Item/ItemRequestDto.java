package com.oficina_dev.backend.dtos.Item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ItemRequestDto {

    @NotBlank
    @Size(min = 3, max = 100)
    private String name;

    @NotBlank
    private Character sex;

    @NotBlank
    private Integer quantity;

    @NotBlank
    private UUID categoryId;

    @NotBlank
    private UUID sizeId;

}
