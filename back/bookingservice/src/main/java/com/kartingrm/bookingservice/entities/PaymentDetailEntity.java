package com.kartingrm.bookingservice.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "paymentDetails")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class PaymentDetailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private Long bookingId;
    private String clientName;
    private String clientEmail;
    private Long baseFee;
    private Long quantityPeopleDiscount;
    private Long specialDiscount; //Considera descuento por cliente frecuente O por cumpleaños
    private Long postAplicationAmount;
    private Long ivaValue;
    private Long totalAmount;
    private LocalDate date;
}