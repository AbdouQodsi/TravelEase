package com.HongKong.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "saved_destinations")
public class SavedDestination {

    @Id
    private String id; 

    private String destinationId; 
    private String name;
    private String description;
    private String image;
    private String category;
    private Double budget;
    private String userId;

    public SavedDestination() {}

    public SavedDestination(String destinationId, String name, String description, String image, String category, Double budget, String userId) {
        this.destinationId = destinationId;
        this.name = name;
        this.description = description;
        this.image = image;
        this.category = category;
        this.budget = budget;
        this.userId = userId;
    }


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDestinationId() { return destinationId; }
    public void setDestinationId(String destinationId) { this.destinationId = destinationId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
