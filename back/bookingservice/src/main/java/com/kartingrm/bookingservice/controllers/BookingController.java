package com.kartingrm.bookingservice.controllers;

import com.kartingrm.bookingservice.entities.BookingEntity;
import com.kartingrm.bookingservice.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/kartingapp/booking")
public class BookingController {
    @Autowired
    BookingService bookingService;

    @PostMapping("/newbooking")
    public ResponseEntity<BookingEntity> saveBooking(@RequestBody BookingEntity booking) {
        BookingEntity newBooking = bookingService.saveBooking(booking);
        return ResponseEntity.ok(newBooking);
    }

    @GetMapping("/getall")
    public ResponseEntity<List<BookingEntity>> getAllBookings() {
        List<BookingEntity> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/getall/lotpndate/{lapOrTimeId}/{startDate}/{endDate}")
    public ResponseEntity<List<BookingEntity>> getAllBookingsByLotpAndDate(@PathVariable Long lapOrTimeId, @PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
        List<BookingEntity> bookings = bookingService.getAllBookingsByLapOrTimeIdAndDateBetween(lapOrTimeId, startDate, endDate);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/getall/qopndate/{lowerBound}/{upperBound}/{startDate}/{endDate}")
    public ResponseEntity<List<BookingEntity>> getAllBookingsByQopAndDate(@PathVariable Integer lowerBound, @PathVariable Integer upperBound, @PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
        List<BookingEntity> bookings = bookingService.getAllBookingsByQopInRangeAndDateBetween(lowerBound, upperBound, startDate, endDate);
        return ResponseEntity.ok(bookings);
    }
}
