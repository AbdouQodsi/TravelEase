package com.HongKong.backend.controller;

import com.HongKong.backend.model.SavedDestination;
import com.HongKong.backend.service.SavedDestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savedDestinations")
@CrossOrigin(origins = "*")
public class SavedDestinationController {
    @Autowired
    private SavedDestinationService service;

    @PostMapping("/save")
    public SavedDestination saveDestination(@RequestBody SavedDestination destination) {
        return service.save(destination);
    }

    @GetMapping("/user/{userId}")
    public List<SavedDestination> getSavedByUser(@PathVariable String userId) {
        return service.getByUserId(userId);
    }

@DeleteMapping("/{id}")
public void delete(@PathVariable String id) {  
    service.deleteById(id);
}

}
