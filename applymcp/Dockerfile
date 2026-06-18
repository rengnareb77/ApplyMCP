FROM node:20-slim AS frontend_builder
WORKDIR /app/frontend

# Déclarer un argument de build pour l'endpoint GraphQL
ARG VITE_GRAPHQL_ENDPOINT_ARG

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ ./

# Utiliser l'argument de build comme variable d'environnement pendant la construction du frontend.
# Vite remplacera `import.meta.env.VITE_GRAPHQL_ENDPOINT` par la valeur de cette variable.
# Si l'argument n'est pas fourni, la variable sera vide et le code utilisera la valeur par défaut.
RUN VITE_GRAPHQL_ENDPOINT=${VITE_GRAPHQL_ENDPOINT_ARG} npm run build

FROM maven:3.9-eclipse-temurin-17 AS backend_builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
# Correction du chemin : le build du frontend se trouve dans /app/frontend/dist
COPY --from=frontend_builder /app/frontend/dist ./src/main/resources/static

RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=backend_builder /app/target/*.jar app.jar

# Exposer le port sur lequel l'application s'exécute
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
