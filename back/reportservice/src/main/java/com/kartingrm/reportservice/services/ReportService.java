package com.kartingrm.reportservice.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kartingrm.reportservice.models.Booking;
import com.kartingrm.reportservice.models.PaymentDetail;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Service
public class ReportService {
    @Autowired
    RestTemplate restTemplate;
    @Autowired
    ObjectMapper objectMapper;

    public Long getIncomesOfLapOrTimePerMonth(Long lapOrTimeId, Integer year, Integer month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = LocalDate.of(year, month, 1).plusMonths(1).minusDays(1);
        ResponseEntity<List<Booking>> bookingsResponse = restTemplate.exchange("http://bookingservice/kartingapp/booking/getall/lotpndate/" + lapOrTimeId + "/" + startDate + "/" + endDate,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Booking>>() {});
        List<Booking> bookings = bookingsResponse.getBody();
        Long income = (long)0;
        if (bookings != null) {
            for (Booking booking : bookings) {
                Object paymentDetailsResponse = restTemplate.getForObject("http://bookingservice/kartingapp/paymentdetail/getall/bookingId/" + booking.getId(), Object.class);
                List<PaymentDetail> paymentDetails = objectMapper.convertValue(
                        paymentDetailsResponse,
                        new TypeReference<List<PaymentDetail>>() {}
                );
                Long accum = (long)0;
                for (PaymentDetail paymentDetail : paymentDetails) {
                    accum = accum + paymentDetail.getTotalAmount();
                }
                income = income + accum;
            }
        }
        return income;
    }

    public List<Long> getIncomesOfLapOrTimeInRange(Long lapOrTimeId, Integer year, Integer firstMonth, Integer lastMonth) {
        List<Long> incomes = new ArrayList<>();
        for (int i = firstMonth; i <= lastMonth; i++) {
            Long monthIncome = getIncomesOfLapOrTimePerMonth(lapOrTimeId, year, i);
            incomes.add(monthIncome);
        }
        return incomes;
    }

    public ByteArrayInputStream generateLopReport(Integer year, Integer firstMonth, Integer lastMonth) throws IOException {
        LocalDate firstDate = LocalDate.of(LocalDate.now().getYear(), firstMonth, 1);
        String firstMonthName = firstDate.getMonth()
                .getDisplayName(TextStyle.FULL, new Locale("es", "ES"));
        LocalDate lastDate = LocalDate.of(LocalDate.now().getYear(), lastMonth, 1);
        String lastMonthName = lastDate.getMonth()
                .getDisplayName(TextStyle.FULL, new Locale("es", "ES"));
        String[] firstRow = {"Inicio", firstMonthName + " " + year};
        String[] secondRow = {"Fin",lastMonthName + " " + year};

        List<String> columns = new ArrayList<>();
        columns.add("Número de vueltas o tiempo máximo permitido");
        for (int i = firstMonth; i <= lastMonth ; i++) {
            LocalDate date = LocalDate.of(LocalDate.now().getYear(), i, 1);
            String monthName = date.getMonth()
                    .getDisplayName(TextStyle.FULL, new Locale("es", "ES"));
            columns.add(monthName);
        }
        columns.add("TOTAL");

        // Crear el workbook y la hoja
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Reporte 1");

            // ========== ESTILOS ==========
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle totalStyle = workbook.createCellStyle();
            totalStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            totalStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            totalStyle.setAlignment(HorizontalAlignment.CENTER);
            totalStyle.setBorderTop(BorderStyle.THIN);
            totalStyle.setBorderBottom(BorderStyle.THIN);
            totalStyle.setBorderLeft(BorderStyle.THIN);
            totalStyle.setBorderRight(BorderStyle.THIN);

            // Crear encabezados
            Row fistDateInfoRow = sheet.createRow(0);
            for (int i = 0; i < firstRow.length; i++) {
                Cell cell = fistDateInfoRow.createCell(i);
                cell.setCellValue(firstRow[i]);
            }
            Row secondDateInfoRow = sheet.createRow(1);
            for (int i = 0; i < secondRow.length; i++) {
                Cell cell = secondDateInfoRow.createCell(i);
                cell.setCellValue(secondRow[i]);
            }
            Row emptyRow = sheet.createRow(2);
            Row headerRow = sheet.createRow(3);
            for (int i = 0; i < columns.size(); i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns.get(i));
                cell.setCellStyle(headerStyle);
            }

            // Agregar datos
            int quantityOfMonths = lastMonth - firstMonth + 1;
            Long[] totalPerMonth = new Long[quantityOfMonths];
            Arrays.fill(totalPerMonth, 0L);
            Long[] totalPerLop = new Long[3];
            Arrays.fill(totalPerLop, 0L);
            String[] lopCases = {"10 vueltas o máx 10 min", "15 vueltas o máx 15 min", "20 vueltas o máx 20 min"};
            for (int i = 0; i < 3; i++) {
                List<Long> incomesOfLopInRange = getIncomesOfLapOrTimeInRange((long)(i+1), year, firstMonth, lastMonth);
                int j = 0;
                Row row = sheet.createRow(4+i);
                Cell labelCell = row.createCell(0);
                labelCell.setCellValue(lopCases[i]);
                labelCell.setCellStyle(dataStyle);
                for (Long income : incomesOfLopInRange) {
                    totalPerLop[i] += income;
                    totalPerMonth[j] += income;
                    j += 1;
                    Cell cell = row.createCell(j);
                    cell.setCellValue(income.toString());
                    cell.setCellStyle(dataStyle);
                }
                j += 1;
                Cell totalQopCell = row.createCell(j);
                totalQopCell.setCellValue(totalPerLop[i].toString());
                totalQopCell.setCellStyle(totalStyle);
            }
            Row totalsRow = sheet.createRow(7);
            Cell labelCell = totalsRow.createCell(0);
            labelCell.setCellValue("TOTAL");
            labelCell.setCellStyle(totalStyle);
            long totalIncome = 0;
            for (int i = 1; i <= totalPerMonth.length; i++) {
                totalIncome += totalPerMonth[i-1];
                Cell cell = totalsRow.createCell(i);
                cell.setCellValue(totalPerMonth[i - 1].toString());
                cell.setCellStyle(totalStyle);
            }
            Cell totalIncomeCell = totalsRow.createCell(quantityOfMonths + 1);
            totalIncomeCell.setCellValue("" + totalIncome);
            totalIncomeCell.setCellStyle(totalStyle);
            // ========== AUTOAJUSTE DE COLUMNAS ==========
            for (int i = 0; i < columns.size(); i++) {
                sheet.autoSizeColumn(i);
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public Long getIncomesOfQuantityPeoplePerMonth(Integer lowerBound, Integer upperBound, Integer year, Integer month){
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = LocalDate.of(year, month, 1).plusMonths(1).minusDays(1);
        ResponseEntity<List<Booking>> bookingsResponse = restTemplate.exchange("http://bookingservice/kartingapp/booking/getall/qopndate/" + lowerBound + "/" + upperBound + "/" + startDate + "/" + endDate,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Booking>>() {});
        List<Booking> bookings = bookingsResponse.getBody();
        Long income = (long)0;
        if (bookings != null) {
            for (Booking booking : bookings) {
                Object paymentDetailsResponse = restTemplate.getForObject("http://bookingservice/kartingapp/paymentdetail/getall/bookingId/" + booking.getId(), Object.class);
                List<PaymentDetail> paymentDetails = objectMapper.convertValue(
                        paymentDetailsResponse,
                        new TypeReference<List<PaymentDetail>>() {}
                );
                Long accum = (long)0;
                for (PaymentDetail paymentDetail : paymentDetails) {
                    accum = accum + paymentDetail.getTotalAmount();
                }
                income = income + accum;
            }
        }
        return income;
    }

    public List<Long> getIncomesOfQuantityPeopleInRange(Integer lowerBound, Integer upperBound, Integer year, Integer firstMonth, Integer lastMonth) {
        List<Long> incomes = new ArrayList<>();
        for (int i = firstMonth; i <= lastMonth; i++) {
            Long monthIncome = getIncomesOfQuantityPeoplePerMonth(lowerBound, upperBound, year, i);
            incomes.add(monthIncome);
        }
        return incomes;
    }

    public ByteArrayInputStream generateQopReport(Integer year, Integer firstMonth, Integer lastMonth) throws IOException {
        LocalDate firstDate = LocalDate.of(LocalDate.now().getYear(), firstMonth, 1);
        String firstMonthName = firstDate.getMonth()
                .getDisplayName(TextStyle.FULL, new Locale("es", "ES"));
        LocalDate lastDate = LocalDate.of(LocalDate.now().getYear(), lastMonth, 1);
        String lastMonthName = lastDate.getMonth()
                .getDisplayName(TextStyle.FULL, new Locale("es", "ES"));
        String[] firstRow = {"Inicio", firstMonthName + " " + year};
        String[] secondRow = {"Fin", lastMonthName + " " + year};

        List<String> columns = new ArrayList<>();
        columns.add("Número de personas");
        for (int i = firstMonth; i <= lastMonth; i++) {
            LocalDate date = LocalDate.of(LocalDate.now().getYear(), i, 1);
            String monthName = date.getMonth()
                    .getDisplayName(TextStyle.FULL, new Locale("es", "ES"));
            columns.add(monthName);
        }
        columns.add("TOTAL");

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Reporte 2");

            // ========== ESTILOS ==========
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle totalStyle = workbook.createCellStyle();
            totalStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            totalStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            totalStyle.setAlignment(HorizontalAlignment.CENTER);
            totalStyle.setBorderTop(BorderStyle.THIN);
            totalStyle.setBorderBottom(BorderStyle.THIN);
            totalStyle.setBorderLeft(BorderStyle.THIN);
            totalStyle.setBorderRight(BorderStyle.THIN);

            // ========== ENCABEZADOS ==========
            Row firstDateInfoRow = sheet.createRow(0);
            for (int i = 0; i < firstRow.length; i++) {
                Cell cell = firstDateInfoRow.createCell(i);
                cell.setCellValue(firstRow[i]);
            }

            Row secondDateInfoRow = sheet.createRow(1);
            for (int i = 0; i < secondRow.length; i++) {
                Cell cell = secondDateInfoRow.createCell(i);
                cell.setCellValue(secondRow[i]);
            }

            sheet.createRow(2); // Fila vacía

            Row headerRow = sheet.createRow(3);
            for (int i = 0; i < columns.size(); i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns.get(i));
                cell.setCellStyle(headerStyle);
            }

            // ========== DATOS ==========
            int quantityOfMonths = lastMonth - firstMonth + 1;
            Long[] totalPerMonth = new Long[quantityOfMonths];
            Arrays.fill(totalPerMonth, 0L);
            Long[] totalPerQop = new Long[4];
            Arrays.fill(totalPerQop, 0L);

            String[] qopCases = {"1-2 personas", "3-5 personas", "6-10 personas", "11-15 personas"};
            Integer[] lowerBounds = {1, 3, 6, 11};
            Integer[] upperBounds = {2, 5, 10, 15};

            for (int i = 0; i < 4; i++) {
                List<Long> incomesOfQopInRange = getIncomesOfQuantityPeopleInRange(lowerBounds[i], upperBounds[i], year, firstMonth, lastMonth);
                int j = 0;
                Row row = sheet.createRow(4 + i);
                Cell labelCell = row.createCell(0);
                labelCell.setCellValue(qopCases[i]);
                labelCell.setCellStyle(dataStyle);
                for (Long income : incomesOfQopInRange) {
                    totalPerQop[i] += income;
                    totalPerMonth[j] += income;
                    j += 1;
                    Cell cell = row.createCell(j);
                    cell.setCellValue(income.toString());
                    cell.setCellStyle(dataStyle);
                }
                j += 1;
                Cell totalQopCell = row.createCell(j);
                totalQopCell.setCellValue(totalPerQop[i].toString());
                totalQopCell.setCellStyle(totalStyle);
            }

            // ========== TOTALES ==========
            Row totalsRow = sheet.createRow(8);
            Cell labelCell = totalsRow.createCell(0);
            labelCell.setCellValue("TOTAL");
            labelCell.setCellStyle(totalStyle);

            long totalIncome = 0;
            for (int i = 1; i <= totalPerMonth.length; i++) {
                totalIncome += totalPerMonth[i - 1];
                Cell cell = totalsRow.createCell(i);
                cell.setCellValue(totalPerMonth[i - 1].toString());
                cell.setCellStyle(totalStyle);
            }
            Cell totalIncomeCell = totalsRow.createCell(quantityOfMonths + 1);
            totalIncomeCell.setCellValue("" + totalIncome);
            totalIncomeCell.setCellStyle(totalStyle);

            // ========== AUTOAJUSTE DE COLUMNAS ==========
            for (int i = 0; i < columns.size(); i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
