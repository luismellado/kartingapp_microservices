package com.kartingrm.weeklyrackservice.services;

import com.kartingrm.weeklyrackservice.models.Booking;
import com.kartingrm.weeklyrackservice.models.LapOrTimePrice;
import com.kartingrm.weeklyrackservice.models.RackInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RackService {
    @Autowired
    RestTemplate restTemplate;

    public List<RackInfo> buildRackInfo(){
        List<RackInfo> rackInfoList = new ArrayList<>();
        ResponseEntity<List<Booking>> bookingsResponse = restTemplate.exchange("http://bookingservice/kartingapp/booking/getall",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Booking>>() {});
        List<Booking> bookings = bookingsResponse.getBody();
        ResponseEntity<List<LapOrTimePrice>> lapOrTimePricesResponse = restTemplate.exchange("http://lotpservice/kartingapp/lotp/getall",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<LapOrTimePrice>>() {});
        List<LapOrTimePrice> lapOrTimePrices = lapOrTimePricesResponse.getBody();
        for (Booking booking : bookings){
            RackInfo rackInfo = new RackInfo();
            rackInfo.setDate(booking.getDate());
            rackInfo.setStartTime(booking.getTime());
            Long addMinutes = (long)lapOrTimePrices.get((int)(booking.getLopId() - 1)).getDuration();
            rackInfo.setEndTime(booking.getTime().plusMinutes(addMinutes));
            rackInfo.setBookerName(booking.getBookerName());
            rackInfo.setQuantity(booking.getQuantityPeople());
            rackInfoList.add(rackInfo);
        }
        return rackInfoList;
    }
}
