package com.HongKong.backend.repository;

import com.HongKong.backend.model.SavedDestination;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SavedDestinationRepository extends MongoRepository<SavedDestination, String> {
    List<SavedDestination> findByUserId(String userId);
}