# Contribuer au projet SANGO-KAKA

## Workflow Git

- `main` est **protégée** : aucun push direct, tout passe par une Pull Request.
- Une branche par tâche, jamais de travail direct sur `main`.

### Convention de nommage des branches

```
feature/<courte-description>     → nouvelle fonctionnalité
fix/<courte-description>         → correction de bug
chore/<courte-description>       → config, dépendances, setup
docs/<courte-description>        → documentation uniquement
```

Exemples :

```
feature/depot-annonce-formulaire
feature/route-signalement
fix/calcul-note-moyenne
chore/setup-tailwind
```

### Convention de commits

Format court et explicite, à l'impératif :

```
feat: ajoute le formulaire de dépôt d'annonce
fix: corrige le filtre de recherche par quartier
chore: configure Tailwind CSS
docs: complète API.md avec la route signalements
```

## Process de Pull Request

1. Crée ta branche depuis `main` à jour (`git pull origin main` avant de partir).
2. Committe régulièrement, avec des messages clairs.
3. Ouvre une PR dès que la fonctionnalité est testable, même incomplète (marque-la `[WIP]` dans le titre si besoin).
4. Décris dans la PR : ce qui a été fait, comment tester, captures d'écran si UI.
5. Demande une review au Lead Dev ou à un pair avant merge.
6. Une fois approuvée, merge avec **squash and merge** pour garder un historique propre sur `main`.
7. Supprime la branche après merge.

## Avant de push

- Vérifie que le projet démarre sans erreur (`npm run dev` côté concerné).
- Pas de fichier `.env`, `node_modules/`, ou secret commité (vérifie `.gitignore`).
- Pas de `console.log` de debug oublié dans le code final.

## Suivi du projet

- Kanban partagé pour suivre les tâches (colonnes : À faire / En cours / En review / Terminé).
- Point d'avancement en équipe à la fin de chaque semaine du sprint.
- Toute question de blocage ou de dépendance entre tâches : le signaler tôt sur le canal de communication du projet plutôt que d'attendre le point hebdo.

## Qui contacter

| Sujet                              | Contact                                               |
| ---------------------------------- | ----------------------------------------------------- |
| Architecture, décisions techniques | Val Clancy Pedro (Lead Dev)                           |
| Contrat d'API, ajout de route      | Voir [`API.md`](./API.md), puis Lead Dev si ambiguïté |
| Setup backend                      | Voir [`backend/README.md`](./backend/README.md)       |
| Setup frontend                     | Voir [`frontend/README.md`](./frontend/README.md)     |
