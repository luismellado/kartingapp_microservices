package com.kartingrm.reportservice.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetail {
    private Long id;
    private Long bookingId;
    private String clientName;
    private String clientEmail;
    private Long baseFee;
    private Long quantityPeopleDiscount;
    private Long specialDiscount;
    private Long postAplicationAmount;
    private Long ivaValue;
    private Long totalAmount;
    private LocalDate date;
}
