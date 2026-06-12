package fr.applymcp.model;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document(collection = "skill")
public class Skill {
    @Id
    private String id;
    private String name;
    private String category;
}
