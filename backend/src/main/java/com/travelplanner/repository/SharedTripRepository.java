package com.travelplanner.repository;

import com.travelplanner.model.SharedTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SharedTripRepository extends JpaRepository<SharedTrip, Long> {
    Optional<SharedTrip> findByShareCode(String shareCode);
}
