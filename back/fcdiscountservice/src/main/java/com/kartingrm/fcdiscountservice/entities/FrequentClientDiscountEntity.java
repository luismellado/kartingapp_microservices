package com.kartingrm.fcdiscountservice.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "frequentClientDicounts")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class FrequentClientDiscountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private Float discount;
    private String description;
}

