package fr.applymcp.controller;

import fr.applymcp.model.Person;
import fr.applymcp.model.Skill;
import fr.applymcp.model.WorkExperience;
import fr.applymcp.model.Education;
import fr.applymcp.model.Project;
import fr.applymcp.service.ProfileService;
import fr.applymcp.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ProfileGraphQLController {

    private final ProfileService profileService;
    private final SkillService skillService;

    // --- QUERIES ---

    @QueryMapping // Doit matcher exactement le nom dans le schéma .graphqls
    public Person getPerson(@Argument String id) {
        return profileService.getPersonById(id);
    }

    @QueryMapping
    public List<Skill> allSkills() {

        return new ArrayList<Skill>(10);
    }

    // --- MUTATIONS ---


    @MutationMapping
    public Person updatePerson(@Argument String id, @Argument @Valid Person input) {
        return profileService.updatePerson(id, input);
    }

    @MutationMapping
    public Person addWorkExperience(@Argument String profileId, @Argument @Valid WorkExperience input) {
        // Spring va mapper automatiquement l'objet JSON "input" vers ton objet Java WorkExperience
        return profileService.addWorkExperience(profileId, input);
    }

    @MutationMapping
    public Person addEducation(@Argument String profileId, @Argument @Valid Education input) {
        return profileService.addEducation(profileId, input);
    }

    @MutationMapping
    public Person addProject(@Argument String profileId, @Argument @Valid Project input) {
        return profileService.addProject(profileId, input);
    }

    @MutationMapping
    public Person removeWorkExperience(@Argument String profileId, @Argument int index) {
        return profileService.removeWorkExperience(profileId, index);
    }

    @MutationMapping
    public Person removeEducation(@Argument String profileId, @Argument int index) {
        return profileService.removeEducation(profileId, index);
    }

    @MutationMapping
    public Person removeProject(@Argument String profileId, @Argument int index) {
        return profileService.removeProject(profileId, index);
    }
}