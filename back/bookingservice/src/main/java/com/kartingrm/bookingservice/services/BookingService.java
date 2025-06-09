package com.kartingrm.bookingservice.services;

import com.kartingrm.bookingservice.entities.BookingEntity;
import com.kartingrm.bookingservice.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    BookingRepository bookingRepository;

    public BookingEntity saveBooking(BookingEntity booking) {
        return bookingRepository.save(booking);
    }

    public BookingEntity getBookingById(Long id) {return bookingRepository.findById(id).get();}

    public List<BookingEntity> getAllBookingsByLapOrTimeIdAndDateBetween(Long lapOrTimeId, LocalDate start, LocalDate end) {return bookingRepository.findAllByLopIdAndDateBetween(lapOrTimeId, start, end);}

    public List<BookingEntity> getAllBookingsByQopInRangeAndDateBetween(Integer lowerBound, Integer upperBound, LocalDate start, LocalDate end) {
        return bookingRepository.findAllByQuantityPeopleGreaterThanEqualAndQuantityPeopleLessThanEqualAndDateBetween(lowerBound, upperBound, start, end);}

    public List<BookingEntity> getAllBookings(){return bookingRepository.findAll();}

}
