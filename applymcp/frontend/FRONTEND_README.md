# Frontend - Gestion de Profil

Ce frontend permet de gérer un profil professionnel complet avec expériences, diplômes et projets.

## Prérequis

- Node.js 16+
- npm ou yarn
- L'API GraphQL doit être en cours d'exécution sur `http://localhost:8080/graphql`

## Installation

```bash
npm install
```

## Démarrage du développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## Fonctionnalités

### Dashboard
- Vue d'ensemble du profil
- Affichage des informations principales
- Liens rapides vers les sections de gestion

### Modification du Profil
- Modification du résumé professionnel
- Affichage des informations de contact (lecture seule)
- Affichage des liens vers LinkedIn, GitHub et Portfolio

### Gestion des Expériences
- Ajouter une nouvelle expérience professionnelle
- Afficher la liste des expériences
- Supprimer une expérience

### Gestion des Diplômes
- Ajouter un nouveau diplôme ou certification
- Afficher la liste des diplômes
- Supprimer un diplôme

### Gestion des Projets
- Ajouter un nouveau projet
- Afficher la liste des projets
- Supprimer un projet
- Liens vers repository et démo en ligne

## Construction pour la production

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Technologies utilisées

- **React 19** - Framework UI
- **TypeScript** - Langage typé
- **Tailwind CSS** - Framework CSS
- **Apollo Client** - Client GraphQL
- **React Router** - Routage
- **Vite** - Build tool

## Structure du projet

```
frontend/
├── src/
│   ├── pages/
│   │   ├── DashboardPage.tsx      # Page d'accueil/dashboard
│   │   ├── ProfileEditPage.tsx    # Modification du profil
│   │   ├── WorkExperiencesPage.tsx # Gestion des expériences
│   │   ├── EducationsPage.tsx     # Gestion des diplômes
│   │   └── ProjectsPage.tsx       # Gestion des projets
│   ├── App.tsx                     # Composant racine avec routage
│   ├── apollo-client.ts            # Configuration Apollo Client
│   ├── graphql.ts                  # Requêtes et mutations GraphQL
│   ├── main.tsx                    # Point d'entrée
│   └── index.css                   # Styles globaux
├── vite.config.ts                  # Configuration Vite
├── tsconfig.json                   # Configuration TypeScript
└── package.json                    # Dépendances
```

## Variables d'environnement

Par défaut, l'API est configurée sur `http://localhost:8080/graphql`. 
Pour modifier l'URL, éditez le fichier `src/apollo-client.ts`.

## Notes

- L'ID du profil est actuellement défini à `1`. Modifiez la variable `profileId` dans `App.tsx` pour utiliser un profil différent.
- Les formulaires incluent une validation de base côté client.
- L'authentification n'est pas encore implémentée.

