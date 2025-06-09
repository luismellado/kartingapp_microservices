package com.kartingrm.lotpservice.services;

import com.kartingrm.lotpservice.entities.LapOrTimePriceEntity;
import com.kartingrm.lotpservice.repositories.LapOrTimePriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LapOrTimePriceService {
    @Autowired
    LapOrTimePriceRepository lapOrTimePriceRepository;

    public LapOrTimePriceEntity getLapOrTimePriceById(Long lapOrTimeId)  {return lapOrTimePriceRepository.findById(lapOrTimeId).get();}

    public LapOrTimePriceEntity updateLapOrTimePrice(LapOrTimePriceEntity lapOrTimePrice) {return lapOrTimePriceRepository.save(lapOrTimePrice);}

    public List<LapOrTimePriceEntity> getAllLapOrTimePrice(){return lapOrTimePriceRepository.findAll();}
}