package com.kartingrm.qopdiscountservice.services;

import com.kartingrm.qopdiscountservice.entities.QuantityPeopleDiscountEntity;
import com.kartingrm.qopdiscountservice.repositories.QuantityPeopleDiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuantityPeopleDiscountService {
    @Autowired
    QuantityPeopleDiscountRepository quantityPeopleDiscountRepository;

    public QuantityPeopleDiscountEntity getQuantityPeopleDiscountByQuantity(Integer quantity)  {
        if (quantity > 0 && quantity < 3){
            return quantityPeopleDiscountRepository.findById((long)1).get();
        }
        else if (quantity >= 3 && quantity < 6) {
            return quantityPeopleDiscountRepository.findById((long)2).get();
        }
        else if (quantity >= 6 && quantity < 11){
            return quantityPeopleDiscountRepository.findById((long)3).get();
        }
        else if (quantity >= 11 && quantity < 16) {
            return quantityPeopleDiscountRepository.findById((long)4).get();
        }
        else{
            return quantityPeopleDiscountRepository.findById((long)1).get();
        }
    }

    public List<QuantityPeopleDiscountEntity> getAllQuantityPeopleDiscount() {
        return quantityPeopleDiscountRepository.findAll();
    }

    public Long calculateQuantityPeopleDiscount(Integer quantityPeople, Long baseFee) {
        QuantityPeopleDiscountEntity quantityPeopleDiscount = getQuantityPeopleDiscountByQuantity(quantityPeople);
        //Ojo aqui, ya que los descuentos deben ser 0.0, 0.1, 0.2 y 0.3 para que funcione correctamente
        Long qopDiscount = (long)(baseFee * quantityPeopleDiscount.getDiscount());
        return qopDiscount;
    }

    public QuantityPeopleDiscountEntity updateQuantityPeopleDiscount(QuantityPeopleDiscountEntity quantityPeopleDiscount) {
        return quantityPeopleDiscountRepository.save(quantityPeopleDiscount);
    }
}
