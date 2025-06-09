package com.kartingrm.fcdiscountservice.controllers;

import com.kartingrm.fcdiscountservice.entities.FrequentClientDiscountEntity;
import com.kartingrm.fcdiscountservice.services.FrequentClientDiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kartingapp/freqclientdisc")
public class FrequentClientDiscountController {
    @Autowired
    FrequentClientDiscountService frequentClientDiscountService;

    @GetMapping("/getall")
    public ResponseEntity<List<FrequentClientDiscountEntity>> getAllFrequentClientDiscount() {
        return ResponseEntity.ok(frequentClientDiscountService.getAllFrequentClientDiscounts());
    }

    @GetMapping("/calculateDiscount/{frequency}/{baseFee}")
    public ResponseEntity<Long> calculateDiscount(@PathVariable Integer frequency, @PathVariable Long baseFee) {
        return ResponseEntity.ok(frequentClientDiscountService.calculateFrequentClientDiscount(frequency, baseFee));
    }

    @PutMapping("/update")
    public ResponseEntity<FrequentClientDiscountEntity> updateFrequentClientDiscount(@RequestBody FrequentClientDiscountEntity frequentClientDiscountEntity) {
        return ResponseEntity.ok(frequentClientDiscountService.updateFrequentClientDiscount(frequentClientDiscountEntity));
    }
}
