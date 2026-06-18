package fr.applymcp.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
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
    private List<Skill> skills = new ArrayList<>();
}
