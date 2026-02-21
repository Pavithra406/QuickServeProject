package com.quickserve.quickserve.repository;

import com.quickserve.quickserve.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    // Case insensitive search (VERY IMPORTANT)
    List<Booking> findByServiceTypeIgnoreCase(String serviceType);

    List<Booking> findByCustomerEmail(String customerEmail);
}
