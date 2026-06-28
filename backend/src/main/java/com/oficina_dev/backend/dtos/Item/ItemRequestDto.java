package com.oficina_dev.backend.dtos.Item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemRequestDto {

    @NotBlank
    @Size(min = 3, max = 100)
    private String name;

    private Character sex;

    @NotNull
    private Integer quantity;

    private UUID categoryId;

    private UUID sizeId;

}