package com.kartingrm.lotpservice.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lapOrTimePrices")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class LapOrTimePriceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private Long price;
    private Integer duration;
    private String description;
}
