package com.oficina_dev.backend.dtos.Item;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ItemRequestPatchDto {

    @Size(min = 3, max = 100)
    private String name;

    private Character sex;

    private Integer quantity;

    private UUID categoryId;

    private UUID sizeId;

}
