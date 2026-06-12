package fr.applymcp.service;

import fr.applymcp.model.Skill;
import fr.applymcp.repository.PersonRepository;
import fr.applymcp.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final PersonRepository personRepository;
    private final SkillRepository skillRepository;

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }
}
