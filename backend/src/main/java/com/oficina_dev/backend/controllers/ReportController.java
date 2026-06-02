package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Report.ReportResponseDto;
import com.oficina_dev.backend.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping
    public ResponseEntity<ReportResponseDto> getReport(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate
    ) {
        ReportResponseDto reportResponse = this.reportService.get(startDate,endDate);
        return ResponseEntity.ok(reportResponse);
    }


}
