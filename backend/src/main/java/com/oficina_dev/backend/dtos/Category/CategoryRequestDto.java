package com.oficina_dev.backend.dtos.Category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CategoryRequestDto {

    @NotBlank
    @Size(min = 3, max = 100)
    private String name;

}
