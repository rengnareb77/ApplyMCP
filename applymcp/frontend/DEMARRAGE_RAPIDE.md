# 🚀 Démarrage Rapide

## Installation et Lancement

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances (déjà fait)
npm install

# Lancer en développement
npm run dev

# L'application est maintenant sur http://localhost:5173
```

## Pages Disponibles

| Route | Description |
|-------|-------------|
| **/** | 📊 Dashboard - Vue d'ensemble du profil |
| **/profile** | 👤 Modifier mon résumé professionnel |
| **/experiences** | 💼 Ajouter/Supprimer des expériences |
| **/educations** | 🎓 Ajouter/Supprimer des diplômes |
| **/projects** | 🚀 Ajouter/Supprimer des projets |

## Fonctionnalités Principales

✅ **Dashboard complet** - Vue d'ensemble de votre profil  
✅ **Modification du profil** - Mettez à jour votre résumé  
✅ **Gestion des expériences** - Ajoutez/supprimez des postes  
✅ **Gestion des diplômes** - Ajoutez/supprimez des formations  
✅ **Gestion des projets** - Ajoutez/supprimez vos réalisations  
✅ **Interface moderne** - Design responsive avec Tailwind CSS  
✅ **Navigation fluide** - React Router v7  
✅ **Intégration GraphQL** - Connexion avec le backend  

## Configuration

### URL du Backend
Par défaut: `http://localhost:8080/graphql`

Pour modifier, éditez `src/apollo-client.ts`:
```typescript
const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';
```

### ID du Profil
Par défaut: `1`

Pour modifier, éditez `src/App.tsx`:
```typescript
const profileId = '1'; // Changez cette valeur
```

## Points Clés

- 🎨 Design avec Tailwind CSS
- ⚛️ React 19 + TypeScript
- 🔀 Routage avec React Router v7
- 📡 Communication GraphQL simplifiée
- 📱 Responsive et accessible
- ✨ Animations et feedback utilisateur

## Prochaines Étapes

1. Assurez-vous que le backend est lancé sur `http://localhost:8080`
2. Lancez `npm run dev` pour démarrer le frontend
3. Naviguez dans les pages via la barre en haut
4. Testez l'ajout/modification/suppression de données

## 📚 Documentation Complète

Pour plus de détails, consultez:
- **GUIDE_UTILISATION.md** - Guide complet en français
- **RESUME_CREATION.md** - Détails techniques et améliorations futures

---

**C'est prêt à utiliser! 🎉**

