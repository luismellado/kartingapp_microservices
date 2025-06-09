package com.kartingrm.bookingservice.controllers;

import com.kartingrm.bookingservice.DTO.PaymentDetailDTO;
import com.kartingrm.bookingservice.entities.PaymentDetailEntity;
import com.kartingrm.bookingservice.services.PaymentDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/kartingapp/paymentdetail")
public class PaymentDetailController {
    @Autowired
    PaymentDetailService paymentDetailService;

    @PostMapping("/newpaymentdetail")
    public ResponseEntity<PaymentDetailEntity> savePaymentDetail(@RequestBody PaymentDetailDTO paymentDetailInfo) {
        PaymentDetailEntity newPaymentDetail = paymentDetailService.savePaymentDetail(
                paymentDetailInfo.getBookingId(),
                paymentDetailInfo.getClientName(),
                paymentDetailInfo.getClientEmail(),
                paymentDetailInfo.getIva(),
                paymentDetailInfo.getSpecialDiscount(),
                paymentDetailInfo.getSpfee());
        return ResponseEntity.ok(newPaymentDetail);

    }

    @GetMapping("/excelVoucher/{bookingId}")
    public ResponseEntity<byte[]> downloadVoucher(@PathVariable Long bookingId) {
        try {
            ByteArrayInputStream in = paymentDetailService.excelVoucher(bookingId);
            byte[] bytes = in.readAllBytes();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=voucher" + bookingId + ".xlsx")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(bytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/getall/bookingId/{bookingId}")
    public ResponseEntity<List<PaymentDetailEntity>> getAllPaymentDetailsByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentDetailService.getAllPaymentDetailsByBookingId(bookingId));
    }
}

