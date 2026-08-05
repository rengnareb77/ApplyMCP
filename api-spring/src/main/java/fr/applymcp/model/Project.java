package fr.applymcp.model;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Project {
    private String title;
    private String description;
    private String repositoryUrl;
    private String liveDemoUrl;
    private String year;
    private List<Skill> skills = new ArrayList<>();
}
