package com.HongKong.backend.controller;

import com.HongKong.backend.model.Expense;
import com.HongKong.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/create")
    public Expense createExpense(@RequestBody Expense expense) {
        return expenseService.save(expense);
    }

    @GetMapping("/user/{userId}")
    public List<Expense> getExpensesByUser(@PathVariable String userId) {
        return expenseService.getByUserId(userId);
    }

    @GetMapping("/user/{userId}/date/{date}")
    public List<Expense> getExpensesByUserAndDate(@PathVariable String userId, @PathVariable String date) {
        return expenseService.getByUserIdAndDate(userId, date);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable String id) {
        expenseService.deleteById(id);
    }
}
