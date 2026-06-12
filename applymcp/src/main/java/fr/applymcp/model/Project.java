package fr.applymcp.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Project {
    private String title;
    private String description;
    private String repositoryUrl;
    private String liveDemoUrl;
}
