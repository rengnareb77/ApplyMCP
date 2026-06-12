# Guide d'Utilisation - Frontend ApplyMCP

## 🎉 Nouvelles Pages Créées

J'ai créé une suite complète de pages pour gérer votre profil professionnel. Voici ce qui a été mis en place:

### Pages Disponibles

1. **Dashboard (Accueil)** - `/`
   - Vue d'ensemble complète de votre profil
   - Affichage de votre résumé professionnel
   - Raccourcis vers toutes les sections de gestion
   - Affichage de vos compétences
   - Liens vers LinkedIn, GitHub, Portfolio

2. **Modifier Mon Profil** - `/profile`
   - Mise à jour de votre résumé professionnel
   - Affichage (lecture seule) de vos informations personnelles
   - Métadonnées de contact (email, téléphone, adresse)

3. **Gestion des Expériences Professionnelles** - `/experiences`
   - Ajouter une nouvelle expérience professionnelle
   - Remplir: Entreprise, Poste, Dates, Localisation, Type de contrat
   - Ajouter une description et réalisations principales
   - Supprimer une expérience existante
   - Liste complète de vos expériences

4. **Gestion des Diplômes** - `/educations`
   - Ajouter un nouveau diplôme ou certification
   - Remplir: Établissement, Diplôme, Dates, Localisation
   - Ajouter une description détaillée
   - Supprimer un diplôme existant
   - Liste complète de vos formations

5. **Gestion des Projets** - `/projects`
   - Ajouter un nouveau projet
   - Remplir: Titre, Description, URLs (repository et démo)
   - Supprimer un projet existant
   - Affichage en grille avec liens cliquables

## 🚀 Démarrage

### Installation des dépendances
```bash
cd frontend
npm install
```

### Lancer le serveur de développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Compiler pour la production
```bash
npm run build
```

## 📋 Fonctionnalités

### ✅ Gestion du Profil
- ✨ Modification du résumé professionnel
- 👀 Affichage des informations personnelles
- 🔗 Liens vers réseaux sociaux

### 💼 Gestion des Expériences
- ➕ Ajout d'une nouvelle expérience
- 📊 Affichage formaté avec bordures colorées
- ❌ Suppression avec confirmation
- 📝 Champs: Entreprise, Poste, Dates, Localisation, Type de contrat, Description

### 🎓 Gestion des Diplômes
- ➕ Ajout d'un nouveau diplôme
- 📊 Affichage avec dates et localisation
- ❌ Suppression avec confirmation
- 📝 Champs: Établissement, Diplôme, Dates, Description

### 🚀 Gestion des Projets
- ➕ Ajout d'un nouveau projet
- 📊 Affichage en grille avec descriptions
- 🔗 Liens vers repository et démo en ligne
- ❌ Suppression avec confirmation

## 🎨 Design

- **Interface Moderne**: Utilise Tailwind CSS pour un design épuré et responsive
- **Navigation Simple**: Barre de navigation fixe avec accès rapide à toutes les sections
- **Design Responsif**: Fonctionne sur desktop, tablette et mobile
- **Feedback Utilisateur**: Alertes de confirmations et messages d'erreur

## 📱 Technologies Utilisées

- **React 19** - Framework UI moderne
- **TypeScript** - Langage typé pour plus de fiabilité
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router v7** - Gestion du routage
- **Vite** - Build tool ultrarapide
- **Fetch API** - Communication GraphQL simple (sans Apollo Client)

## 🔧 Configuration

### URL de l'API GraphQL
Par défaut: `http://localhost:8080/graphql`

Pour modifier cette URL, éditez le fichier `src/apollo-client.ts`:
```typescript
const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';
```

### ID du Profil
Par défaut: `1`

Pour modifier l'ID du profil, changez la valeur dans `src/App.tsx`:
```typescript
const profileId = '1'; // Changez cette valeur
```

## 📁 Structure des Fichiers

```
frontend/src/
├── pages/
│   ├── DashboardPage.tsx        # Page d'accueil
│   ├── ProfileEditPage.tsx      # Édition du profil
│   ├── WorkExperiencesPage.tsx  # Gestion des expériences
│   ├── EducationsPage.tsx       # Gestion des diplômes
│   └── ProjectsPage.tsx         # Gestion des projets
├── App.tsx                       # Composant principal avec routage
├── apollo-client.ts             # Utilitaire GraphQL
├── graphql.ts                   # Requêtes GraphQL
├── main.tsx                     # Point d'entrée
└── index.css                    # Styles globaux
```

## 🌐 Navigation

- **Barre de navigation** en haut avec liens vers toutes les pages
- **Cartes interactives** au dashboard pour accéder rapidement à chaque section
- **Liens relatifs** pour naviguer facilement

## ⚠️ Notes Importantes

1. **Profil ID**: L'ID du profil est actuellement fixé à `1`. Vous pouvez le rendre dynamique si nécessaire.

2. **Authentification**: L'authentification n'est pas implémentée actuellement. À ajouter si nécessaire.

3. **Validation**: La validation côté client est minimaliste. Vous pouvez ajouter `react-hook-form` ou `zod` pour plus de validation.

4. **Erreurs API**: Les erreurs de l'API GraphQL sont affichées à l'utilisateur avec des messages clairs.

5. **Confirmation de Suppression**: Toutes les suppressions demandent une confirmation avant d'être exécutées.

## 🐛 Dépannage

### L'API n'est pas accessible
- Vérifiez que le serveur backend est lancé sur `http://localhost:8080`
- Vérifiez que le endpoint GraphQL est sur `/graphql`

### Les changements ne s'affichent pas
- Actualisez la page manuelle ou attendez que le système se mette à jour
- Vérifiez la console du navigateur pour les erreurs

### Problèmes de compilation
```bash
npm install
npm run build
```

## 📞 Support et Améliorations

Si vous avez besoin de:
- Ajouter d'autres champs au profil
- Modifier le design
- Ajouter de nouvelles pages
- Implémenter l'authentification

Assurez-vous que les mutations GraphQL correspondantes existent dans votre backend.

## ✨ Prochaines Étapes

1. Configurer l'authentification
2. Ajouter la validation robuste avec `react-hook-form`
3. Implémenter un système de notifications (`react-hot-toast`)
4. Ajouter la possibilité de générer un CV/PDF
5. Créer une section d'aperçu public du profil

---

**Bon développement! 🚀**

