FROM maven:3.9-eclipse-temurin-17 AS backend_builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=backend_builder /app/target/*.jar app.jar

# Exposer le port sur lequel l'application s'exécute
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
