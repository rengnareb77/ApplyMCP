package fr.applymcp.configuration;

import fr.applymcp.model.Person;
import fr.applymcp.repository.PersonRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PersonRepository personRepository;

    public DataInitializer(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Override
    public void run(String @Nullable... args) throws Exception {
        if (personRepository.count() == 0) {
            Person person = new Person();
            person.setFirstName("John");
            person.setLastName("Doe");
            person.setEmail("john.doe@example.com");
            person.setBirthDate("1990-01-01");
            person.setPhoneNumber("123-456-7890");
            person.setAddress("123 Main St, Anytown, USA");
            person.setLinkedinUrl("https://linkedin.com/in/johndoe");
            person.setGithubUrl("https://github.com/johndoe");
            person.setPortfolioUrl("https://johndoe.com");
            person.setSummary("A passionate developer.");
            person.setHobbies(Collections.singletonList("Coding"));
            person.setLanguages(Collections.singletonList("English"));
            person.setWorkExperiences(Collections.emptyList());
            person.setEducations(Collections.emptyList());
            person.setProjects(Collections.emptyList());

            personRepository.save(person);
            System.out.println("Database initialized with a sample person.");
        }
    }
}
