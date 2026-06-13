package fr.applymcp.mcp;

import fr.applymcp.model.Person;
import fr.applymcp.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileMcpTools {

    private final ProfileService profileService;

    private final static String description = "Generate full information of a person. These information are useful to apply for jobs. These data does not replace CV or cover letters.";

    @McpTool(name = "get-profile", description = description , generateOutputSchema = true)
    public Person getProfile(@McpToolParam(required = false, description = "Optional profile id") String id) {
        if (id != null && !id.isBlank()) {
            return profileService.getPersonById(id);
        }
        return profileService.getFirstProfile();
    }
}
