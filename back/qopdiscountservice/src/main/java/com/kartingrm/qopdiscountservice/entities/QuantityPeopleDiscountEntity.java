package com.kartingrm.qopdiscountservice.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "quantityPeopleDicounts")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class QuantityPeopleDiscountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private Float discount;
    private String description;
}
