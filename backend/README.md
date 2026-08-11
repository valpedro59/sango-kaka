# Backend — SANGO-KAKA

Node.js + Express, avec **json-server monté en middleware** pour générer automatiquement les routes CRUD à partir de `data/db.json`.

## Prérequis

- Node.js 18+
- npm

## Installation

```bash
cd backend
npm install
cp .env.example .env
```

## Démarrage

```bash
npm run dev
```

Le serveur démarre par défaut sur `http://localhost:3001`. Toutes les routes sont préfixées par `/api` (voir [`../API.md`](../API.md) pour le détail complet).

Test rapide une fois lancé :

```bash
curl http://localhost:3001/api/annonces
```

## Architecture

### Pourquoi json-server + Express plutôt que l'un ou l'autre seul

- **json-server seul** : rapide mais aucune logique métier possible (pas de calcul, pas de validation).
- **Express seul** : flexible mais il faudrait coder chaque route CRUD à la main, trop long pour un MVP en 3 semaines.
- **json-server monté comme middleware dans Express** (notre choix) : les routes CRUD standard sont générées automatiquement, et on ajoute des routes Express custom par-dessus dès qu'on a besoin de logique métier (note moyenne, modération, validations spécifiques).

### `server.js` — structure

```javascript
const express = require("express");
const jsonServer = require("json-server");
const cors = require("cors");
require("dotenv").config();

const app = express();
const router = jsonServer.router("data/db.json");

app.use(cors());
app.use(express.json());

// Routes CRUD automatiques : /api/annonces, /api/vendeurs, /api/avis, /api/signalements
app.use("/api", router);

// Routes custom : ajoutées AVANT ou APRÈS le router selon le besoin
// (avant si elles doivent intercepter une route standard, après sinon)
app.get("/api/vendeurs/:id/note-moyenne", (req, res) => {
  const db = router.db;
  const avis = db
    .get("avis")
    .filter({ vendeurId: parseInt(req.params.id) })
    .value();
  if (!avis.length) return res.json({ note: 0 });
  const moyenne = avis.reduce((sum, a) => sum + a.note, 0) / avis.length;
  res.json({ note: Math.round(moyenne * 10) / 10 });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
```

### Où écrire une nouvelle route custom

Toutes les routes custom vivent dans `server.js` pour le MVP (pas besoin de sur-architecturer sur 3 semaines). Si le fichier grossit trop, on pourra extraire dans un dossier `routes/` — à rediscuter en équipe si besoin.

Convention : une route custom = une fonctionnalité qui n'est **pas** un simple CRUD (calcul, agrégation, validation métier). Le CRUD basique passe toujours par json-server.

## Répartition des rôles backend

| Zone                                                           | Responsable |
| -------------------------------------------------------------- | ----------- |
| Routes annonces & recherche (filtres, catégories)              | À compléter |
| Routes profils, avis & modération (note moyenne, signalements) | À compléter |

Avant d'ajouter une route, vérifie qu'elle est bien listée dans [`../API.md`](../API.md). Si elle n'y est pas encore, ajoute-la au contrat d'API en même temps que ton code, pour que le frontend sache qu'elle existe.

## Variables d'environnement

Voir `.env.example`. Ne jamais committer `.env`.

## Données de test

`data/db.json` contient les données de développement. Ne pas hésiter à le compléter avec des cas réalistes (plusieurs quartiers, plusieurs catégories, vendeurs avec et sans avis) pour que le frontend puisse tester tous les cas.
