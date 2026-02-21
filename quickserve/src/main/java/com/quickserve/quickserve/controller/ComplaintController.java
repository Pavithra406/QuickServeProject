package com.quickserve.quickserve.controller;

import com.quickserve.quickserve.model.Complaint;
import com.quickserve.quickserve.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173") // your frontend port
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    // ✅ Submit Complaint
    @PostMapping
    public Complaint submitComplaint(@RequestBody Complaint complaint) {

        complaint.setSubmittedAt(LocalDateTime.now());

        return complaintRepository.save(complaint);
    }

    // ✅ Get All Complaints
    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }
}