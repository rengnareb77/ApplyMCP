FROM node:20-slim AS frontend_builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ ./

RUN npm run build

FROM maven:3.9-eclipse-temurin-17 AS backend_builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
COPY --from=frontend_builder /app/src/main/resources/static ./src/main/resources/static

RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=backend_builder /app/target/*.jar app.jar

# Exposer le port sur lequel l'application s'exécute
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]