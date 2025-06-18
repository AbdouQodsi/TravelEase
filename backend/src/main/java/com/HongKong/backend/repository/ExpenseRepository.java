package com.HongKong.backend.repository;

import com.HongKong.backend.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ExpenseRepository extends MongoRepository<Expense, String> {
    List<Expense> findByUserId(String userId);
    List<Expense> findByUserIdAndDate(String userId, String date);
}
