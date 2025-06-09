package com.kartingrm.reportservice.controllers;

import com.kartingrm.reportservice.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/kartingapp/reports")
public class ReportController {

    @Autowired
    ReportService reportService;

    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("MMMM");

    @GetMapping("/lopReport/{year}/{firstMonth}/{lastMonth}")
    public ResponseEntity<byte[]> downloadLopReport(
            @PathVariable int year,
            @PathVariable int firstMonth,
            @PathVariable int lastMonth) {

        try {
            ByteArrayInputStream in = reportService.generateLopReport(year, firstMonth, lastMonth);
            byte[] bytes = in.readAllBytes();

            // Generar nombre de archivo descriptivo
            String startMonthName = YearMonth.of(year, firstMonth).format(MONTH_FORMATTER);
            String endMonthName = YearMonth.of(year, lastMonth).format(MONTH_FORMATTER);
            String fileName = String.format("Reporte_Vueltas_%s_a_%s_%d.xlsx", startMonthName, endMonthName, year);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(bytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/qopReport/{year}/{firstMonth}/{lastMonth}")
    public ResponseEntity<byte[]> downloadQopReport(
            @PathVariable int year,
            @PathVariable int firstMonth,
            @PathVariable int lastMonth) {

        try {
            ByteArrayInputStream in = reportService.generateQopReport(year, firstMonth, lastMonth);
            byte[] bytes = in.readAllBytes();

            // Generar nombre de archivo descriptivo
            String startMonthName = YearMonth.of(year, firstMonth).format(MONTH_FORMATTER);
            String endMonthName = YearMonth.of(year, lastMonth).format(MONTH_FORMATTER);
            String fileName = String.format("Reporte_Personas_%s_a_%s_%d.xlsx", startMonthName, endMonthName, year);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(bytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/concect")
    public ResponseEntity<String> prueba(){
        return ResponseEntity.ok("Concect");
    }

    @GetMapping("/test/getlotpincomes/{lapOrTimeId}/{year}/{month}")
    public ResponseEntity<Long> getLotpIncomes(@PathVariable Long lapOrTimeId, @PathVariable Integer year, @PathVariable Integer month) {
        return ResponseEntity.ok(reportService.getIncomesOfLapOrTimePerMonth(lapOrTimeId, year, month));
    }
}
