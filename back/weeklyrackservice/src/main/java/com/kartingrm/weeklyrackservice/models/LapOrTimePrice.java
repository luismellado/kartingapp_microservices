package com.kartingrm.weeklyrackservice.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LapOrTimePrice {
    private Long id;
    private Long price;
    private Integer duration;
    private String description;
}
