package com.quickserve.quickserve.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String customerEmail;
    private String serviceType;
    private String name;
    private String place;
    private String timing;
    private String description;

    // PENDING, APPROVED, REJECTED, COMPLETED
    private String status;

    // ⭐ Rating fields
    private Integer rating;   // 1 to 5
    private String review;

    // 🔔 Notification flag (NEW)
    private boolean ratingNotified;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ================= CONSTRUCTOR =================

    public Booking() {
        this.status = "PENDING";
        this.rating = null;          // Not rated initially
        this.review = null;
        this.ratingNotified = false; // No notification initially
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // ================= GETTERS =================

    public String getId() {
        return id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public String getServiceType() {
        return serviceType;
    }

    public String getName() {
        return name;
    }

    public String getPlace() {
        return place;
    }

    public String getTiming() {
        return timing;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public Integer getRating() {
        return rating;
    }

    public String getReview() {
        return review;
    }

    public boolean isRatingNotified() {
        return ratingNotified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // ================= SETTERS =================

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
        updateTimestamp();
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
        updateTimestamp();
    }

    public void setName(String name) {
        this.name = name;
        updateTimestamp();
    }

    public void setPlace(String place) {
        this.place = place;
        updateTimestamp();
    }

    public void setTiming(String timing) {
        this.timing = timing;
        updateTimestamp();
    }

    public void setDescription(String description) {
        this.description = description;
        updateTimestamp();
    }

    public void setStatus(String status) {
        this.status = status.toUpperCase();

        // 🔔 If marked as COMPLETED → enable rating notification
        if (this.status.equals("COMPLETED")) {
            this.ratingNotified = true;
        }

        updateTimestamp();
    }

    public void setRating(Integer rating) {
        if (rating != null && (rating < 1 || rating > 5)) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        this.rating = rating;

        // ⭐ Once rated → remove notification
        this.ratingNotified = false;

        updateTimestamp();
    }

    public void setReview(String review) {
        this.review = review;
        updateTimestamp();
    }

    public void setRatingNotified(boolean ratingNotified) {
        this.ratingNotified = ratingNotified;
        updateTimestamp();
    }

    // ================= HELPER METHOD =================

    private void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}