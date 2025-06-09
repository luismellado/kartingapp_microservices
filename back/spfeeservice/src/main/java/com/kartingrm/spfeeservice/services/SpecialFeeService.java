package com.kartingrm.spfeeservice.services;

import com.kartingrm.spfeeservice.entities.SpecialFeeEntity;
import com.kartingrm.spfeeservice.repositories.SpecialFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecialFeeService {
    @Autowired
    SpecialFeeRepository specialFeeRepository;

    public List<SpecialFeeEntity> getAllSpecialFees() {return specialFeeRepository.findAll();}

    public SpecialFeeEntity getSpecialFee(Long id) {return specialFeeRepository.findById(id).get();}

    public SpecialFeeEntity addSpecialFee(SpecialFeeEntity specialFee) {return specialFeeRepository.save(specialFee);}

    public Void deleteSpecialFee(Long id) {
        specialFeeRepository.deleteById(id);
        return null;
    }

    public Float getSpecialSurcharge(Long id) {
        return specialFeeRepository.findById(id).get().getSpecialSurcharge();
    }

    public SpecialFeeEntity updateSpecialFee(SpecialFeeEntity specialFee) {
        return specialFeeRepository.save(specialFee);
    }
}
