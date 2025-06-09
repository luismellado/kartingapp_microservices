package com.kartingrm.weeklyrackservice.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RackInfo {
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String bookerName;
    private Integer quantity;
}
