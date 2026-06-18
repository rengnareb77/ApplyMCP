package fr.applymcp.model;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;
@Getter
@Setter
@Document(collection = "person")
public class Person {
    @Id
    private String id;
    @NotBlank(message = "First name is mandatory")
    private String firstName;
    @NotBlank(message = "Last name is mandatory")
    private String lastName;
    @Email(message = "Email should be valid")
    private String email;
    private String birthDate;
    private String phoneNumber;
    private String address;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String summary;

    private List<String> hobbies;
    private List<String> languages;

    private List<WorkExperience> workExperiences;
    private List<Education> educations;
    private List<Project> projects;

}
