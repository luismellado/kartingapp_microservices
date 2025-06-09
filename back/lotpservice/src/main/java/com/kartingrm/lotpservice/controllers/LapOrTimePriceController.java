package com.kartingrm.lotpservice.controllers;

import com.kartingrm.lotpservice.entities.LapOrTimePriceEntity;
import com.kartingrm.lotpservice.services.LapOrTimePriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kartingapp/lotp")
public class LapOrTimePriceController {
    @Autowired
    private LapOrTimePriceService lapOrTimePriceService;

    @PutMapping("/update")
    public ResponseEntity<LapOrTimePriceEntity> updateLapOrTimePrice(@RequestBody LapOrTimePriceEntity lapOrTimePrice) {
        return ResponseEntity.ok(lapOrTimePriceService.updateLapOrTimePrice(lapOrTimePrice));
    }

    @GetMapping("/getall")
    public ResponseEntity<List<LapOrTimePriceEntity>> getAllLapOrTimePrice() {
        return ResponseEntity.ok(lapOrTimePriceService.getAllLapOrTimePrice());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<LapOrTimePriceEntity> getLapOrTimePrice(@PathVariable Long id) {
        return ResponseEntity.ok(lapOrTimePriceService.getLapOrTimePriceById(id));
    }
}