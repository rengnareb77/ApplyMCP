package fr.applymcp.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class WorkExperience {
    @NotBlank(message = "Company name is required")
    private String company;
    private String role;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private String contractType;
    private String description;
    private String achievement;
    
}
