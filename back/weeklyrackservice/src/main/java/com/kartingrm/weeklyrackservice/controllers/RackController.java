package com.kartingrm.weeklyrackservice.controllers;

import com.kartingrm.weeklyrackservice.models.RackInfo;
import com.kartingrm.weeklyrackservice.services.RackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/kartingapp/rackinfo")
public class RackController {
    @Autowired
    RackService rackService;

    @GetMapping("/getallinfo")
    public ResponseEntity<List<RackInfo>> getAllRackInfo(){
        return ResponseEntity.ok(rackService.buildRackInfo());
    }
}
