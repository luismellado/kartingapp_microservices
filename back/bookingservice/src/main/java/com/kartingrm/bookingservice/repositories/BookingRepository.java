package com.kartingrm.bookingservice.repositories;

import com.kartingrm.bookingservice.entities.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
    List<BookingEntity> findAllByLopIdAndDateBetween(Long lapOrTimeId, LocalDate start, LocalDate end);
    List<BookingEntity> findAllByQuantityPeopleGreaterThanEqualAndQuantityPeopleLessThanEqualAndDateBetween(Integer lowerBound, Integer upperBound, LocalDate start, LocalDate end);
}
