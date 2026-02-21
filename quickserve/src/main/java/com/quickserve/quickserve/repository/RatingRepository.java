package com.quickserve.quickserve.repository;

import com.quickserve.quickserve.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RatingRepository extends MongoRepository<Rating, String> {
}