package com.kartingrm.bookingservice.services;

import com.kartingrm.bookingservice.entities.BookingEntity;
import com.kartingrm.bookingservice.entities.PaymentDetailEntity;
import com.kartingrm.bookingservice.models.LapOrTimePrice;
import com.kartingrm.bookingservice.repositories.PaymentDetailRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentDetailService {
    @Autowired
    PaymentDetailRepository paymentDetailRepository;
    @Autowired
    BookingService bookingService;
    @Autowired
    RestTemplate restTemplate;

    public Integer countClientFrequency(String clientName) {
        LocalDate today = LocalDate.now();
        LocalDate todayMinusOneMonth = LocalDate.now().minusMonths(1);
        return paymentDetailRepository.findAllByClientNameAndDateBetween(clientName, today, todayMinusOneMonth).size();
    }

    public List<PaymentDetailEntity> getAllPaymentDetailsByBookingId(Long bookingId) {
        return paymentDetailRepository.findAllByBookingId(bookingId);
    }

    public PaymentDetailEntity savePaymentDetail(Long bookingId, String clientName, String clientEmail, Float iva, Float specialDiscount, Long spfee) {
        PaymentDetailEntity paymentDetail = new PaymentDetailEntity();
        BookingEntity relationedBooking = bookingService.getBookingById(bookingId);
        paymentDetail.setBookingId(bookingId);
        paymentDetail.setClientName(clientName);
        paymentDetail.setClientEmail(clientEmail);
        //Aqui se obtiene la opcion de vueltas o tiempo que escogio el cliente
        LapOrTimePrice lapOrTimePrice = restTemplate.getForObject("http://lotpservice/kartingapp/lotp/get/" + relationedBooking.getLopId(), LapOrTimePrice.class);
        Long baseFee = lapOrTimePrice.getPrice();
        Float feeIncrease = restTemplate.getForObject("http://spfeeservice/kartingapp/spfee/getsurcharge/" + spfee, Float.class);
        baseFee = (long)(baseFee * feeIncrease);
        paymentDetail.setBaseFee(baseFee);
        //Aqui se obtiene la cantidad de descuento aplicado por cantidad de personas
        Long qpdiscount = restTemplate.getForObject("http://qopdiscountservice/kartingapp/qpdiscount/calculateDiscount/" + relationedBooking.getQuantityPeople() + "/" + baseFee, Long.class);
        paymentDetail.setQuantityPeopleDiscount(qpdiscount);
        int clientFrequency = countClientFrequency(clientName);
        Long freqDiscount = restTemplate.getForObject("http://fcdiscountservice/kartingapp/freqclientdisc/calculateDiscount/" + clientFrequency + "/" + baseFee, Long.class);
        Long spdiscount = (long)(baseFee * specialDiscount);
        if (freqDiscount > spdiscount) {
            spdiscount = freqDiscount;
        }
        paymentDetail.setSpecialDiscount(spdiscount);
        Long postApplicationAmount = baseFee - qpdiscount - spdiscount;
        paymentDetail.setPostAplicationAmount(postApplicationAmount);
        Long ivaValue = (long)(postApplicationAmount * iva);
        paymentDetail.setIvaValue(ivaValue);
        Long totalAmount = postApplicationAmount + ivaValue;
        paymentDetail.setTotalAmount(totalAmount);
        paymentDetail.setDate(relationedBooking.getDate());
        return paymentDetailRepository.save(paymentDetail);
    }

    public Workbook createClientWorkbook(PaymentDetailEntity paymentDetail) throws Exception {
        Workbook workbook = new XSSFWorkbook();
        Sheet clientSheet = workbook.createSheet(paymentDetail.getClientName());
        String[] sheetInfo = {"Nombre del cliente:", "Tarifa base:", "Descuento por cantidad:", "Descuento especial (frecuencia o cumpleaños):", "Precio sin IVA:", "Valor del IVA:", "Monto total a pagar:"};

        for (int i = 0; i < sheetInfo.length; i++) {
            Row row = clientSheet.createRow(i);
            Cell infoCell = row.createCell(0);
            infoCell.setCellValue(sheetInfo[i]);
            Cell valueCell = row.createCell(1);
            switch (i){
                case 0:
                    valueCell.setCellValue(paymentDetail.getClientName());
                    break;
                case 1:
                    valueCell.setCellValue(paymentDetail.getBaseFee());
                    break;
                case 2:
                    valueCell.setCellValue(paymentDetail.getQuantityPeopleDiscount());
                    break;
                case 3:
                    valueCell.setCellValue(paymentDetail.getSpecialDiscount());
                    break;
                case 4:
                    valueCell.setCellValue(paymentDetail.getPostAplicationAmount());
                    break;
                case 5:
                    valueCell.setCellValue(paymentDetail.getIvaValue());
                    break;
                case 6:
                    valueCell.setCellValue(paymentDetail.getTotalAmount());
            }
        }
        workbook.close();
        return workbook;
    }

    private static void copyCellValue(Cell origin, Cell destination) {
        switch (origin.getCellType()) {
            case STRING:
                destination.setCellValue(origin.getStringCellValue());
                break;
            case NUMERIC:
                destination.setCellValue(origin.getNumericCellValue());
                break;
            case BOOLEAN:
                destination.setCellValue(origin.getBooleanCellValue());
                break;
            case FORMULA:
                destination.setCellFormula(origin.getCellFormula());
                break;
            case BLANK:
                destination.setBlank();
                break;
            default:
                break;
        }
    }

    private static void copySheet(Sheet origin, Sheet destination) {
        for (Row row : origin) {
            Row newRow = destination.createRow(row.getRowNum());
            for (Cell cell : row) {
                Cell newCell = newRow.createCell(cell.getColumnIndex());
                copyCellValue(cell, newCell);
            }
        }
    }

    public ByteArrayInputStream excelVoucher(Long bookingId) throws Exception {
        List<PaymentDetailEntity> paymentDetails = getAllPaymentDetailsByBookingId(bookingId);
        List<Workbook> workbooks = new ArrayList<>();
        for (PaymentDetailEntity paymentDetail : paymentDetails) {
            workbooks.add(createClientWorkbook(paymentDetail));
        }
        Workbook finalWorkbook = new XSSFWorkbook();
        for (Workbook workbook : workbooks) {
            Sheet clientSheet = workbook.getSheetAt(0);
            Sheet newFinalSheet = finalWorkbook.createSheet(clientSheet.getSheetName());
            copySheet(clientSheet, newFinalSheet);
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        finalWorkbook.write(out);
        return new ByteArrayInputStream(out.toByteArray());
    }
}