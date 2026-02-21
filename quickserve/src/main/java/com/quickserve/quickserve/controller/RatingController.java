package com.quickserve.quickserve.controller;

import com.quickserve.quickserve.model.Rating;
import com.quickserve.quickserve.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "http://localhost:5173")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @PostMapping
    public Rating submitRating(@RequestBody Rating rating) {
        rating.setSubmittedAt(LocalDateTime.now());
        return ratingRepository.save(rating);
    }

    @GetMapping
    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }
}