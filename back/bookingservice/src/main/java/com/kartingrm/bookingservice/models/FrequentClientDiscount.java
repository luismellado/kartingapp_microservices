package com.kartingrm.bookingservice.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FrequentClientDiscount {
    private Float discount;
    private String description;
}
