package fr.applymcp.controller;

import fr.applymcp.model.Person;
import fr.applymcp.model.WorkExperience;
import fr.applymcp.model.Education;
import fr.applymcp.model.Project;
import fr.applymcp.service.PersonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
@RequiredArgsConstructor
public class ProfileGraphQLController {

    private final PersonService personService;

    @SchemaMapping(typeName = "Person", field = "skills")
    public List<String> getSkills(Person person) {
        Set<String> uniqueSkills = new HashSet<>();

        if (person.getWorkExperiences() != null) {
            person.getWorkExperiences().forEach(exp -> {
                if (exp.getSkills() != null) {
                    exp.getSkills().forEach(skill -> {
                        if (skill != null && skill.getName() != null) {
                            uniqueSkills.add(skill.getName());
                        }
                    });
                }
            });
        }

        if (person.getProjects() != null) {
            person.getProjects().forEach(proj -> {
                if (proj.getSkills() != null) {
                    proj.getSkills().forEach(skill -> {
                        if (skill != null && skill.getName() != null) {
                            uniqueSkills.add(skill.getName());
                        }
                    });
                }
            });
        }
        return new ArrayList<>(uniqueSkills);
    }

    // --- QUERIES ---

    @QueryMapping // Doit matcher exactement le nom dans le schéma .graphqls
    public Person getPerson(@Argument String id) {
        return personService.getPersonById(id);
    }

    @QueryMapping
    public Person getFirstProfile() {
        return personService.getFirstProfile();
    }
    // --- MUTATIONS ---


    @MutationMapping
    public Person updatePerson(@Argument String id, @Argument @Valid Person input) {
        return personService.updatePerson(id, input);
    }

    @MutationMapping
    public Person addWorkExperience(@Argument String profileId, @Argument @Valid WorkExperience input) {
        // Spring va mapper automatiquement l'objet JSON "input" vers ton objet Java WorkExperience
        return personService.addWorkExperience(profileId, input);
    }

    @MutationMapping
    public Person updateWorkExperience(@Argument String profileId, @Argument int index, @Argument @Valid WorkExperience input) {
        return personService.updateWorkExperience(profileId, index, input);
    }

    @MutationMapping
    public Person addEducation(@Argument String profileId, @Argument @Valid Education input) {
        return personService.addEducation(profileId, input);
    }

    @MutationMapping
    public Person updateEducation(@Argument String profileId, @Argument int index, @Argument @Valid Education input) {
        return personService.updateEducation(profileId, index, input);
    }

    @MutationMapping
    public Person addProject(@Argument String profileId, @Argument @Valid Project input) {
        return personService.addProject(profileId, input);
    }

    @MutationMapping
    public Person updateProject(@Argument String profileId, @Argument int index, @Argument @Valid Project input) {
        return personService.updateProject(profileId, index, input);
    }

    @MutationMapping
    public Person removeWorkExperience(@Argument String profileId, @Argument int index) {
        return personService.removeWorkExperience(profileId, index);
    }

    @MutationMapping
    public Person removeEducation(@Argument String profileId, @Argument int index) {
        return personService.removeEducation(profileId, index);
    }

    @MutationMapping
    public Person removeProject(@Argument String profileId, @Argument int index) {
        return personService.removeProject(profileId, index);
    }
}