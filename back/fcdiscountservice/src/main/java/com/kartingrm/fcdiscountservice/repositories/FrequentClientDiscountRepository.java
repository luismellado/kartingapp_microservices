package com.kartingrm.fcdiscountservice.repositories;

import com.kartingrm.fcdiscountservice.entities.FrequentClientDiscountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FrequentClientDiscountRepository extends JpaRepository <FrequentClientDiscountEntity, Long> {
}
