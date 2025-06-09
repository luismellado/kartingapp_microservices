package com.kartingrm.bookingservice.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LapOrTimePrice {
    private Long price;
    private Integer duration;
    private String description;
}
