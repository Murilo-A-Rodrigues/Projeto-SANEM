package com.oficina_dev.backend.dtos.Limit;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LimitRequestPatchDto {
    private int month;
    private int year;
    private Integer limitQuantity;
}
