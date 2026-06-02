package com.oficina_dev.backend.dtos.Report;

import java.util.List;

public record ReportResponseDto(
        String startDate,
        String endDate,
        Integer totalDonations,
        Integer totalTransferDonations,
        List<ReportMoveDto> moves
        )
{ }
