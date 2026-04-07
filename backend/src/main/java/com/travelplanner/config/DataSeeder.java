package com.travelplanner.config;

import com.travelplanner.model.Destination;
import com.travelplanner.repository.DestinationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(DestinationRepository repository) {
        return args -> {
            repository.saveAll(List.of(
                Destination.builder()
                        .name("Bali")
                        .country("Indonesia")
                        .description("A tropical paradise known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.")
                        .imageUrl("https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600")
                        .pricePerNight(12500.0)
                        .rating(4.8)
                        .build(),
                Destination.builder()
                        .name("Paris")
                        .country("France")
                        .description("France's capital, is a major European city and a global center for art, fashion, gastronomy and culture.")
                        .imageUrl("https://images.unsplash.com/photo-1502602881469-4147226f9919?auto=format&fit=crop&q=80&w=600")
                        .pricePerNight(22000.0)
                        .rating(4.7)
                        .build(),
                Destination.builder()
                        .name("Kyoto")
                        .country("Japan")
                        .description("Famous for its numerous classical Buddhist temples, gardens, imperial palaces, and wooden houses.")
                        .imageUrl("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600")
                        .pricePerNight(18000.0)
                        .rating(4.9)
                        .build(),
                Destination.builder()
                        .name("Santorini")
                        .country("Greece")
                        .description("Famed for its dramatic views, stunning sunsets from Oia town, and the strange white aubergine.")
                        .imageUrl("https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=600")
                        .pricePerNight(24500.0)
                        .rating(4.9)
                        .build()
            ));
        };
    }
}
