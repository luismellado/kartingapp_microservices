package com.kartingrm.spfeeservice.repositories;

import com.kartingrm.spfeeservice.entities.SpecialFeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpecialFeeRepository extends JpaRepository <SpecialFeeEntity, Long> {
}
