package fr.applymcp.mcp;

import fr.applymcp.model.Person;
import fr.applymcp.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpArg;
import org.springframework.ai.mcp.annotation.McpPrompt;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileMcpTools {

    private final PersonService personService;

    private final static String getProfileDescription = "Generate full information of a person. These information are useful to apply for jobs. These data does not replace CV or cover letters.";

    @McpTool(name = "get-profile", description = getProfileDescription , generateOutputSchema = true)
    public Person getProfile(@McpToolParam(required = false, description = "Optional profile id") String id) {
        if (id != null && !id.isBlank()) {
            return personService.getPersonById(id);
        }
        return personService.getFirstProfile();
    }

    @McpPrompt(
            name = "write-cover-letter",
            description = "Generate a cover letter"
    )
    public String writeCoverLetter(@McpArg(name = "offer",description = "The offer you want to apply on") String offer){
        return String.format(
            "Ecrit une lettre de motivation professionnelle pour cette offre d'emploi: %s. " +
            "La lettre devra avoir 3 paragraphes et suivra la convention je,vous,nous.",
            offer
        );
    }

}
