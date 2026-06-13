package fr.applymcp.service;

import fr.applymcp.mapper.PersonMapper;
import fr.applymcp.model.Education;
import fr.applymcp.model.Person;
import fr.applymcp.model.Project;
import fr.applymcp.model.WorkExperience;
import fr.applymcp.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final PersonRepository personRepository;
    private final PersonMapper personMapper;

    public Person getPersonById(String id) {
        return personRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Person not found with id: " + id));
    }

    public Person getFirstProfile() {
        return personRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No profile found"));
    }

    public Person updatePerson(String personId, Person updatedPerson) {
        Person person = getPersonById(personId);
        personMapper.updatePersonFromInput(updatedPerson, person);
        return personRepository.save(person);
    }

    /**
     * Add education element to a Person's profile
     * @param profileId the person id
     * @param education the education to add
     * @return the new Person
     */
    public Person addEducation(String profileId, Education education) {
        Person person = getPersonById(profileId);
        person.getEducations().add(education);
        return personRepository.save(person);
    }

    /**
     * Add work experience element to a Person's profile
     * @param profileId the person id
     * @param workExperience the work experience to add
     * @return the new Person
     */
    public Person addWorkExperience(String profileId, WorkExperience workExperience){
        Person person = getPersonById(profileId);
        person.getWorkExperiences().add(workExperience);
        return personRepository.save(person);
    }

    /**
     * Add project element to a Person's profile
     * @param profileId the person id
     * @param project the project to add
     * @return the new Person
     */
    public Person addProject(String profileId, Project project){
        Person person = getPersonById(profileId);
        person.getProjects().add(project);
        return personRepository.save(person);
    }

    /**
     * Remove work experience at index
     */
    public Person removeWorkExperience(String profileId, int index) {
        Person person = getPersonById(profileId);
        if (person.getWorkExperiences() != null && index >= 0 && index < person.getWorkExperiences().size()) {
            person.getWorkExperiences().remove(index);
            return personRepository.save(person);
        }
        return person;
    }

    public Person removeEducation(String profileId, int index) {
        Person person = getPersonById(profileId);
        if (person.getEducations() != null && index >= 0 && index < person.getEducations().size()) {
            person.getEducations().remove(index);
            return personRepository.save(person);
        }
        return person;
    }

    public Person removeProject(String profileId, int index) {
        Person person = getPersonById(profileId);
        if (person.getProjects() != null && index >= 0 && index < person.getProjects().size()) {
            person.getProjects().remove(index);
            return personRepository.save(person);
        }
        return person;
    }


}
