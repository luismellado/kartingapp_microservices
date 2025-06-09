package com.kartingrm.spfeeservice.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "specialFees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecialFeeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private Float specialSurcharge;
    private String description;
}
