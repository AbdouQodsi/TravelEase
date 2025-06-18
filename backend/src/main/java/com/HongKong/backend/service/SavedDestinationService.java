package com.HongKong.backend.service;

import com.HongKong.backend.model.SavedDestination;
import com.HongKong.backend.repository.SavedDestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedDestinationService {
    @Autowired
    private SavedDestinationRepository repository;

    public SavedDestination save(SavedDestination destination) {
        return repository.save(destination);
    }

    public List<SavedDestination> getByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }
}
