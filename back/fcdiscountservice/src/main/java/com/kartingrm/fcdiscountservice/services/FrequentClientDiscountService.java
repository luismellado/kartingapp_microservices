package com.kartingrm.fcdiscountservice.services;

import com.kartingrm.fcdiscountservice.entities.FrequentClientDiscountEntity;
import com.kartingrm.fcdiscountservice.repositories.FrequentClientDiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FrequentClientDiscountService {
    @Autowired
    FrequentClientDiscountRepository frequentClientDiscountRepository;

    public FrequentClientDiscountEntity getFrequentClientDiscountByFrequency(Integer frequency) {
        if (frequency >= 7){
            return frequentClientDiscountRepository.findById((long)1).get();
        }
        else if (frequency >= 5) {
            return frequentClientDiscountRepository.findById((long)2).get();
        }
        else if (frequency >= 2){
            return frequentClientDiscountRepository.findById((long)3).get();
        }
        else if (frequency >= 1) {
            return frequentClientDiscountRepository.findById((long)4).get();
        }
        else{
            return frequentClientDiscountRepository.findById((long)4).get();
        }
    }

    public List<FrequentClientDiscountEntity> getAllFrequentClientDiscounts() {
        return frequentClientDiscountRepository.findAll();}

    public Long calculateFrequentClientDiscount(Integer frequency, Long baseFee) {
        FrequentClientDiscountEntity frequentClientDiscount = getFrequentClientDiscountByFrequency(frequency);
        Long fcDiscount = (long)(baseFee * frequentClientDiscount.getDiscount());
        return fcDiscount;
    }

    public FrequentClientDiscountEntity updateFrequentClientDiscount(FrequentClientDiscountEntity frequentClientDiscountEntity) {
        return frequentClientDiscountRepository.save(frequentClientDiscountEntity);
    }
}
