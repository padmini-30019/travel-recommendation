package com.travelplanner.controller;

import com.travelplanner.model.SharedTrip;
import com.travelplanner.repository.SharedTripRepository;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/shared-trips")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SharedTripController {

    private final SharedTripRepository sharedTripRepository;

    @PostMapping
    public ResponseEntity<Map<String, String>> createSharedTrip(@RequestBody SharedTrip trip) {
        // Generate unique share code
        String shareCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        trip.setShareCode(shareCode);
        trip.setCreatedAt(LocalDateTime.now());
        // Trips expire after 30 days
        trip.setExpiresAt(LocalDateTime.now().plusDays(30));
        
        sharedTripRepository.save(trip);
        
        Map<String, String> response = new HashMap<>();
        response.put("shareCode", shareCode);
        response.put("shareUrl", "http://localhost:3000/shared-trip/" + shareCode);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{shareCode}")
    public ResponseEntity<SharedTrip> getSharedTrip(@PathVariable String shareCode) {
        return sharedTripRepository.findByShareCode(shareCode)
                .filter(trip -> trip.getExpiresAt() == null || LocalDateTime.now().isBefore(trip.getExpiresAt()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
