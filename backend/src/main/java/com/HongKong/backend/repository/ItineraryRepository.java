package com.HongKong.backend.repository;


import com.HongKong.backend.model.Itinerary;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ItineraryRepository extends MongoRepository<Itinerary, String> {
    List<Itinerary> findByUserId(String userId);
}
