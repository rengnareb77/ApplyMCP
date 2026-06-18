package fr.applymcp.configuration;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class SpaRoutingConfiguration implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(@NonNull String resourcePath, @NonNull Resource location) throws IOException {
                        // Vérifie si une ressource statique correspondante existe (ex: /assets/main.js)
                        Resource requestedResource = location.createRelative(resourcePath);
                        // Si la ressource existe, ou si le chemin est une route d'API (/graphql), on laisse Spring la gérer.
                        // Sinon, on retourne index.html pour que le routeur React prenne le relais.
                        if (requestedResource.exists() && requestedResource.isReadable() || resourcePath.startsWith("/graphql")) {
                            return requestedResource;
                        }

                        return new ClassPathResource("/static/index.html");
                    }
                });
    }
}