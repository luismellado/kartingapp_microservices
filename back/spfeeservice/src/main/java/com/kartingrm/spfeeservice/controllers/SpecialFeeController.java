package com.kartingrm.spfeeservice.controllers;

import com.kartingrm.spfeeservice.entities.SpecialFeeEntity;
import com.kartingrm.spfeeservice.services.SpecialFeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kartingapp/spfee")
public class SpecialFeeController {
    @Autowired
    SpecialFeeService specialFeeService;

    @GetMapping("/getall")
    public ResponseEntity<List<SpecialFeeEntity>> getAllSpecialFees() {
        return ResponseEntity.ok(specialFeeService.getAllSpecialFees());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<SpecialFeeEntity> getSpecialFee(@PathVariable Long id) {
        return ResponseEntity.ok(specialFeeService.getSpecialFee(id));
    }

    @PostMapping("/add")
    public ResponseEntity<SpecialFeeEntity> addSpecialFee(@RequestBody SpecialFeeEntity specialFee) {
        return ResponseEntity.ok(specialFeeService.addSpecialFee(specialFee));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<SpecialFeeEntity> deleteSpecialFee(@PathVariable Long id) {
        specialFeeService.deleteSpecialFee(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update")
    public ResponseEntity<SpecialFeeEntity> updateSpecialFee(@RequestBody SpecialFeeEntity specialFee) {
        return ResponseEntity.ok(specialFeeService.updateSpecialFee(specialFee));
    }

    @GetMapping("/getsurcharge/{id}")
    public ResponseEntity<Float> getSpecialSurcharge(@PathVariable Long id) {
        return ResponseEntity.ok(specialFeeService.getSpecialSurcharge(id));
    }
}
