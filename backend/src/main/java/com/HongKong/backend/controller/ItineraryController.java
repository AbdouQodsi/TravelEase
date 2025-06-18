package com.HongKong.backend.controller;

import com.HongKong.backend.model.Itinerary;
import com.HongKong.backend.model.User;
import com.HongKong.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.HongKong.backend.model.Itinerary;
import com.HongKong.backend.repository.ItineraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itineraries")
@CrossOrigin(origins = "*")
public class ItineraryController {

    @Autowired
    private ItineraryRepository itineraryRepository;

    @PostMapping("/create")
    public Itinerary createItinerary(@RequestBody Itinerary itinerary) {
        return itineraryRepository.save(itinerary);
    }

    @GetMapping("/user/{userId}")
    public List<Itinerary> getUserItineraries(@PathVariable String userId) {
        return itineraryRepository.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItinerary(@PathVariable String id) {
        itineraryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}