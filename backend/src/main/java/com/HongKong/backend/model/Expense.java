package com.HongKong.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Document(collection = "expenses")
public class Expense {
    @Id
    private String id;
    private String description;
    private Double amount;
    private String category;
    private String date;
    private String userId;

    public Expense() {}

    public Expense(String description, Double amount, String category, String date, String userId) {
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.userId = userId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
