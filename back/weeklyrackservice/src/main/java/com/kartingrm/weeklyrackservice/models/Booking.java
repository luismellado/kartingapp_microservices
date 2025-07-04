package com.kartingrm.weeklyrackservice.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    private Long id;
    private LocalDate date;
    private LocalTime time;
    private Long lopId;
    private Integer quantityPeople;
    private String bookerName;
}
