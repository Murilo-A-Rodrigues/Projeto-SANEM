package com.oficina_dev.backend.dtos.Stats;

public record StatsDto(
        long people,
        long donations,
        long receivers,
        long volunteers,
        long givers,
        long itemsDistinct, // produtos diferentes
        long itemsUnits,    // soma das unidades (quantity)
        java.util.List<RecentActionDto> recentActions
) {}
