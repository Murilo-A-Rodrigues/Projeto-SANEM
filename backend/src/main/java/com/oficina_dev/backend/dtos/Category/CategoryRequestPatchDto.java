package com.oficina_dev.backend.dtos.Category;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CategoryRequestPatchDto {

    @Size(min = 3, max = 100)
    private String name;

}
