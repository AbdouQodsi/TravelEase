package com.HongKong.backend.service;

import com.HongKong.backend.model.Expense;
import com.HongKong.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense save(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getByUserId(String userId) {
        return expenseRepository.findByUserId(userId);
    }

    public List<Expense> getByUserIdAndDate(String userId, String date) {
        return expenseRepository.findByUserIdAndDate(userId, date);
    }

    public void deleteById(String id) {
        expenseRepository.deleteById(id);
    }
}
