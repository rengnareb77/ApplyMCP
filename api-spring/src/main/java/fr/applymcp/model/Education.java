package fr.applymcp.model;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class Education {
    private String institution;
    private String description;
    private String degree;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
}
