FROM node:20-slim AS builder
WORKDIR /app

# Déclarer un argument de build pour l'endpoint GraphQL
ARG VITE_GRAPHQL_ENDPOINT_ARG

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

# Utiliser l'argument de build comme variable d'environnement
RUN VITE_GRAPHQL_ENDPOINT=${VITE_GRAPHQL_ENDPOINT_ARG} npm run build

FROM nginx:alpine
# Copier la configuration nginx pour le routage SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copier les fichiers statiques
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
