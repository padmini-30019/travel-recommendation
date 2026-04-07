package com.travelplanner.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SharedTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String shareCode;

    private String destination;
    private String startDate;
    private String endDate;
    private Integer days;
    private Integer travelers;
    private String interests;
    private Double budget;
    private Double spent;
    
    @Column(columnDefinition = "LONG VARCHAR")
    private String itineraryData;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}
