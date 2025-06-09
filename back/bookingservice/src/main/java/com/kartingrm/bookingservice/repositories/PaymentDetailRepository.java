package com.kartingrm.bookingservice.repositories;

import com.kartingrm.bookingservice.entities.PaymentDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PaymentDetailRepository extends JpaRepository<PaymentDetailEntity, Long> {
    List<PaymentDetailEntity> findAllByClientNameAndDateBetween(String clientName, LocalDate startDate, LocalDate endDate);
    List<PaymentDetailEntity> findAllByBookingId(Long bookingId);
}