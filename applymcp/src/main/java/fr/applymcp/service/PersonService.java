package fr.applymcp.service;

import fr.applymcp.mapper.PersonMapper;
import fr.applymcp.model.Education;
import fr.applymcp.model.Person;
import fr.applymcp.model.Project;
import fr.applymcp.model.WorkExperience;
import fr.applymcp.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class PersonService {

    private final PersonRepository personRepository;
    private final PersonMapper personMapper;

    /**
     * Retrieves a Person object by its unique identifier.
     *
     * @param id the unique identifier of the person to retrieve
     * @return the Person object associated with the given ID
     * @throws RuntimeException if no person is found with the specified ID
     */
    public Person getPersonById(String id) {
        return personRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Person not found with id: " + id));
    }

    /**
     * Retrieves the first available profile from the repository.
     *
     * @return the first Person object found in the repository
     * @throws RuntimeException if no profiles are found
     */
    public Person getFirstProfile() {
        return personRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No profile found"));
    }

    /**
     * Updates the information of an existing person based on the provided updated person details.
     *
     * @param personId the unique identifier of the person to be updated
     * @param updatedPerson the updated person object containing the new details
     * @return the updated Person object after saving the changes to the repository
     */
    public Person updatePerson(String personId, Person updatedPerson) {
        Person person = getPersonById(personId);
        personMapper.updatePersonFromInput(updatedPerson, person);
        return personRepository.save(person);
    }

    /**
     * Add a education element to a Person's profile
     * @param profileId the person id
     * @param education the education to add
     * @return the new Person
     */
    public Person addEducation(String profileId, Education education) {
        Person person = getPersonById(profileId);
        if (person.getEducations() == null) {
            person.setEducations(new ArrayList<>());
        }
        person.getEducations().add(education);
        return personRepository.save(person);
    }

    /**
     * Add a work experience element to a Person's profile
     * @param profileId the person id
     * @param workExperience the work experience to add
     * @return the new Person
     */
    public Person addWorkExperience(String profileId, WorkExperience workExperience){
        Person person = getPersonById(profileId);
        if (person.getWorkExperiences() == null) {
            person.setWorkExperiences(new ArrayList<>());
        }
        person.getWorkExperiences().add(workExperience);
        return personRepository.save(person);
    }

    /**
     * Add a project element to a Person's profile
     * @param profileId the person id
     * @param project the project to add
     * @return the new Person
     */
    public Person addProject(String profileId, Project project){
        Person person = getPersonById(profileId);
        if (person.getProjects() == null) {
            person.setProjects(new ArrayList<>());
        }
        person.getProjects().add(project);
        return personRepository.save(person);
    }

    /**
     * Updates a work experience entry in a Person's profile at the specified index.
     *
     * @param profileId the unique identifier of the person's profile
     * @param index the index of the work experience to update
     * @param workExperience the updated work experience details to set at the specified index
     * @return the updated Person object after saving the changes, or the original Person object if no update was performed
     */
    public Person updateWorkExperience(String profileId, int index, WorkExperience workExperience) {
        Person person = getPersonById(profileId);
        if (person.getWorkExperiences() != null && index >= 0 && index < person.getWorkExperiences().size()) {
            person.getWorkExperiences().set(index, workExperience);
            return personRepository.save(person);
        }
        return person;
    }

    /**
     * Updates an education entry in a Person's profile at the specified index.
     *
     * @param profileId the unique identifier of the person's profile
     * @param index the index of the education to update
     * @param education the updated education details to set at the specified index
     * @return the updated Person object after saving the changes, or the original Person object if no update was performed
     */
    public Person updateEducation(String profileId, int index, Education education) {
        Person person = getPersonById(profileId);
        if (person.getEducations() != null && index >= 0 && index < person.getEducations().size()) {
            person.getEducations().set(index, education);
            return personRepository.save(person);
        }
        return person;
    }

    /**
     * Updates a project in the specified person's profile at the given index
     * and saves the updated person entity to the repository.
     *
     * @param profileId the unique identifier of the person's profile
     * @param index the position of the project in the person's project list to be updated
     * @param project the updated project to replace the existing project at the specified index
     * @return the updated Person object after saving to the repository, or the original Person object if the index is invalid
     */
    public Person updateProject(String profileId, int index, Project project) {
        Person person = getPersonById(profileId);
        if (person.getProjects() != null && index >= 0 && index < person.getProjects().size()) {
            person.getProjects().set(index, project);
            return personRepository.save(person);
        }
        return person;
    }

    /**
     * Removes a work experience element from a Person's profile based on the specified index.
     * @param profileId the ID of the person's profile
     * @param index the index of the work experience to remove
     * @return the updated Person object after the specified work experience has been removed
     */
    public Person removeWorkExperience(String profileId, int index) {
        Person person = getPersonById(profileId);
        if (person.getWorkExperiences() != null && index >= 0 && index < person.getWorkExperiences().size()) {
            person.getWorkExperiences().remove(index);
            return personRepository.save(person);
        }
        return person;
    }

    /**
     * Removes an education element from a Person's profile based on the specified index.
     *
     * @param profileId the ID of the person's profile
     * @param index the index of the education to remove
     * @return the updated Person object after the specified education has been removed
     */
    public Person removeEducation(String profileId, int index) {
        Person person = getPersonById(profileId);
        if (person.getEducations() != null && index >= 0 && index < person.getEducations().size()) {
            person.getEducations().remove(index);
            return personRepository.save(person);
        }
        return person;
    }

    /**
     * Removes a project element from a Person's profile based on the specified index.
     *
     * @param profileId the ID of the person's profile
     * @param index the index of the project to remove
     * @return the updated Person object after the specified project has been removed
     */
    public Person removeProject(String profileId, int index) {
        Person person = getPersonById(profileId);
        if (person.getProjects() != null && index >= 0 && index < person.getProjects().size()) {
            person.getProjects().remove(index);
            return personRepository.save(person);
        }
        return person;
    }




}
