package com.quickserve.quickserve.controller;

import com.quickserve.quickserve.model.Booking;
import com.quickserve.quickserve.repository.BookingRepository;
import com.quickserve.quickserve.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

    // ================= CREATE BOOKING =================
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {

        if (booking.getCustomerEmail() == null ||
                booking.getServiceType() == null ||
                booking.getName() == null ||
                booking.getPlace() == null ||
                booking.getTiming() == null) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Missing required booking fields!");
        }

        booking.setCustomerEmail(booking.getCustomerEmail().trim());
        booking.setServiceType(booking.getServiceType().trim());
        booking.setName(booking.getName().trim());
        booking.setPlace(booking.getPlace().trim());
        booking.setTiming(booking.getTiming().trim());
        booking.setStatus("PENDING");

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedBooking);
    }

    // ================= GET ALL BOOKINGS =================
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    // ================= GET BOOKINGS BY SERVICE =================
    @GetMapping("/service/{serviceType}")
    public ResponseEntity<List<Booking>> getBookingsByService(
            @PathVariable String serviceType) {

        List<Booking> bookings =
                bookingRepository.findByServiceTypeIgnoreCase(serviceType.trim());

        return ResponseEntity.ok(bookings);
    }

    // ================= GET BOOKINGS BY CUSTOMER =================
    @GetMapping("/customer/{email}")
    public ResponseEntity<List<Booking>> getCustomerBookings(
            @PathVariable String email) {

        List<Booking> bookings =
                bookingRepository.findByCustomerEmail(email.trim());

        return ResponseEntity.ok(bookings);
    }

    // ================= UPDATE STATUS =================
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable String id,
            @RequestParam String status) {

        Optional<Booking> optionalBooking =
                bookingRepository.findById(id);

        if (optionalBooking.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Booking not found!");
        }

        List<String> allowedStatuses =
                Arrays.asList("APPROVED", "REJECTED", "COMPLETED");

        String formattedStatus = status.toUpperCase().trim();

        if (!allowedStatuses.contains(formattedStatus)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Status must be APPROVED, REJECTED, or COMPLETED");
        }

        Booking booking = optionalBooking.get();

        booking.setStatus(formattedStatus);

        Booking updatedBooking = bookingRepository.save(booking);

        // 🔍 Debug log
        System.out.println("Sending email to: " + updatedBooking.getCustomerEmail());

        // ✅ Send Email Notification
        emailService.sendBookingStatusEmail(
                updatedBooking.getCustomerEmail(),
                updatedBooking.getServiceType(),
                updatedBooking.getStatus()
        );

        return ResponseEntity.ok(updatedBooking);
    }

    // ================= ADD RATING & REVIEW =================
    @PutMapping("/add-review/{id}")
    public ResponseEntity<?> addReview(
            @PathVariable String id,
            @RequestParam Integer rating,
            @RequestParam(required = false) String review) {

        Optional<Booking> optionalBooking =
                bookingRepository.findById(id);

        if (optionalBooking.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Booking not found!");
        }

        Booking booking = optionalBooking.get();

        // Only COMPLETED bookings can be rated
        if (!"COMPLETED".equalsIgnoreCase(booking.getStatus())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Only COMPLETED bookings can be reviewed!");
        }

        // Validate rating
        if (rating == null || rating < 1 || rating > 5) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Rating must be between 1 and 5!");
        }

        // Prevent duplicate rating
        if (booking.getRating() != null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("You have already reviewed this booking!");
        }

        booking.setRating(rating);
        booking.setReview(review == null ? "" : review.trim());

        Booking updatedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(updatedBooking);
    }

}