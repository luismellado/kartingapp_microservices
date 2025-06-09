package com.kartingrm.qopdiscountservice.controllers;

import com.kartingrm.qopdiscountservice.entities.QuantityPeopleDiscountEntity;
import com.kartingrm.qopdiscountservice.services.QuantityPeopleDiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kartingapp/qpdiscount")
public class QuantityPeopleDiscountController {
    @Autowired
    QuantityPeopleDiscountService quantityPeopleDiscountService;

    @GetMapping("/getall")
    public ResponseEntity<List<QuantityPeopleDiscountEntity>> getAllQuantityPeopleDiscount() {
        return ResponseEntity.ok(quantityPeopleDiscountService.getAllQuantityPeopleDiscount());
    }

    @GetMapping("/calculateDiscount/{quantityPeople}/{baseFee}")
    public ResponseEntity<Long> calculateDiscount(@PathVariable Integer quantityPeople, @PathVariable Long baseFee) {
        return ResponseEntity.ok(quantityPeopleDiscountService.calculateQuantityPeopleDiscount(quantityPeople, baseFee));
    }

    @PutMapping("/update")
    public ResponseEntity<QuantityPeopleDiscountEntity> updateQuantityPeopleDiscount(@PathVariable QuantityPeopleDiscountEntity quantityPeopleDiscount) {
        return ResponseEntity.ok(quantityPeopleDiscountService.updateQuantityPeopleDiscount(quantityPeopleDiscount));
    }
}
