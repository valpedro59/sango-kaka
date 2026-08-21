# Backend — SANGO-KAKA

Node.js + Express en **ESM** (`import`/`export`), avec **json-server monté en middleware** pour générer automatiquement les routes CRUD à partir de `data/db.json`.

## Prérequis

- Node.js 18+
- npm

## Installation

```bash
cd backend
npm install
cp .env.example .env
```

Dépendances clés (voir `package.json`) :

```json
{
  "type": "module",
  "dependencies": {
    "express": "^4.19.2",
    "json-server": "0.17.4",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  }
}
```

⚠️ **`json-server` doit rester fixé en `0.17.4`**, sans caret (`^`) ni version plus récente. La v1.x de json-server change complètement l'API interne de la base (`router.db`), incompatible avec la syntaxe utilisée dans nos routes custom (`db.get(...).filter(...).value()`). Si `npm install json-server` installe autre chose, vérifier avec `npm ls json-server` et réinstaller la bonne version si besoin.

## Démarrage

```bash
npm run dev
```

Le serveur démarre par défaut sur `http://localhost:3000` (voir `.env`). Toutes les routes sont préfixées par `/api` (détail complet : [`../API.md`](../API.md)).

Test rapide une fois lancé :

```bash
curl http://localhost:3000/api/annonces
```

**Important :** lance toujours `npm run dev` depuis le dossier `backend/`. Le chemin `"data/db.json"` passé à `jsonServer.router()` est résolu relativement au dossier depuis lequel Node est exécuté, pas relativement à l'emplacement du fichier qui contient ce code.

## Structure du dossier

```
backend/
├── data/
│   └── db.json              # source de données (collections en français)
├── src/
│   ├── app.js                 # configuration Express + montage des routes
│   ├── routes/
│   │   ├── annonces.js         # routes custom annonces (Benit)
│   │   ├── utilisateurs.js     # routes custom utilisateurs (Ceti)
│   │   └── signalements.js     # routes custom signalements (Ceti)
│   ├── controllers/            # réservé : extraire la logique des routes ici si un fichier grossit trop
│   └── middlewares/             # réservé : middlewares transverses (ex: validation, auth future)
├── server.js                   # point d'entrée : lance app.js sur le port choisi
├── package.json
└── .env
```

`controllers/` et `middlewares/` sont vides pour l'instant — c'est volontaire. Pour un MVP en 3 semaines, la logique reste directement dans `routes/` tant qu'un fichier de route ne dépasse pas une taille raisonnable. Si `signalements.js` ou `utilisateurs.js` grossit trop, on extraira la logique métier dans `controllers/` — à décider en équipe le moment venu, pas besoin d'anticiper maintenant.

## Architecture : pourquoi json-server + Express

- **json-server seul** : rapide mais aucune logique métier possible (pas de calcul, pas de validation).
- **Express seul** : flexible mais il faudrait coder chaque route CRUD à la main.
- **json-server monté en middleware dans Express** (notre choix) : les routes CRUD standard sont générées automatiquement, et on ajoute des routes custom par-dessus dès qu'on a besoin de logique métier (note moyenne, modération).

### `server.js` — point d'entrée

```javascript
import app from "./src/app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
```

### `src/app.js` — assemblage

```javascript
import express from "express";
import jsonServer from "json-server";
import cors from "cors";
import "dotenv/config";

import utilisateursRoutes from "./routes/utilisateurs.js";
import signalementsRoutes from "./routes/signalements.js";
import annoncesRoutes from "./routes/annonces.js";

const app = express();
const router = jsonServer.router("data/db.json");

app.use(cors());

// Routes custom, montées AVANT le router json-server
app.use("/api/utilisateurs", utilisateursRoutes(router.db));
app.use("/api/signalements", signalementsRoutes(router.db));
app.use("/api/annonces", annoncesRoutes(router.db));

// CRUD standard généré automatiquement par json-server
app.use("/api", router);

export default app;
```

## ⚠️ Piège important : pas de `express.json()` global

Contrairement à un projet Express classique, **il ne faut pas** faire `app.use(express.json())` en global dans `app.js`.

**Pourquoi :** json-server embarque déjà son propre parseur de body (body-parser interne) pour ses routes CRUD. Un `express.json()` global lit le flux de la requête en premier ; quand json-server essaie de le relire à son tour pour une route qui lui retombe dessus (ex: `POST /api/annonces`, non interceptée par une route custom), le flux est déjà épuisé → erreur `500 stream is not readable`.

**La règle à suivre :** chaque route custom qui a besoin de `req.body` applique `express.json()` **localement, sur cette route précise uniquement** :

```javascript
// Dans routes/signalements.js
router.post("/", express.json(), (req, res) => {
  // req.body est disponible ici uniquement
});
```

Ne jamais faire `router.use(express.json())` ni `app.use(express.json())` de façon globale — ça recréerait le même bug pour toute route qui continue vers json-server.

## Schéma de données (`data/db.json`)

Toutes les collections et tous les champs sont en français.

| Collection     | Champs principaux                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `utilisateurs` | id, prenom, nom, telephone, whatsapp, email, avatar, bio, estVerifie, dateCreation                                                |
| `categories`   | id, nom, slug, icone                                                                                                              |
| `quartiers`    | id, nom, ville                                                                                                                    |
| `annonces`     | id, titre, description, prix, devise, categorieId, quartierId, vendeurId, images, statut, estEnAvant, vues, dateCreation, dateMaj |
| `avis`         | id, vendeurId, auteurId, note, commentaire, dateCreation                                                                          |
| `signalements` | id, annonceId, signaleParId, raison, description, statut, dateCreation                                                            |

Détail complet des routes et exemples de requêtes/réponses : [`../API.md`](../API.md).

## Où écrire une nouvelle route custom

Convention : une route custom = une fonctionnalité qui n'est **pas** un simple CRUD (calcul, agrégation, validation métier, effet de bord comme la modération automatique). Le CRUD basique passe toujours par json-server sur `/api`.

| Zone                                               | Fichier                      | Responsable                 |
| -------------------------------------------------- | ---------------------------- | --------------------------- |
| Annonces (recherche avancée, incrément de vues...) | `src/routes/annonces.js`     | Benit Mamonsono + Val Pedro |
| Utilisateurs (note moyenne...)                     | `src/routes/utilisateurs.js` | Ceti Louamba + Val Pedro    |
| Signalements (création + modération auto)          | `src/routes/signalements.js` | Ceti Louamba + Val Pedro    |

Avant d'ajouter une route, vérifie qu'elle est bien listée dans [`../API.md`](../API.md). Si elle n'y est pas encore, ajoute-la au contrat d'API en même temps que ton code.

## Variables d'environnement

Voir `.env.example`. Ne jamais committer `.env`.

```
PORT=3000
```

## Données de test

`data/db.json` contient les données de développement. Complète-le avec des cas réalistes (plusieurs quartiers, catégories, utilisateurs avec et sans avis) pour que le frontend puisse tester tous les cas dès maintenant.
