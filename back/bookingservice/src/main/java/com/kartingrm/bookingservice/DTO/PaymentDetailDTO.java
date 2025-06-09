package com.kartingrm.bookingservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetailDTO {
    private Long bookingId;
    private String clientName;
    private String clientEmail;
    private Float iva;
    private Float specialDiscount;
    private Long spfee;
}
